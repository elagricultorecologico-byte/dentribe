import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

// ─── Tipos inferidos del schema real ─────────────────────────────────────────

type DentistaCompleto = Prisma.DentistGetPayload<{
  include: {
    owner: { select: { name: true; email: true } };
    specialties: { include: { specialty: true } };
    reviews: {
      include: { patient: { select: { name: true } } };
      orderBy: { createdAt: "desc" };
    };
    subscription: { select: { plan: true; status: true } };
  };
}>;

interface PropsPagina {
  params: { id: string };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcularRatingMedio(reviews: { rating: number }[]): number {
  if (!reviews.length) return 0;
  const suma = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((suma / reviews.length) * 10) / 10;
}

function Estrellas({ rating, tamano = "sm" }: { rating: number; tamano?: "sm" | "lg" }) {
  const clase = tamano === "lg" ? "text-2xl" : "text-base";
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`${clase} ${i < Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}>
          ★
        </span>
      ))}
    </span>
  );
}

// ─── Metadata dinámica ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: PropsPagina) {
  const dentista = await db.dentist.findUnique({
    where: { id: params.id },
    select: { clinicName: true, bio: true, owner: { select: { name: true } } },
  });

  if (!dentista) return { title: "Dentista no encontrado — Dentribe" };

  const nombre = dentista.owner.name ?? dentista.clinicName;
  return {
    title: `${nombre} — Dentribe`,
    description: dentista.bio ?? `Perfil de ${nombre} en Dentribe`,
  };
}

// ─── Página (Server Component) ────────────────────────────────────────────────

export default async function PaginaPerfilDentista({ params }: PropsPagina) {
  const dentista = await db.dentist.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { name: true, email: true } },
      specialties: { include: { specialty: true } },
      reviews: {
        include: { patient: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      subscription: { select: { plan: true, status: true } },
    },
  }) satisfies DentistaCompleto | null;

  if (!dentista) notFound();

  const esPremium =
    dentista.subscription?.plan === "PREMIUM" &&
    dentista.subscription?.status === "ACTIVE";
  const ratingMedio = calcularRatingMedio(dentista.reviews);
  const nombreMostrado = dentista.owner.name ?? dentista.clinicName;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar mínimo */}
      <nav className="bg-[#0F172A] px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-end">
          <Link href="/dentistas" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Volver al directorio
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 p-8 mb-6">
          {/* Cover image si existe */}
          {dentista.coverImage && (
            <div className="relative h-40 -mx-8 -mt-8 mb-6 overflow-hidden">
              <Image
                src={dentista.coverImage}
                alt={`${dentista.clinicName} portada`}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex gap-6 flex-col sm:flex-row">
            {/* Avatar grande */}
            <div className="shrink-0">
              {dentista.avatar ? (
                <Image
                  src={dentista.avatar}
                  alt={nombreMostrado}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-full"
                />
              ) : (
                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Datos principales */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-[#0F172A]">{nombreMostrado}</h1>
                    {dentista.verified && (
                      <span className="inline-flex items-center gap-1 bg-[#0EA5E9]/10 text-[#0284c7] text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verificado
                      </span>
                    )}
                    {esPremium && (
                      <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        Premium
                      </span>
                    )}
                    {dentista.featured && !esPremium && (
                      <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        Destacado
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm mt-0.5">{dentista.clinicName}</p>

                  {/* Especialidades en el header */}
                  {dentista.specialties.length > 0 && (
                    <p className="text-[#0EA5E9] text-sm font-medium mt-1">
                      {dentista.specialties.map((ds) => ds.specialty.name).join(" · ")}
                    </p>
                  )}

                  {/* Ubicación */}
                  {(dentista.city || dentista.country) && (
                    <p className="text-slate-500 text-sm mt-1">
                      {[dentista.city, dentista.country].filter(Boolean).join(", ")}
                    </p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <Estrellas rating={ratingMedio} tamano="lg" />
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {ratingMedio > 0 ? ratingMedio.toFixed(1) : "—"}
                    </span>
                    <span className="text-sm text-slate-400">
                      ({dentista.reviews.length} {dentista.reviews.length === 1 ? "reseña" : "reseñas"})
                    </span>
                  </div>
                </div>

                {/* CTA principal */}
                <Link
                  href={`/dentistas/${dentista.id}/reservar`}
                  className="inline-block bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold px-8 py-3 transition-colors text-sm"
                >
                  Solicitar cita
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sobre mí */}
            {dentista.bio && (
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide mb-3">Sobre mí</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{dentista.bio}</p>
              </div>
            )}

            {/* Especialidades */}
            {dentista.specialties.length > 0 && (
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide mb-4">Especialidades</h2>
                <div className="grid grid-cols-2 gap-2">
                  {dentista.specialties.map((ds) => (
                    <div key={ds.specialtyId} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2">
                      <span className="w-2 h-2 rounded-full bg-[#0EA5E9] shrink-0" />
                      <span className="text-sm text-slate-700">{ds.specialty.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reseñas */}
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide mb-4">
                Reseñas de pacientes
              </h2>

              {dentista.reviews.length === 0 ? (
                <p className="text-sm text-slate-400">Este dentista aún no tiene reseñas.</p>
              ) : (
                <div className="space-y-4">
                  {dentista.reviews.map((reseña) => (
                    <div key={reseña.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Estrellas rating={reseña.rating} />
                          <span className="text-sm font-semibold text-[#0F172A]">
                            {reseña.rating}/5
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(reseña.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {reseña.comment && (
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{reseña.comment}</p>
                      )}
                      {/* Nombre anonimizado: solo inicial + apellido si existe */}
                      <p className="text-xs text-slate-400 mt-1">
                        {reseña.patient.name
                          ? `${reseña.patient.name.charAt(0)}. — Paciente verificado`
                          : "Paciente verificado"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Información de contacto y clínica */}
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide mb-4">Información</h2>
              <dl className="space-y-3">
                {dentista.licenseNo && (
                  <div>
                    <dt className="text-xs text-slate-400 font-medium uppercase tracking-wide">Nº Colegiado</dt>
                    <dd className="text-sm text-[#0F172A] font-semibold mt-0.5">{dentista.licenseNo}</dd>
                  </div>
                )}

                {dentista.address && (
                  <div>
                    <dt className="text-xs text-slate-400 font-medium uppercase tracking-wide">Dirección</dt>
                    <dd className="text-sm text-[#0F172A] mt-0.5">{dentista.address}</dd>
                  </div>
                )}

                {dentista.phone && (
                  <div>
                    <dt className="text-xs text-slate-400 font-medium uppercase tracking-wide">Teléfono</dt>
                    <dd className="text-sm mt-0.5">
                      <a href={`tel:${dentista.phone}`} className="text-[#0F172A] hover:text-[#0EA5E9] transition-colors">
                        {dentista.phone}
                      </a>
                    </dd>
                  </div>
                )}

                {dentista.website && (
                  <div>
                    <dt className="text-xs text-slate-400 font-medium uppercase tracking-wide">Web</dt>
                    <dd className="text-sm mt-0.5">
                      <a
                        href={dentista.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0EA5E9] hover:underline truncate block"
                      >
                        {dentista.website.replace(/^https?:\/\//, "")}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* CTA solicitar cita */}
            <div className="bg-[#0F172A] p-6 text-white">
              <h3 className="font-bold text-base mb-2">¿Quieres consultar con este dentista?</h3>
              <p className="text-slate-400 text-xs mb-4">Solicita una cita online de forma rápida y segura.</p>
              <Link
                href={`/dentistas/${dentista.id}/reservar`}
                className="block w-full text-center bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold px-6 py-2.5 transition-colors text-sm"
              >
                Solicitar cita
              </Link>
            </div>
          </div>
        </div>

        {/* CTA reclamar perfil */}
        <div className="mt-8 border border-dashed border-slate-300 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">¿Eres {nombreMostrado}?</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Reclama tu perfil para añadir información, responder reseñas y gestionar tu agenda online.
            </p>
          </div>
          <Link
            href="/registro"
            className="shrink-0 border border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white font-semibold px-6 py-2 text-sm transition-colors"
          >
            Reclamar perfil
          </Link>
        </div>
      </div>
    </div>
  );
}
