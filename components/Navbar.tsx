"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Capacidades", href: "#capacidades" },
    { label: "Casos", href: "#casos" },
    { label: "Proceso", href: "#proceso" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      {/* Floating bottom pill nav */}
      <nav
        className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 flex items-center gap-1 rounded-full px-2 py-2 shadow-2xl"
        style={{ background: "#1C1C1C", fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Logo */}
        <span
          className="text-[#EDE8DF] text-xl font-medium px-3 pr-4 select-none"
          style={{ fontFamily: "'Cormorant', Georgia, serif" }}
        >
          M;
        </span>

        <span className="w-px h-4 mx-1" style={{ background: "rgba(237,232,223,0.12)" }} />

        {/* Menu button */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 text-sm px-4 py-2 rounded-full transition-colors"
          style={{ color: "#EDE8DF" }}
        >
          <span className="flex flex-col gap-[5px]">
            <span className="block w-[18px] bg-[#EDE8DF]" style={{ height: "1.5px" }} />
            <span className="block w-[18px] bg-[#EDE8DF]" style={{ height: "1.5px" }} />
          </span>
          <span>Menú</span>
        </button>

        {/* CTA */}
        <a
          href="#contacto"
          className="ml-1 text-white text-sm px-5 py-2.5 rounded-full transition-colors"
          style={{ background: "#E8341E" }}
        >
          Iniciar proyecto
        </a>
      </nav>

      {/* Full-screen menu overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
          style={{ background: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-10 right-10 text-sm transition-colors"
            style={{ color: "rgba(237,232,223,0.5)" }}
          >
            Cerrar ✕
          </button>

          <div className="flex flex-col items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-light leading-none transition-colors"
                style={{
                  fontFamily: "'Cormorant', Georgia, serif",
                  fontSize: "clamp(3rem, 8vw, 5rem)",
                  color: "#EDE8DF",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8341E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#EDE8DF")}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            className="absolute bottom-16 flex gap-12 text-xs"
            style={{ color: "#9A948D" }}
          >
            <span>hello@marplacode.com</span>
            <span>Mar del Plata, Argentina</span>
          </div>
        </div>
      )}
    </>
  );
}
