"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaginaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const resultado = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (resultado?.error) {
        setError("Email o contraseña incorrectos. Verifica tus datos.");
      } else {
        router.push("/cuenta");
        router.refresh();
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <p className="text-center text-sm text-slate-500 mb-8">
          Accede a tu cuenta de dentista o paciente
        </p>

        {/* Card de login */}
        <div className="bg-white border border-slate-200 p-8">
          <h1 className="text-xl font-bold text-[#0F172A] mb-6">
            Iniciar sesión
          </h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className="border border-slate-200 px-3 py-2 text-sm w-full outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] bg-white"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="border border-slate-200 px-3 py-2 text-sm w-full outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] bg-white"
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 px-3 py-2">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 transition-colors text-sm"
            >
              {cargando ? "Accediendo..." : "Entrar"}
            </button>
          </form>

          {/* Separador */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              ¿No tienes cuenta?{" "}
              <Link
                href="/registro"
                className="text-[#0EA5E9] font-semibold hover:text-[#0284c7] transition-colors"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Pie */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Al acceder aceptas nuestros{" "}
          <Link href="/terminos" className="underline hover:text-slate-600">
            Términos de uso
          </Link>{" "}
          y{" "}
          <Link href="/privacidad" className="underline hover:text-slate-600">
            Política de privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
