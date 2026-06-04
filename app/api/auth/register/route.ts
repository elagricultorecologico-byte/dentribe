import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

// ─── Schemas de validación ────────────────────────────────────────────────────

const esquemaPaciente = z.object({
  role: z.literal("PATIENT"),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

const esquemaDentista = z.object({
  role: z.literal("DENTIST"),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  // Campos de Dentist (todos opcionales salvo clinicName)
  clinicName: z.string().min(2, { message: "El nombre de la clínica es obligatorio" }),
  bio: z.string().optional(),
  phone: z.string().optional(),
  website: z.url({ message: "URL inválida" }).optional().or(z.literal("")),
  licenseNo: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  // Especialidades: array de nombres de especialidad
  specialties: z.array(z.string()).optional(),
});

// Especialidades predefinidas válidas en el sistema
const ESPECIALIDADES_SISTEMA = new Set([
  "Ortodoncia",
  "Implantes dentales",
  "Blanqueamiento dental",
  "Endodoncia",
  "Pediatría dental",
  "Periodoncia",
  "Cirugía oral",
  "Prostodoncia",
  "Odontología estética",
  "Urgencias dentales",
  "Odontología general",
]);

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    // Extraer el rol primero para aplicar el schema correcto
    const rolParsed = z
      .object({ role: z.enum(["PATIENT", "DENTIST"]) })
      .safeParse(body);

    if (!rolParsed.success) {
      return NextResponse.json(
        { error: "Rol inválido", detalles: rolParsed.error.issues },
        { status: 400 }
      );
    }

    const resultado =
      rolParsed.data.role === "DENTIST"
        ? esquemaDentista.safeParse(body)
        : esquemaPaciente.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: resultado.error.issues },
        { status: 400 }
      );
    }

    const datos = resultado.data;

    // Verificar email único
    const usuarioExistente = await db.user.findUnique({
      where: { email: datos.email },
      select: { id: true },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese email" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(datos.password, 12);

    if (datos.role === "PATIENT") {
      await db.user.create({
        data: {
          name: datos.name,
          email: datos.email,
          password: hashedPassword,
          role: "PATIENT",
        },
      });
    } else {
      // Dentista: crear User + Dentist + DentistSpecialty en transacción
      const datosDentista = datos as z.infer<typeof esquemaDentista>;

      await db.$transaction(async (tx) => {
        const nuevoUsuario = await tx.user.create({
          data: {
            name: datosDentista.name,
            email: datosDentista.email,
            password: hashedPassword,
            role: "DENTIST",
          },
        });

        const nuevoDentista = await tx.dentist.create({
          data: {
            ownerId: nuevoUsuario.id,
            clinicName: datosDentista.clinicName,
            bio: datosDentista.bio ?? null,
            phone: datosDentista.phone ?? null,
            website: datosDentista.website || null,
            licenseNo: datosDentista.licenseNo ?? null,
            address: datosDentista.address ?? null,
            city: datosDentista.city ?? null,
            country: datosDentista.country ?? null,
            // Los dentistas nuevos empiezan sin verificar y sin destacar
            verified: false,
            featured: false,
          },
        });

        // Crear relaciones con especialidades válidas
        if (datosDentista.specialties?.length) {
          const especialidadesValidas = datosDentista.specialties.filter((e) =>
            ESPECIALIDADES_SISTEMA.has(e)
          );

          for (const nombreEspecialidad of especialidadesValidas) {
            // Generar slug simple: minúsculas sin tildes ni espacios
            const slug = nombreEspecialidad
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, "-");

            const especialidad = await tx.specialty.upsert({
              where: { name: nombreEspecialidad },
              update: {},
              create: { name: nombreEspecialidad, slug },
            });

            await tx.dentistSpecialty.create({
              data: {
                dentistId: nuevoDentista.id,
                specialtyId: especialidad.id,
              },
            });
          }
        }
      });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
