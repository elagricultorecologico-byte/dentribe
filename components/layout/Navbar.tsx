"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-dentribe.bmp"
            alt="Dentribe"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/dentistas"
            className={`relative transition-colors
                       after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px]
                       after:bg-[#0EA5E9] after:transition-all hover:after:w-full
                       ${pathname?.startsWith("/dentistas") ? "text-[#0EA5E9] after:w-full" : "text-slate-600 hover:text-[#0EA5E9]"}`}
          >
            Encuentra dentista
          </Link>
          <Link
            href="/para-dentistas"
            className={`relative font-medium transition-colors
                       after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px]
                       after:bg-[#0D9488] after:transition-all hover:after:w-full
                       ${pathname === "/para-dentistas" ? "text-[#0f766e] after:w-full" : "text-[#0D9488] hover:text-[#0f766e]"}`}
          >
            Para dentistas
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Iniciar sesión</Button>
          </Link>
          <Link href="/registro">
            <Button size="sm" className="bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-none">
              Registrarse
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
