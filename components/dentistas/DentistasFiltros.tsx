"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface PropsFiltros {
  especialidades: string[];
  valorInicial: {
    especialidad: string;
    ciudad: string;
    pais: string;
    rating: string;
  };
}

export default function DentistasFiltros({
  especialidades,
  valorInicial,
}: PropsFiltros) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [especialidad, setEspecialidad] = useState(valorInicial.especialidad);
  const [ciudad, setCiudad] = useState(valorInicial.ciudad);
  const [pais, setPais] = useState(valorInicial.pais);
  const [ratingMinimo, setRatingMinimo] = useState(
    parseInt(valorInicial.rating, 10) || 0
  );

  function aplicarFiltros() {
    const params = new URLSearchParams();
    if (especialidad) params.set("especialidad", especialidad);
    if (ciudad) params.set("ciudad", ciudad);
    if (pais) params.set("pais", pais);
    if (ratingMinimo > 0) params.set("rating", String(ratingMinimo));

    startTransition(() => {
      router.push(`/dentistas?${params.toString()}`);
    });
  }

  function limpiarFiltros() {
    setEspecialidad("");
    setCiudad("");
    setPais("");
    setRatingMinimo(0);
    startTransition(() => {
      router.push("/dentistas");
    });
  }

  const claseInput =
    "border border-slate-200 px-3 py-2 text-sm w-full outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] bg-white";
  const claseLabel =
    "text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block";

  return (
    <div className="bg-white border border-slate-200 p-5 space-y-5">
      <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">
        Filtrar resultados
      </h2>

      {/* Especialidad */}
      <div>
        <label htmlFor="filtro-especialidad" className={claseLabel}>
          Especialidad
        </label>
        <select
          id="filtro-especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          className={claseInput}
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      {/* País */}
      <div>
        <label htmlFor="filtro-pais" className={claseLabel}>
          País
        </label>
        <input
          id="filtro-pais"
          type="text"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          placeholder="España, México..."
          className={claseInput}
        />
      </div>

      {/* Ciudad */}
      <div>
        <label htmlFor="filtro-ciudad" className={claseLabel}>
          Ciudad
        </label>
        <input
          id="filtro-ciudad"
          type="text"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Madrid, Barcelona..."
          className={claseInput}
        />
      </div>

      {/* Valoración mínima */}
      <div>
        <span className={claseLabel}>Valoración mínima</span>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((estrella) => (
            <button
              key={estrella}
              type="button"
              onClick={() =>
                setRatingMinimo(ratingMinimo === estrella ? 0 : estrella)
              }
              className={`text-xl leading-none transition-colors ${
                estrella <= ratingMinimo
                  ? "text-amber-400"
                  : "text-slate-200 hover:text-amber-300"
              }`}
              aria-label={`${estrella} estrella${estrella > 1 ? "s" : ""} mínimo`}
            >
              ★
            </button>
          ))}
        </div>
        {ratingMinimo > 0 && (
          <p className="text-xs text-slate-500 mt-1">
            {ratingMinimo}+ estrella{ratingMinimo > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Botones */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={aplicarFiltros}
          disabled={isPending}
          className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] disabled:bg-slate-300 text-white font-semibold px-4 py-2 text-sm transition-colors"
        >
          {isPending ? "Buscando..." : "Aplicar filtros"}
        </button>
        <button
          type="button"
          onClick={limpiarFiltros}
          disabled={isPending}
          className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm font-semibold transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
