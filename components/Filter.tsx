"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINE1 = "No somos para todos.";
const LINE2 = "Intencionalmente.";

const notFor = [
  "Proyectos sin validar que buscan el diseño antes que el negocio",
  "Clientes que miden el éxito por cantidad de páginas o pantallas",
  "Equipos que buscan el precio más bajo del mercado",
  "Ideas que necesitan 'verse bonitas' pero no tienen usuario definido",
];

const yesFor = [
  "Founders que tienen tracción y quieren escalar el producto",
  "Equipos que toman decisiones basadas en datos, no en opiniones",
  "Negocios que entienden que el diseño es una inversión, no un gasto",
  "Startups que necesitan velocidad sin perder criterio",
];

export default function Filter() {
  const sectionRef  = useRef<HTMLElement>(null);
  const line1Refs   = useRef<(HTMLElement | null)[]>([]);
  const line2Refs   = useRef<(HTMLElement | null)[]>([]);
  const offsets1    = useRef<{ x: number; y: number }[]>([]);
  const offsets2    = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    offsets1.current = Array.from({ length: LINE1.length }, () => ({
      x: gsap.utils.random(-60, 60),
      y: gsap.utils.random(-60, 60),
    }));
    offsets2.current = Array.from({ length: LINE2.length }, () => ({
      x: gsap.utils.random(-60, 60),
      y: gsap.utils.random(-60, 60),
    }));
  }, []);

  useEffect(() => {
    const chars1 = line1Refs.current.filter(Boolean) as HTMLElement[];
    const chars2 = line2Refs.current.filter(Boolean) as HTMLElement[];

    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      chars1,
      {
        opacity:  0,
        xPercent: (i) => offsets1.current[i]?.x ?? 0,
        yPercent: (i) => offsets1.current[i]?.y ?? 0,
      },
      {
        opacity:  1,
        xPercent: 0,
        yPercent: 0,
        duration: 0.6,
        ease:     "power4",
        stagger:  { each: 0.025, from: "random" },
      },
      0
    );

    tl.fromTo(
      chars2,
      {
        opacity:  0,
        xPercent: (i) => offsets2.current[i]?.x ?? 0,
        yPercent: (i) => offsets2.current[i]?.y ?? 0,
      },
      {
        opacity:  1,
        xPercent: 0,
        yPercent: 0,
        duration: 0.6,
        ease:     "power4",
        stagger:  { each: 0.025, from: "random" },
      },
      0.1
    );

    ScrollTrigger.create({
      trigger:  sectionRef.current,
      start:    "top 80%",
      end:      "top 30%",
      scrub:    true,
      onUpdate: (self) => tl.progress(self.progress),
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capacidades"
      style={{ background: "#F0EBE1", padding: "clamp(4rem, 10vh, 8rem) clamp(1.5rem, 5vw, 4rem)" }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>

        {/* Label */}
        <span style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "#9A948D" }}>
          (Quiénes somos)
        </span>

        {/* Headline — char-level Demo10 */}
        <h2
          style={{
            fontFamily:    "'Tilt Warp', sans-serif",
            fontSize:      "clamp(2.8rem, 6vw, 5rem)",
            color:         "#1A1A1A",
            lineHeight:    1.1,
            marginTop:     "1rem",
            marginBottom:  "clamp(3rem, 6vh, 5rem)",
          }}
        >
          {/* Line 1 */}
          <span style={{ display: "block" }}>
            {LINE1.split("").map((ch, i) => (
              <span
                key={i}
                ref={(el) => { line1Refs.current[i] = el; }}
                style={{ display: "inline-block", willChange: "transform, opacity", whiteSpace: "pre" }}
              >
                {ch}
              </span>
            ))}
          </span>
          {/* Line 2 — italic */}
          <em style={{ display: "block" }}>
            {LINE2.split("").map((ch, i) => (
              <span
                key={i}
                ref={(el) => { line2Refs.current[i] = el; }}
                style={{ display: "inline-block", willChange: "transform, opacity", whiteSpace: "pre" }}
              >
                {ch}
              </span>
            ))}
          </em>
        </h2>

        {/* Two-column grid */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap:                 "1px",
            background:          "rgba(26,26,26,0.1)",
            textAlign:           "left",
          }}
        >
          {/* NO column */}
          <div style={{ padding: "clamp(2rem, 4vw, 3.5rem)", background: "#F0EBE1" }}>
            <p style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9A948D", marginBottom: "2rem" }}>
              No trabajamos con
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {notFor.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", fontFamily: "'Tilt Warp', sans-serif" }}>
                  <span style={{ color: "rgba(26,26,26,0.25)", fontSize: "0.85rem", flexShrink: 0, marginTop: "0.1em" }}>✕</span>
                  <span style={{ color: "#6B6560", fontSize: "0.95rem", lineHeight: 1.55 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* YES column */}
          <div style={{ padding: "clamp(2rem, 4vw, 3.5rem)", background: "#F0EBE1" }}>
            <p style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#E8341E", marginBottom: "2rem" }}>
              Sí trabajamos con
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {yesFor.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", fontFamily: "'Tilt Warp', sans-serif" }}>
                  <span style={{ color: "#E8341E", fontSize: "0.85rem", flexShrink: 0, marginTop: "0.1em" }}>→</span>
                  <span style={{ color: "#1A1A1A", fontSize: "0.95rem", lineHeight: 1.55 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom note */}
        <p style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "0.82rem", color: "#9A948D", marginTop: "2rem" }}>
          Si dudás si encajás,{" "}
          <a href="#contacto" style={{ color: "#1A1A1A", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            escribinos igual
          </a>
          . Lo evaluamos juntos.
        </p>

      </div>
    </section>
  );
}
