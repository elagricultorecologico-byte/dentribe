"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Loader2, Navigation } from "lucide-react";

const ESPECIALIDADES = [
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
  "Radiología dental",
  "Odontología general",
];

export function HeroSearchBar() {
  const router = useRouter();

  const [especialidad, setEspecialidad] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [sugerenciaIndex, setSugerenciaIndex] = useState(-1);
  const [geoLoading, setGeoLoading] = useState(false);
  const [focused, setFocused] = useState<"especialidad" | "ciudad" | null>(null);

  const especialidadRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSugerencias(
      especialidad.trim().length < 1
        ? ESPECIALIDADES
        : ESPECIALIDADES.filter((e) =>
            e.toLowerCase().includes(especialidad.toLowerCase())
          )
    );
    setSugerenciaIndex(-1);
  }, [especialidad]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSugerencias(false);
        setFocused(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setShowSugerencias(false);
    const params = new URLSearchParams();
    if (especialidad) params.set("especialidad", especialidad);
    if (ciudad) params.set("ciudad", ciudad);
    router.push(`/dentistas?${params.toString()}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSugerencias) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSugerenciaIndex((i) => Math.min(i + 1, sugerencias.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSugerenciaIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && sugerenciaIndex >= 0) {
      e.preventDefault();
      setEspecialidad(sugerencias[sugerenciaIndex]);
      setShowSugerencias(false);
    } else if (e.key === "Escape") {
      setShowSugerencias(false);
    }
  }

  function handleGeolocate() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";
          setCiudad(city);
        } catch {
          // silencioso
        } finally {
          setGeoLoading(false);
        }
      },
      () => setGeoLoading(false)
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <form
        onSubmit={handleSearch}
        role="search"
        aria-label="Buscar dentistas"
        className="flex flex-col sm:flex-row gap-2"
      >
        {/* ── Contenedor inputs ── */}
        <div className={`flex-1 flex items-stretch bg-white shadow-xl shadow-black/20
                         transition-all duration-200
                         ${focused ? "ring-2 ring-white/60" : ""}`}>

          {/* Campo especialidad */}
          <div className={`flex-1 flex items-center gap-2.5 px-4 py-3 transition-colors
                           ${focused === "especialidad" ? "bg-sky-50/80" : ""}`}>
            <Search className={`w-4 h-4 shrink-0 transition-colors ${focused === "especialidad" ? "text-[#0EA5E9]" : "text-slate-400"}`} aria-hidden="true" />
            <div className="flex flex-col flex-1 min-w-0">
              <label htmlFor="search-especialidad" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Especialidad
              </label>
              <input
                ref={especialidadRef}
                id="search-especialidad"
                type="text"
                value={especialidad}
                autoComplete="off"
                onChange={(e) => setEspecialidad(e.target.value)}
                onFocus={() => { setFocused("especialidad"); setShowSugerencias(true); }}
                onKeyDown={handleKeyDown}
                placeholder="Ortodoncia, implantes..."
                className="text-sm text-slate-800 placeholder:text-slate-300 outline-none bg-transparent w-full"
              />
            </div>
            {especialidad && (
              <button type="button" onClick={() => { setEspecialidad(""); especialidadRef.current?.focus(); }}
                className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors" aria-label="Limpiar especialidad">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Separador */}
          <div className="w-px bg-slate-200 my-3 shrink-0" aria-hidden="true" />

          {/* Campo ciudad */}
          <div className={`flex-1 flex items-center gap-2.5 px-4 py-3 transition-colors
                           ${focused === "ciudad" ? "bg-teal-50/80" : ""}`}>
            <MapPin className={`w-4 h-4 shrink-0 transition-colors ${focused === "ciudad" ? "text-[#0D9488]" : "text-slate-400"}`} aria-hidden="true" />
            <div className="flex flex-col flex-1 min-w-0">
              <label htmlFor="search-ciudad" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Ubicación
              </label>
              <input
                id="search-ciudad"
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                onFocus={() => setFocused("ciudad")}
                onBlur={() => setFocused(null)}
                placeholder="Ciudad o país"
                className="text-sm text-slate-800 placeholder:text-slate-300 outline-none bg-transparent w-full"
              />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {ciudad && (
                <button type="button" onClick={() => setCiudad("")}
                  className="text-slate-300 hover:text-slate-500 transition-colors" aria-label="Limpiar ubicación">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button type="button" onClick={handleGeolocate} disabled={geoLoading}
                className="text-slate-300 hover:text-[#0D9488] transition-colors disabled:opacity-50 ml-1"
                aria-label="Usar mi ubicación" title="Usar mi ubicación">
                {geoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Botón independiente ── */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7]
                     text-white font-bold text-sm rounded-none
                     px-6 py-2.5 transition-colors duration-150 whitespace-nowrap cursor-pointer"
          style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", letterSpacing: "0.02em" }}
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Buscar dentista
        </button>
      </form>

      {/* Dropdown sugerencias */}
      {showSugerencias && focused === "especialidad" && sugerencias.length > 0 && (
        <ul role="listbox" aria-label="Sugerencias de especialidad"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100
                     shadow-xl z-[200] py-1 max-h-52 overflow-y-auto">
          {sugerencias.map((s, i) => (
            <li key={s} role="option" aria-selected={i === sugerenciaIndex}
              onMouseDown={() => { setEspecialidad(s); setShowSugerencias(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer transition-colors
                          ${i === sugerenciaIndex ? "bg-sky-50 text-[#0EA5E9]" : "text-slate-700 hover:bg-slate-50"}`}>
              <Search className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
