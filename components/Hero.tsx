"use client";

import { useEffect, useRef } from "react";
import AnimatedHeadline from "./AnimatedHeadline";
import CursorTrail from "./CursorTrail";
import DitherBg from "./DitherBg";

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const availRef   = useRef<HTMLDivElement>(null);

  // ── Fade all hero content as user scrolls away ───────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const t = Math.min(1, Math.max(0, (window.scrollY / window.innerHeight - 0.1) / 0.6));
      const opacity = String(1 - t);
      if (contentRef.current) contentRef.current.style.opacity = opacity;
      if (availRef.current)   availRef.current.style.opacity   = opacity;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center"
      style={{ background: "#0D0D0D" }}
    >
      <DitherBg />
      <CursorTrail />

      <div
        ref={contentRef}
        className="relative max-w-5xl mx-auto px-6 py-12 text-center z-10"
      >
        <AnimatedHeadline
          className="font-light leading-[0.92] tracking-[-0.01em] block"
          style={{
            fontFamily: "'Abril Fatface', Georgia, serif",
            fontSize: "clamp(4rem, 10vw, 9rem)",
            color: "#EDE8DF",
          }}
        >
          {`Convertimos ideas\nen productos\nque escalan.`}
        </AnimatedHeadline>

        {/* Subheadline */}
        <p
          className="mt-10 mx-auto"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "#9A948D",
            letterSpacing: "0.04em",
            maxWidth: "340px",
            lineHeight: "1.7",
          }}
        >
          Para founders y startups que quieren construir
          con criterio, no solo con velocidad.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#contacto"
            className="text-white text-sm px-7 py-3.5 rounded-full transition-colors"
            style={{
              background: "#E8341E",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#C82D19")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#E8341E")}
          >
            Iniciar proyecto
          </a>
          <a
            href="#casos"
            className="flex items-center gap-2.5 text-sm transition-colors"
            style={{
              color: "rgba(237,232,223,0.6)",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#EDE8DF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(237,232,223,0.6)")}
          >
            Ver casos
            <span
              className="w-8 h-8 rounded-full border flex items-center justify-center text-xs"
              style={{ borderColor: "rgba(237,232,223,0.2)" }}
            >
              ↗
            </span>
          </a>
        </div>
      </div>

      {/* Availability dot */}
      <div
        ref={availRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "#22C55E" }}
        />
        <span className="text-xs" style={{ color: "#9A948D" }}>
          Tomando proyectos ahora
        </span>
      </div>
    </section>
  );
}
