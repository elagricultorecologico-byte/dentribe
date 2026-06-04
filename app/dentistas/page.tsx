import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import DentistasFiltros from "@/components/dentistas/DentistasFiltros";

// ─── Tipos inferidos del schema real ─────────────────────────────────────────

type DentistaEnLista = Prisma.DentistGetPayload<{
  include: {
    owner: { select: { name: true } };
    specialties: { include: { specialty: true } };
    reviews: { select: { rating: true } };
    subscription: { select: { plan: true; status: true } };
  };
}>;

interface PropsPagina {
  searchParams: {
    especialidad?: string;
    ciudad?: string;
    pais?: string;
    rating?: string;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcularRatingMedio(reviews: { rating: number }[]): number {
  if (!reviews.length) return 0;
  const suma = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((suma / reviews.length) * 10) / 10;
}

function Estrellas({ rating }: { rating: number }) {
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? "text-amber-400" : "text-slate-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

// ─── Card individual ──────────────────────────────────────────────────────────

function CardDentista({ dentista }: { dentista: DentistaEnLista }) {
  const ratingMedio = calcularRatingMedio(dentista.reviews);
  const esPremium =
    dentista.subscription?.plan === "PREMIUM" &&
    dentista.subscription?.status === "ACTIVE";
  const especialidades = dentista.specialties.map((ds) => ds.specialty.name);
  const especialidadesVisibles = especialidades.slice(0, 3);
  const extras = especialidades.length - 3;

  return (
    <div className="bg-white border border-slate-200 p-5 flex gap-4 hover:border-[#0EA5E9] transition-colors">
      {/* Avatar */}
      <div className="shrink-0">
        {dentista.avatar ? (
          <Image
            src={dentista.avatar}
            alt={dentista.clinicName}
            width={72}
            height={72}
            className="w-[72px] h-[72px] object-cover rounded-full"
          />
        ) : (
          <div className="w-[72px] h-[72px] bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-[#0F172A] text-base">
                {dentista.owner.name ?? dentista.clinicName}
              </h2>
              {dentista.verified && (
                <span className="inline-flex items-center gap-1 bg-[#0EA5E9]/10 text-[#0284c7] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verificado
                </span>
              )}
              {esPremium && (
                <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                  Premium
                </span>
              )}
              {dentista.featured && !esPremium && (
                <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                  Destacado
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-0.5">{dentista.clinicName}</p>

            {(dentista.city || dentista.country) && (
              <p className="text-xs text-slate-400 mt-0.5">
                {[dentista.city, dentista.country].filter(Boolean).join(", ")}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="shrink-0 text-right">
            <Estrellas rating={ratingMedio} />
            <p className="text-xs text-slate-400 mt-0.5">
              {ratingMedio > 0 ? (
                <>
                  <span className="font-semibold text-slate-600">{ratingMedio.toFixed(1)}</span>{" "}
                  ({dentista.reviews.length} {dentista.reviews.length === 1 ? "reseña" : "reseñas"})
                </>
              ) : (
                "Sin reseñas"
              )}
            </p>
          </div>
        </div>

        {/* Especialidades */}
        {especialidadesVisibles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {especialidadesVisibles.map((esp) => (
              <span key={esp} className="bg-slate-100 text-slate-600 text-[10px] font-medium uppercase tracking-wide px-2 py-0.5">
                {esp}
              </span>
            ))}
            {extras > 0 && (
              <span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5">+{extras} más</span>
            )}
          </div>
        )}

        <div className="mt-3">
          <Link
            href={`/dentistas/${dentista.id}`}
            className="inline-block bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-xs font-semibold px-4 py-1.5 transition-colors"
          >
            Ver perfil →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Página (Server Component) ────────────────────────────────────────────────

export default async function PaginaDentistas({ searchParams }: PropsPagina) {
  const { especialidad, ciudad, pais, rating } = searchParams;
  const ratingMinimo = rating ? parseInt(rating, 10) : 0;

  // SQLite no soporta mode: "insensitive", el filtrado de texto es case-sensitive
  const where: Prisma.DentistWhereInput = {
    verified: true,
    ...(ciudad && { city: { contains: ciudad } }),
    ...(pais && { country: { contains: pais } }),
    ...(especialidad && {
      specialties: {
        some: { specialty: { name: { contains: especialidad } } },
      },
    }),
  };

  const dentistas = await db.dentist.findMany({
    where,
    include: {
      owner: { select: { name: true } },
      specialties: { include: { specialty: true } },
      reviews: { select: { rating: true } },
      subscription: { select: { plan: true, status: true } },
    },
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
  });

  // Filtro de rating mínimo en memoria (SQLite no puede calcularlo en DB fácilmente)
  const dentistasVisibles = ratingMinimo > 0
    ? dentistas.filter((d) => calcularRatingMedio(d.reviews) >= ratingMinimo)
    : dentistas;

  const todasEspecialidades = await db.specialty.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#0F172A] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-xl font-bold tracking-tight mb-4 inline-block">
            denti<span className="text-[#0EA5E9]">tribe</span>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Directorio de dentistas</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {dentistasVisibles.length}{" "}
            {dentistasVisibles.length === 1
              ? "dentista verificado encontrado"
              : "dentistas verificados encontrados"}
            {(ciudad || pais || especialidad || ratingMinimo > 0) && (
              <span className="ml-1">con los filtros aplicados</span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar filtros */}
          <aside className="w-64 shrink-0">
            <DentistasFiltros
              especialidades={todasEspecialidades.map((e) => e.name)}
              valorInicial={{
                especialidad: especialidad ?? "",
                ciudad: ciudad ?? "",
                pais: pais ?? "",
                rating: rating ?? "0",
              }}
            />
          </aside>

          {/* Resultados */}
          <main className="flex-1 min-w-0">
            {dentistasVisibles.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 text-center">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="text-lg font-semibold text-slate-700 mb-1">No se encontraron dentistas</h2>
                <p className="text-sm text-slate-400">Prueba a cambiar los filtros de búsqueda para ver más resultados.</p>
                <Link
                  href="/dentistas"
                  className="inline-block mt-4 border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 transition-colors text-sm font-semibold"
                >
                  Ver todos los dentistas
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {dentistasVisibles.map((d) => (
                  <CardDentista key={d.id} dentista={d} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
