"use client";

import FlipLink from "./FlipLink";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-16 px-6"
      style={{ background: "#F0EBE1" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 pb-10"
          style={{ borderBottom: "1px solid rgba(26,26,26,0.1)" }}
        >
          {/* Logo + tagline */}
          <div>
            <span
              className="text-2xl font-light"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}
            >
              M;
            </span>
            <p
              className="text-xs mt-1 max-w-[200px] leading-relaxed"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#9A948D",
              }}
            >
              Productos digitales con mentalidad de negocio.
              <br />
              Mar del Plata, Argentina.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-8">
            {[
              { label: "Capacidades", href: "#capacidades" },
              { label: "Casos",       href: "#casos"       },
              { label: "Proceso",     href: "#proceso"     },
              { label: "Contacto",    href: "#contacto"    },
            ].map((link) => (
              <FlipLink
                key={link.href}
                href={link.href}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#9A948D", textDecoration: "none" }}
              >
                {link.label}
              </FlipLink>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-6">
            <FlipLink
              href="https://linkedin.com/company/marplacode"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#9A948D", textDecoration: "none" }}
            >
              LinkedIn
            </FlipLink>
            <FlipLink
              href="https://instagram.com/marplacode"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#9A948D", textDecoration: "none" }}
            >
              Instagram
            </FlipLink>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span
            className="text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(26,26,26,0.3)" }}
          >
            © {year} Marplacode. Todos los derechos reservados.
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(26,26,26,0.3)" }}
          >
            Construido con Next.js · Diseñado con criterio
          </span>
        </div>
      </div>
    </footer>
  );
}
