import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Dentribe...");

  // ── Especialidades ────────────────────────────────────────────────────────
  const especialidades = [
    { name: "Ortodoncia",            slug: "ortodoncia" },
    { name: "Implantes dentales",    slug: "implantes-dentales" },
    { name: "Blanqueamiento dental", slug: "blanqueamiento-dental" },
    { name: "Endodoncia",            slug: "endodoncia" },
    { name: "Pediatría dental",      slug: "pediatria-dental" },
    { name: "Periodoncia",           slug: "periodoncia" },
    { name: "Cirugía oral",          slug: "cirugia-oral" },
    { name: "Prostodoncia",          slug: "prostodoncia" },
    { name: "Odontología estética",  slug: "odontologia-estetica" },
    { name: "Urgencias dentales",    slug: "urgencias-dentales" },
    { name: "Odontología general",   slug: "odontologia-general" },
  ];

  for (const esp of especialidades) {
    await db.specialty.upsert({
      where: { slug: esp.slug },
      update: {},
      create: esp,
    });
  }

  const specs = await db.specialty.findMany();
  const bySlug = Object.fromEntries(specs.map((s) => [s.slug, s.id]));

  // ── Paciente demo ─────────────────────────────────────────────────────────
  await db.user.upsert({
    where: { email: "paciente@dentribe.com" },
    update: {},
    create: {
      name: "Ana García",
      email: "paciente@dentribe.com",
      password: await bcrypt.hash("password123", 10),
      role: "PATIENT",
    },
  });

  // ── Helper para crear dentista ────────────────────────────────────────────
  async function crearDentista(data: {
    email: string;
    name: string;
    clinicName: string;
    bio: string;
    phone: string;
    city: string;
    country: string;
    licenseNo: string;
    avatar: string;
    verified: boolean;
    featured: boolean;
    plan: string;
    specialtySlugs: string[];
    reviews: { patientName: string; patientEmail: string; rating: number; comment: string }[];
  }) {
    const user = await db.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        name: data.name,
        email: data.email,
        password: await bcrypt.hash("password123", 10),
        role: "DENTIST",
      },
    });

    const dentist = await db.dentist.upsert({
      where: { ownerId: user.id },
      update: {},
      create: {
        ownerId: user.id,
        clinicName: data.clinicName,
        bio: data.bio,
        phone: data.phone,
        city: data.city,
        country: data.country,
        licenseNo: data.licenseNo,
        avatar: data.avatar,
        verified: data.verified,
        featured: data.featured,
      },
    });

    // Especialidades
    for (const slug of data.specialtySlugs) {
      const specId = bySlug[slug];
      if (!specId) continue;
      await db.dentistSpecialty.upsert({
        where: { dentistId_specialtyId: { dentistId: dentist.id, specialtyId: specId } },
        update: {},
        create: { dentistId: dentist.id, specialtyId: specId },
      });
    }

    // Suscripción
    await db.subscription.upsert({
      where: { dentistId: dentist.id },
      update: {},
      create: {
        dentistId: dentist.id,
        plan: data.plan,
        status: "ACTIVE",
      },
    });

    // Reseñas
    for (const r of data.reviews) {
      const patient = await db.user.upsert({
        where: { email: r.patientEmail },
        update: {},
        create: {
          name: r.patientName,
          email: r.patientEmail,
          password: await bcrypt.hash("password123", 10),
          role: "PATIENT",
        },
      });

      const appointment = await db.appointment.create({
        data: {
          patientId: patient.id,
          dentistId: dentist.id,
          date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 60),
          status: "COMPLETED",
        },
      });

      await db.review.create({
        data: {
          appointmentId: appointment.id,
          patientId: patient.id,
          dentistId: dentist.id,
          rating: r.rating,
          comment: r.comment,
        },
      });
    }

    return dentist;
  }

  // ── Dentistas demo ────────────────────────────────────────────────────────

  await crearDentista({
    email: "elena.martinez@dentribe.com",
    name: "Dra. Elena Martínez",
    clinicName: "Clínica Martínez Ortodoncia",
    bio: "Especialista en ortodoncia invisible y brackets estéticos con más de 12 años de experiencia. Formada en la Universidad Complutense de Madrid y con máster en ortodoncia en la Universidad de Barcelona.",
    phone: "+34 91 234 56 78",
    city: "Madrid",
    country: "España",
    licenseNo: "28-12345",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    verified: true,
    featured: true,
    plan: "PREMIUM",
    specialtySlugs: ["ortodoncia", "odontologia-estetica"],
    reviews: [
      { patientName: "Carlos Ruiz", patientEmail: "carlos.ruiz@demo.com", rating: 5, comment: "Excelente profesional, muy atenta y minuciosa. Mi tratamiento de ortodoncia invisible quedó perfecto." },
      { patientName: "María López", patientEmail: "maria.lopez@demo.com", rating: 5, comment: "La mejor ortodoncista que he visitado. Explica todo con detalle y el resultado es increíble." },
      { patientName: "Pedro Sánchez", patientEmail: "pedro.sanchez@demo.com", rating: 4, comment: "Muy buena atención y clínica muy moderna. Totalmente recomendable." },
    ],
  });

  await crearDentista({
    email: "james.wilson@dentribe.com",
    name: "Dr. James Wilson",
    clinicName: "Wilson Dental Implants London",
    bio: "Implantologist with over 15 years of experience in complex full-arch restorations. Fellow of the Royal College of Surgeons. Trained at King's College London.",
    phone: "+44 20 7946 0123",
    city: "London",
    country: "Reino Unido",
    licenseNo: "GDC-123456",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    verified: true,
    featured: true,
    plan: "PREMIUM",
    specialtySlugs: ["implantes-dentales", "cirugia-oral", "prostodoncia"],
    reviews: [
      { patientName: "Sophie Turner", patientEmail: "sophie.turner@demo.com", rating: 5, comment: "Dr. Wilson is exceptional. My full arch implants look and feel completely natural." },
      { patientName: "Marco Bianchi", patientEmail: "marco.bianchi@demo.com", rating: 5, comment: "Traveled from Italy for this treatment. Absolutely worth it. Professional and caring." },
    ],
  });

  await crearDentista({
    email: "sophie.dubois@dentribe.com",
    name: "Dra. Sophie Dubois",
    clinicName: "Cabinet Dubois Esthétique Dentaire",
    bio: "Spécialiste en dentisterie esthétique et blanchiment professionnel. Diplômée de l'Université Paris Descartes. 8 ans d'expérience en sourire design.",
    phone: "+33 1 42 33 44 55",
    city: "París",
    country: "Francia",
    licenseNo: "FR-75-98765",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=500&fit=crop&crop=face",
    verified: true,
    featured: false,
    plan: "FREE",
    specialtySlugs: ["odontologia-estetica", "blanqueamiento-dental"],
    reviews: [
      { patientName: "Isabelle Martin", patientEmail: "isabelle.martin@demo.com", rating: 5, comment: "Mon sourire a complètement changé. Merci Dr. Dubois pour ce travail magnifique!" },
      { patientName: "Laura García", patientEmail: "laura.garcia@demo.com", rating: 4, comment: "Très professionnelle et à l'écoute. Je recommande vivement." },
      { patientName: "Thomas Bernard", patientEmail: "thomas.bernard@demo.com", rating: 5, comment: "Résultat blanchiment parfait, sourire naturel. Excellente expérience." },
    ],
  });

  await crearDentista({
    email: "carlos.mendoza@dentribe.com",
    name: "Dr. Carlos Mendoza",
    clinicName: "Endodoncia Avanzada CDMX",
    bio: "Especialista en endodoncia y tratamientos de conducto con tecnología rotativa y microscopio dental. 10 años de práctica en Ciudad de México con formación en la UNAM.",
    phone: "+52 55 1234 5678",
    city: "Ciudad de México",
    country: "México",
    licenseNo: "MX-CDMX-54321",
    avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&h=500&fit=crop&crop=face",
    verified: true,
    featured: false,
    plan: "FREE",
    specialtySlugs: ["endodoncia", "odontologia-general", "urgencias-dentales"],
    reviews: [
      { patientName: "Valentina Cruz", patientEmail: "valentina.cruz@demo.com", rating: 5, comment: "El Dr. Mendoza me salvó una muela que creía perdida. Sin dolor y con mucha profesionalidad." },
      { patientName: "Roberto Jiménez", patientEmail: "roberto.jimenez@demo.com", rating: 4, comment: "Muy buen especialista, explica el procedimiento con claridad. Totalmente recomendable." },
    ],
  });

  await crearDentista({
    email: "anna.kowalski@dentribe.com",
    name: "Dra. Anna Kowalski",
    clinicName: "Pediatric Smile Clinic Varsovia",
    bio: "Odontopediatra especializada en el tratamiento de niños con miedo al dentista. Técnicas de sedación consciente y ambiente lúdico. Formada en la Universidad de Varsovia.",
    phone: "+48 22 987 65 43",
    city: "Varsovia",
    country: "Polonia",
    licenseNo: "PL-WA-11223",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    verified: true,
    featured: false,
    plan: "PREMIUM",
    specialtySlugs: ["pediatria-dental", "odontologia-general"],
    reviews: [
      { patientName: "Agnieszka Nowak", patientEmail: "agnieszka.nowak@demo.com", rating: 5, comment: "Mi hijo tenía terror al dentista y ahora pide ir. La Dra. Kowalski es un ángel." },
      { patientName: "Piotr Wiśniewski", patientEmail: "piotr.wisniewski@demo.com", rating: 5, comment: "Increíble paciencia con los niños. La clínica es preciosa y muy acogedora." },
    ],
  });

  await crearDentista({
    email: "miguel.ferreira@dentribe.com",
    name: "Dr. Miguel Ferreira",
    clinicName: "Ferreira Clínica Dental Lisboa",
    bio: "Periodoncista con especialización en cirugía gingival y regeneración ósea guiada. Más de 14 años de experiencia en Lisboa. Formado en la Universidade de Lisboa.",
    phone: "+351 21 345 67 89",
    city: "Lisboa",
    country: "Portugal",
    licenseNo: "PT-OMD-33445",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    verified: true,
    featured: false,
    plan: "FREE",
    specialtySlugs: ["periodoncia", "cirugia-oral", "implantes-dentales"],
    reviews: [
      { patientName: "Catarina Silva", patientEmail: "catarina.silva@demo.com", rating: 5, comment: "Excelente periodoncista. Resolveu o meu problema de gengivas em poucos meses." },
      { patientName: "João Pereira", patientEmail: "joao.pereira@demo.com", rating: 4, comment: "Muito profissional e atencioso. Recomendo a toda a gente." },
    ],
  });

  await crearDentista({
    email: "laura.rossi@dentribe.com",
    name: "Dra. Laura Rossi",
    clinicName: "Studio Dentistico Rossi Milano",
    bio: "Prostodontista especializada en rehabilitación oral completa con coronas, puentes y prótesis sobre implantes. Formada en la Università degli Studi di Milano.",
    phone: "+39 02 8765 4321",
    city: "Milán",
    country: "Italia",
    licenseNo: "IT-MI-77890",
    avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&crop=face",
    verified: false,
    featured: false,
    plan: "FREE",
    specialtySlugs: ["prostodoncia", "implantes-dentales", "odontologia-estetica"],
    reviews: [],
  });

  console.log("✅ Seed completado: 6 dentistas verificados + 1 pendiente de verificación");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
