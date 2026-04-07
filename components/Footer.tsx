"use client";

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
              style={{ fontFamily: "'Tilt Warp', sans-serif", color: "#1A1A1A" }}
            >
              M;
            </span>
            <p
              className="text-xs mt-1 max-w-[200px] leading-relaxed"
              style={{
                fontFamily: "'Tilt Warp', sans-serif",
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
              { label: "Casos", href: "#casos" },
              { label: "Proceso", href: "#proceso" },
              { label: "Contacto", href: "#contacto" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm transition-colors"
                style={{
                  fontFamily: "'Tilt Warp', sans-serif",
                  color: "#9A948D",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A1A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9A948D")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/company/marplacode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors"
              style={{
                fontFamily: "'Tilt Warp', sans-serif",
                color: "#9A948D",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A1A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9A948D")}
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com/marplacode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors"
              style={{
                fontFamily: "'Tilt Warp', sans-serif",
                color: "#9A948D",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A1A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9A948D")}
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span
            className="text-xs"
            style={{ fontFamily: "'Tilt Warp', sans-serif", color: "rgba(26,26,26,0.3)" }}
          >
            © {year} Marplacode. Todos los derechos reservados.
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: "'Tilt Warp', sans-serif", color: "rgba(26,26,26,0.3)" }}
          >
            Construido con Next.js · Diseñado con criterio
          </span>
        </div>
      </div>
    </footer>
  );
}
