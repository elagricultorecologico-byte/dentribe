import Link from "next/link";
import Image from "next/image";
import { Search, Shield, Star, Calendar, TrendingUp, UserPlus, CheckCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSearchBar } from "@/components/home/HeroSearchBar";

// ── Datos de demo ─────────────────────────────────────────────────────────────

const DENTISTAS_DESTACADOS = [
  {
    id: "1",
    nombre: "Dra. Elena Martínez",
    especialidad: "Ortodoncia",
    ciudad: "Madrid",
    pais: "España",
    rating: 4.9,
    reseñas: 127,
    foto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    premium: true,
  },
  {
    id: "2",
    nombre: "Dr. James Wilson",
    especialidad: "Implantes dentales",
    ciudad: "London",
    pais: "Reino Unido",
    rating: 4.8,
    reseñas: 94,
    foto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    premium: true,
  },
  {
    id: "3",
    nombre: "Dra. Sophie Dubois",
    especialidad: "Odontología estética",
    ciudad: "París",
    pais: "Francia",
    rating: 4.9,
    reseñas: 211,
    foto: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=500&fit=crop&crop=face",
    premium: false,
  },
  {
    id: "4",
    nombre: "Dr. Carlos Mendoza",
    especialidad: "Endodoncia",
    ciudad: "Ciudad de México",
    pais: "México",
    rating: 4.7,
    reseñas: 83,
    foto: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&h=500&fit=crop&crop=face",
    premium: false,
  },
];

const TESTIMONIOS = [
  {
    nombre: "Laura Sánchez",
    ciudad: "Barcelona",
    texto: "Encontré a mi ortodoncista en menos de 5 minutos. Las reseñas eran exactas y la cita fue perfecta. ¡Nunca había sido tan fácil!",
    rating: 5,
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    nombre: "Marco Rossi",
    ciudad: "Milán",
    texto: "Llevaba meses buscando un especialista en implantes. Dentribe me ayudó a comparar 6 clínicas distintas y elegir la mejor para mi caso.",
    rating: 5,
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    nombre: "Ana Ferreira",
    ciudad: "Lisboa",
    texto: "Lo mejor es poder leer las reseñas reales de otros pacientes antes de decidir. Da mucha tranquilidad, especialmente para procedimientos importantes.",
    rating: 5,
    foto: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const ESPECIALIDADES = [
  { nombre: "Ortodoncia",       img: "/images/ortodoncia.png"      },
  { nombre: "Implantes",        img: "/images/implantes.png"       },
  { nombre: "Blanqueamiento",   img: "/images/blanqueamiento.png"  },
  { nombre: "Endodoncia",       img: "/images/endodoncia.png"      },
  { nombre: "Pediatría dental", img: "/images/pediatria.png"       },
  { nombre: "Periodoncia",      img: "/images/periodoncia.png"     },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Valoración: ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative text-white overflow-hidden min-h-[600px] md:min-h-[680px] flex items-center">
          {/* Imagen de fondo */}
          <Image
            src="/images/hero1.png"
            alt="Clínica dental moderna"
            fill
            className="object-cover object-center"
            priority
            quality={100}
            sizes="100vw"
          />
          {/* Overlay gradiente — oscurece para legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/30" />

          <div className="relative z-10 max-w-6xl mx-auto px-4 w-full py-20">
            <div className="max-w-2xl">
              <div className="animate-slide-in-left inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm text-blue-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
                Directorio verificado · 2.400+ dentistas en 48 países
              </div>

              <h1 className="animate-slide-in-left delay-100 text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1] tracking-tight">
                Tu dentista de confianza,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#0D9488]">
                  en cualquier rincón del mundo
                </span>
              </h1>

              <p className="animate-slide-in-left delay-200 text-lg text-blue-100/80 mb-8 max-w-xl leading-relaxed">
                Más de 2.400 dentistas verificados en 48 países. Compara valoraciones reales y reserva cita estés donde estés.
              </p>

              <div className="animate-fade-in-up delay-300 relative z-50">
                <HeroSearchBar />
              </div>

              <div className="animate-fade-in-up delay-400 mt-5 grid grid-cols-3 sm:flex gap-2 text-sm w-full">
                {["Ortodoncia", "Implantes", "Blanqueamiento", "Endodoncia", "Pediatría dental"].map((s) => (
                  <Link key={s} href={`/dentistas?especialidad=${encodeURIComponent(s.toLowerCase())}`}
                    className="sm:flex-1 text-center bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40
                               px-2 py-1.5 text-xs sm:text-sm transition-all duration-200 active:scale-95 leading-tight">
                    {s}
                  </Link>
                ))}
              </div>

              <div className="animate-fade-in-up delay-500 mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-blue-200/70">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
                  Dentistas verificados
                </span>
                <span className="w-px h-4 bg-white/20 hidden sm:block" />
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
                  Reseñas de pacientes reales
                </span>
                <span className="w-px h-4 bg-white/20 hidden sm:block" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
                  Reserva online 24/7
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ──────────────────────────────────────────────────────────── */}
        <section className="bg-[#0F172A] border-b border-white/10 py-10 px-4">
          <dl className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-0 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { value: "2.400+", label: "Dentistas verificados",  sublabel: "con credenciales comprobadas", color: "text-[#38bdf8]" },
              { value: "48",     label: "Países con cobertura",   sublabel: "activa y creciendo",            color: "text-[#2dd4bf]" },
              { value: "18.000+",label: "Reseñas de pacientes",   sublabel: "verificadas y auténticas",      color: "text-[#38bdf8]" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-6 sm:py-0 sm:px-8">
                <dt className={`text-4xl md:text-5xl font-bold tabular-nums ${stat.color}`}>{stat.value}</dt>
                <dd className="text-sm font-semibold text-slate-200 mt-1.5">{stat.label}</dd>
                <dd className="text-xs text-slate-500 mt-0.5">{stat.sublabel}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Especialidades populares ─────────────────────────────────────── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0F172A] mb-2">
              Especialidades más buscadas
            </h2>
            <p className="text-center text-slate-500 text-sm mb-10">
              Encuentra el especialista que necesitas en cualquier parte del mundo
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {ESPECIALIDADES.map((esp) => (
                <Link
                  key={esp.nombre}
                  href={`/dentistas?especialidad=${encodeURIComponent(esp.nombre.toLowerCase())}`}
                  className="group flex flex-col items-center gap-3 p-4 border border-slate-100
                             hover:border-[#0EA5E9]/30 hover:shadow-md transition-all duration-200 text-center bg-white"
                >
                  <div className="relative w-full h-24 overflow-hidden bg-slate-50">
                    <Image
                      src={esp.img}
                      alt={esp.nombre}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300 p-1"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-[#0EA5E9] transition-colors leading-tight">
                    {esp.nombre}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dentistas destacados ─────────────────────────────────────────── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">Dentistas destacados</h2>
                <p className="text-slate-500 text-sm mt-1">Profesionales verificados con las mejores valoraciones</p>
              </div>
              <Link href="/dentistas" className="hidden sm:flex items-center gap-1 text-sm text-[#0EA5E9] hover:text-[#0284c7] font-medium transition-colors">
                Ver todos →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {DENTISTAS_DESTACADOS.map((d) => (
                <Link
                  key={d.id}
                  href={`/dentistas/${d.id}`}
                  className="group bg-white overflow-hidden border border-slate-100
                             hover:shadow-xl hover:shadow-sky-100/50 hover:border-sky-200/60
                             transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={d.foto}
                      alt={`Foto de ${d.nombre}`}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {d.premium && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1
                                       bg-[#0F172A]/80 backdrop-blur-sm text-[#38bdf8]
                                       text-[10px] font-bold uppercase tracking-wider px-2.5 py-1
                                       border border-sky-400/30">
                        <Shield className="w-3 h-3" aria-hidden="true" />
                        Verificado
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-slate-800 text-sm truncate">{d.nombre}</p>
                    <p className="text-xs text-[#0EA5E9] font-medium mt-0.5">{d.especialidad}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="text-xs text-slate-500 truncate">{d.ciudad}, {d.pais}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2.5">
                      <StarRating rating={d.rating} />
                      <span className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{d.rating}</span>
                        <span className="text-slate-400"> ({d.reseñas})</span>
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Disponible esta semana
                      </span>
                      <span className="text-xs text-[#0EA5E9] font-semibold group-hover:underline">
                        Ver perfil →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/dentistas">
                <Button variant="outline" className="border-[#0EA5E9] text-[#0EA5E9] hover:bg-sky-50">
                  Ver todos los dentistas →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Cómo funciona ────────────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0D9488] bg-teal-50 border border-teal-100 px-4 py-1.5">
                Proceso simple
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0F172A] mb-4">
              Encuentra tu dentista en 3 pasos
            </h2>
            <p className="text-center text-slate-500 mb-14 max-w-lg mx-auto">
              Sin llamadas, sin esperas. Todo desde tu dispositivo en menos de 2 minutos.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: 1, color: "bg-sky-500", iconBg: "bg-sky-50",
                  icon: <Search className="w-6 h-6 text-[#0EA5E9]" aria-hidden="true" />,
                  title: "Busca y filtra",
                  desc: "Encuentra dentistas por especialidad, ciudad, idioma o valoración en segundos.",
                },
                {
                  step: 2, color: "bg-teal-500", iconBg: "bg-teal-50",
                  icon: <Star className="w-6 h-6 text-[#0D9488]" aria-hidden="true" />,
                  title: "Compara y decide",
                  desc: "Lee opiniones verificadas de pacientes reales y consulta precios orientativos.",
                },
                {
                  step: 3, color: "bg-sky-500", iconBg: "bg-sky-50",
                  icon: <Calendar className="w-6 h-6 text-[#0EA5E9]" aria-hidden="true" />,
                  title: "Reserva online",
                  desc: "Solicita tu cita directamente desde el perfil del dentista, disponible las 24 horas.",
                },
              ].map((s) => (
                <div key={s.title}
                  className="bg-slate-50 p-8 border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${s.iconBg}`}>
                      {s.icon}
                    </div>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${s.color} text-white text-xs font-bold`}>
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Verificación ────────────────────────────────────────────────── */}
        <section className="py-16 px-4 bg-gradient-to-r from-sky-50 to-teal-50 border-y border-slate-100">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0D9488] mb-3 block">
                Nuestro compromiso
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4 leading-tight">
                Todos los dentistas están verificados
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Antes de publicar un perfil, comprobamos la titulación, el número de colegiado
                y la situación de ejercicio activo. Tu salud merece garantías reales.
              </p>
              <ul className="space-y-3">
                {[
                  "Titulación universitaria comprobada",
                  "Número de colegiado verificado",
                  "Ejercicio activo en el país de registro",
                  "Reseñas vinculadas a citas reales",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-[#0D9488] shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "100%", label: "Dentistas verificados", color: "text-[#0EA5E9]" },
                { value: "48h", label: "Tiempo de verificación", color: "text-[#0D9488]" },
                { value: "0", label: "Perfiles falsos tolerados", color: "text-[#0EA5E9]" },
                { value: "24/7", label: "Soporte al paciente", color: "text-[#0D9488]" },
              ].map((item) => (
                <div key={item.label} className="bg-white p-5 text-center shadow-sm border border-slate-100">
                  <p className={`text-3xl font-bold tabular-nums ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonios ─────────────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0EA5E9] bg-sky-50 border border-sky-100 px-4 py-1.5">
                Pacientes reales
              </span>
            </div>
            <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-2">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-center text-slate-500 text-sm mb-12">
              Más de 18.000 reseñas verificadas de pacientes en todo el mundo
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIOS.map((t) => (
                <div key={t.nombre}
                  className="bg-white border border-slate-200 shadow-sm hover:shadow-md
                             transition-all duration-300 flex flex-col justify-between p-6">
                  <div>
                    <span className="text-5xl font-serif text-[#0EA5E9]/20 leading-none block mb-2" aria-hidden="true">
                      &ldquo;
                    </span>
                    <div className="flex gap-0.5 mb-3 -mt-2">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{t.texto}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100">
                    <Image
                      src={t.foto}
                      alt={`Foto de ${t.nombre}`}
                      width={40}
                      height={40}
                      className="rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{t.nombre}</p>
                      <p className="text-xs text-slate-400">{t.ciudad}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[#0D9488] font-medium shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      Verificado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA dentistas ────────────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-[#0F172A] text-white">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#0D9488] bg-teal-900/40 border border-teal-700/40 px-4 py-1.5 mb-5">
                Para profesionales
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Haz crecer tu consulta con Dentribe
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Perfil verificado, gestión de citas online y visibilidad ante miles de pacientes que buscan dentista cada día. Empieza gratis.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/registro?rol=dentist">
                  <Button className="bg-[#0D9488] hover:bg-[#0f766e] text-white font-semibold px-8 py-3 text-base
                                     transition-colors w-full rounded-none antialiased">
                    <UserPlus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Crear perfil gratuito
                  </Button>
                </Link>
                <Link href="/precios"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium
                             border border-white/60 text-white/90 hover:border-white hover:text-white
                             hover:bg-white/10 transition-all duration-150 w-full">
                  Ver planes y precios →
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Sin tarjeta de crédito · Activo en menos de 10 minutos
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: <TrendingUp className="w-5 h-5 text-[#0D9488]" aria-hidden="true" />, title: "Más visibilidad", desc: "Aparece en búsquedas de pacientes de tu zona y especialidad." },
                { icon: <Calendar className="w-5 h-5 text-[#0EA5E9]" aria-hidden="true" />, title: "Agenda online", desc: "Recibe y gestiona citas 24/7 sin llamadas ni interrupciones." },
                { icon: <Star className="w-5 h-5 text-[#0D9488]" aria-hidden="true" />, title: "Reputación digital", desc: "Acumula reseñas verificadas que generan confianza y nuevos pacientes." },
              ].map((b) => (
                <div key={b.title}
                  className="flex gap-4 bg-white/5 border border-white/10 p-4 hover:bg-white/[0.08] transition-colors">
                  <div className="shrink-0 w-10 h-10 bg-white/10 flex items-center justify-center">
                    {b.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{b.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0F172A] border-t border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-slate-400 leading-relaxed">El directorio mundial de dentistas verificados.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Pacientes</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/dentistas" className="hover:text-white transition-colors">Buscar dentista</Link></li>
                <li><Link href="/como-funciona" className="hover:text-white transition-colors">Cómo funciona</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Profesionales</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/para-dentistas" className="hover:text-white transition-colors">Para dentistas</Link></li>
                <li><Link href="/registro?rol=dentist" className="hover:text-white transition-colors">Crear perfil</Link></li>
                <li><Link href="/precios" className="hover:text-white transition-colors">Planes y precios</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
                <li><Link href="/terminos" className="hover:text-white transition-colors">Términos de uso</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Política de cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Dentribe · dentribe.com</p>
            <p className="text-xs text-slate-600">Hecho con cuidado para pacientes y profesionales</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
