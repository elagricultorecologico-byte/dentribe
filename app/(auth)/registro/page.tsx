"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

// ─── Constantes del dominio ───────────────────────────────────────────────────

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
  "Odontología general",
] as const;

// ─── Tipos locales ────────────────────────────────────────────────────────────

type Tab = "PATIENT" | "DENTIST";

interface CamposPaciente {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface CamposDentista {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  clinicName: string;
  licenseNo: string;
  bio: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  specialties: string[];
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PaginaRegistro() {
  const router = useRouter();
  const [tabActivo, setTabActivo] = useState<Tab>("PATIENT");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const [paciente, setPaciente] = useState<CamposPaciente>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [dentista, setDentista] = useState<CamposDentista>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    clinicName: "",
    licenseNo: "",
    bio: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    country: "",
    specialties: [],
  });

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function toggleEspecialidad(nombre: string) {
    setDentista((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(nombre)
        ? prev.specialties.filter((e) => e !== nombre)
        : [...prev.specialties, nombre],
    }));
  }

  async function handleSubmitPaciente(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (paciente.password !== paciente.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (paciente.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "PATIENT",
          name: paciente.name,
          email: paciente.email,
          password: paciente.password,
        }),
      });

      const datos: { error?: string } = await respuesta.json();
      if (!respuesta.ok) {
        setError(datos.error ?? "Error al crear la cuenta.");
        return;
      }

      await signIn("credentials", {
        email: paciente.email,
        password: paciente.password,
        redirect: false,
      });

      router.push("/cuenta");
      router.refresh();
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  async function handleSubmitDentista(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (dentista.password !== dentista.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (dentista.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "DENTIST",
          name: dentista.name,
          email: dentista.email,
          password: dentista.password,
          clinicName: dentista.clinicName,
          licenseNo: dentista.licenseNo || undefined,
          bio: dentista.bio || undefined,
          phone: dentista.phone || undefined,
          website: dentista.website || undefined,
          address: dentista.address || undefined,
          city: dentista.city || undefined,
          country: dentista.country || undefined,
          specialties: dentista.specialties,
        }),
      });

      const datos: { error?: string } = await respuesta.json();
      if (!respuesta.ok) {
        setError(datos.error ?? "Error al crear la cuenta.");
        return;
      }

      await signIn("credentials", {
        email: dentista.email,
        password: dentista.password,
        redirect: false,
      });

      router.push("/cuenta");
      router.refresh();
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  // ─── Clases reutilizables ───────────────────────────────────────────────────

  const claseInput =
    "border border-slate-200 px-3 py-2 text-sm w-full outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] bg-white";
  const claseLabel =
    "text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block";

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <p className="text-center text-sm text-slate-500 mb-8">
          Crea tu cuenta gratis en el directorio mundial de dentistas
        </p>

        {/* Card principal */}
        <div className="bg-white border border-slate-200">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => { setTabActivo("PATIENT"); setError(null); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                tabActivo === "PATIENT"
                  ? "text-[#0EA5E9] border-b-2 border-[#0EA5E9] bg-white"
                  : "text-slate-500 hover:text-slate-700 bg-slate-50"
              }`}
            >
              Soy Paciente
            </button>
            <button
              type="button"
              onClick={() => { setTabActivo("DENTIST"); setError(null); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                tabActivo === "DENTIST"
                  ? "text-[#0EA5E9] border-b-2 border-[#0EA5E9] bg-white"
                  : "text-slate-500 hover:text-slate-700 bg-slate-50"
              }`}
            >
              Soy Dentista
            </button>
          </div>

          <div className="p-8">
            {/* ── TAB PACIENTE ─────────────────────────────────────────────── */}
            {tabActivo === "PATIENT" && (
              <form onSubmit={handleSubmitPaciente} noValidate className="space-y-5">
                <div>
                  <label htmlFor="pac-name" className={claseLabel}>Nombre completo</label>
                  <input
                    id="pac-name"
                    type="text"
                    value={paciente.name}
                    onChange={(e) => setPaciente((p) => ({ ...p, name: e.target.value }))}
                    placeholder="María García López"
                    required
                    className={claseInput}
                  />
                </div>

                <div>
                  <label htmlFor="pac-email" className={claseLabel}>Email</label>
                  <input
                    id="pac-email"
                    type="email"
                    value={paciente.email}
                    onChange={(e) => setPaciente((p) => ({ ...p, email: e.target.value }))}
                    placeholder="tu@email.com"
                    required
                    className={claseInput}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pac-pass" className={claseLabel}>Contraseña</label>
                    <input
                      id="pac-pass"
                      type="password"
                      value={paciente.password}
                      onChange={(e) => setPaciente((p) => ({ ...p, password: e.target.value }))}
                      placeholder="Mín. 8 caracteres"
                      required
                      className={claseInput}
                    />
                  </div>
                  <div>
                    <label htmlFor="pac-confirm" className={claseLabel}>Confirmar contraseña</label>
                    <input
                      id="pac-confirm"
                      type="password"
                      value={paciente.confirmPassword}
                      onChange={(e) => setPaciente((p) => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="Repite la contraseña"
                      required
                      className={claseInput}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 px-3 py-2">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 transition-colors text-sm"
                >
                  {cargando ? "Creando cuenta..." : "Crear cuenta de paciente"}
                </button>
              </form>
            )}

            {/* ── TAB DENTISTA ─────────────────────────────────────────────── */}
            {tabActivo === "DENTIST" && (
              <form onSubmit={handleSubmitDentista} noValidate className="space-y-6">
                {/* Aviso verificación */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 px-4 py-3">
                  <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="inline-block bg-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mb-1">
                      Verificación pendiente
                    </span>
                    <p className="text-xs text-amber-700">
                      Tu perfil será revisado por nuestro equipo antes de publicarse en el directorio. Recibirás un email en 24–48h.
                    </p>
                  </div>
                </div>

                {/* Datos de acceso */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Datos de acceso</p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="den-name" className={claseLabel}>Nombre completo</label>
                      <input
                        id="den-name"
                        type="text"
                        value={dentista.name}
                        onChange={(e) => setDentista((d) => ({ ...d, name: e.target.value }))}
                        placeholder="Dr. Juan Martínez Sánchez"
                        required
                        className={claseInput}
                      />
                    </div>

                    <div>
                      <label htmlFor="den-email" className={claseLabel}>Email profesional</label>
                      <input
                        id="den-email"
                        type="email"
                        value={dentista.email}
                        onChange={(e) => setDentista((d) => ({ ...d, email: e.target.value }))}
                        placeholder="dentista@clinica.com"
                        required
                        className={claseInput}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="den-pass" className={claseLabel}>Contraseña</label>
                        <input
                          id="den-pass"
                          type="password"
                          value={dentista.password}
                          onChange={(e) => setDentista((d) => ({ ...d, password: e.target.value }))}
                          placeholder="Mín. 8 caracteres"
                          required
                          className={claseInput}
                        />
                      </div>
                      <div>
                        <label htmlFor="den-confirm" className={claseLabel}>Confirmar contraseña</label>
                        <input
                          id="den-confirm"
                          type="password"
                          value={dentista.confirmPassword}
                          onChange={(e) => setDentista((d) => ({ ...d, confirmPassword: e.target.value }))}
                          placeholder="Repite la contraseña"
                          required
                          className={claseInput}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Datos profesionales */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Datos profesionales</p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="den-clinic" className={claseLabel}>
                        Nombre de la clínica / consulta <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="den-clinic"
                        type="text"
                        value={dentista.clinicName}
                        onChange={(e) => setDentista((d) => ({ ...d, clinicName: e.target.value }))}
                        placeholder="Clínica Dental Martínez"
                        required
                        className={claseInput}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="den-license" className={claseLabel}>Número de colegiado</label>
                        <input
                          id="den-license"
                          type="text"
                          value={dentista.licenseNo}
                          onChange={(e) => setDentista((d) => ({ ...d, licenseNo: e.target.value }))}
                          placeholder="28/12345"
                          className={claseInput}
                        />
                      </div>
                      <div>
                        <label htmlFor="den-phone" className={claseLabel}>Teléfono</label>
                        <input
                          id="den-phone"
                          type="tel"
                          value={dentista.phone}
                          onChange={(e) => setDentista((d) => ({ ...d, phone: e.target.value }))}
                          placeholder="+34 600 000 000"
                          className={claseInput}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="den-website" className={claseLabel}>Sitio web</label>
                      <input
                        id="den-website"
                        type="url"
                        value={dentista.website}
                        onChange={(e) => setDentista((d) => ({ ...d, website: e.target.value }))}
                        placeholder="https://miclinica.com"
                        className={claseInput}
                      />
                    </div>

                    <div>
                      <label htmlFor="den-address" className={claseLabel}>Dirección</label>
                      <input
                        id="den-address"
                        type="text"
                        value={dentista.address}
                        onChange={(e) => setDentista((d) => ({ ...d, address: e.target.value }))}
                        placeholder="Calle Mayor 10, 2ºA"
                        className={claseInput}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="den-city" className={claseLabel}>Ciudad</label>
                        <input
                          id="den-city"
                          type="text"
                          value={dentista.city}
                          onChange={(e) => setDentista((d) => ({ ...d, city: e.target.value }))}
                          placeholder="Madrid"
                          className={claseInput}
                        />
                      </div>
                      <div>
                        <label htmlFor="den-country" className={claseLabel}>País</label>
                        <input
                          id="den-country"
                          type="text"
                          value={dentista.country}
                          onChange={(e) => setDentista((d) => ({ ...d, country: e.target.value }))}
                          placeholder="España"
                          className={claseInput}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="den-bio" className={claseLabel}>Biografía breve</label>
                      <textarea
                        id="den-bio"
                        value={dentista.bio}
                        onChange={(e) => setDentista((d) => ({ ...d, bio: e.target.value }))}
                        placeholder="Describe tu trayectoria, enfoque clínico y valores profesionales..."
                        rows={3}
                        className="border border-slate-200 px-3 py-2 text-sm w-full outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Especialidades */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Especialidades</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ESPECIALIDADES.map((esp) => (
                      <label key={esp} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={dentista.specialties.includes(esp)}
                          onChange={() => toggleEspecialidad(esp)}
                          className="w-4 h-4 accent-[#0EA5E9] shrink-0"
                        />
                        <span className="text-xs text-slate-700 group-hover:text-slate-900 transition-colors">
                          {esp}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 px-3 py-2">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 transition-colors text-sm"
                >
                  {cargando ? "Creando perfil..." : "Registrarme como dentista"}
                </button>
              </form>
            )}

            {/* Enlace a login */}
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-[#0EA5E9] font-semibold hover:text-[#0284c7] transition-colors">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
