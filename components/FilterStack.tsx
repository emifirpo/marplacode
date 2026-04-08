"use client";

import { useEffect, useRef } from "react";
import FlipLink from "./FlipLink";

const YES_CARDS = [
  { number: "01", text: "Founders con tracción que necesitan escalar el producto" },
  { number: "02", text: "Equipos que toman decisiones basadas en datos, no en opiniones" },
  { number: "03", text: "Negocios que entienden el diseño como inversión, no como gasto" },
  { number: "04", text: "Startups que necesitan velocidad sin perder criterio" },
  { number: "05", text: "Empresas con modelo validado listas para construir su siguiente nivel" },
  { number: "06", text: "Equipos que buscan un partner que cuestione, no un ejecutor de tickets" },
  { number: "07", text: "Productos con usuarios reales que quieren crecer con criterio" },
  { number: "08", text: "Founders que priorizan impacto sobre volumen de entregables" },
  { number: "09", text: "Equipos técnicos que necesitan diseño estratégico para escalar" },
];

function stackEase(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function FilterStack() {
  const wrapRef         = useRef<HTMLDivElement>(null);
  const stackContentRef = useRef<HTMLDivElement>(null);
  const stackCardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap    = wrapRef.current;
    const content = stackContentRef.current;
    if (!wrap || !content) return;

    content.style.transform =
      "rotate3d(1,0,0,-25deg) rotate3d(0,1,0,50deg) rotate3d(0,0,1,25deg)";
    content.style.opacity = "0";

    // Recalculate every tick — avoids stale values from layout shifts (fonts, etc.)
    let rafId: number;

    const tick = () => {
      const vw      = window.innerWidth;
      const vh      = window.innerHeight;
      const scrollY = window.scrollY;
      const wrapTop = wrap.getBoundingClientRect().top + scrollY;

      const scrollEnd = wrapTop + wrap.offsetHeight - vh;
      const progress  = Math.max(0, Math.min(1, (scrollY - wrapTop) / (scrollEnd - wrapTop)));

      content.style.opacity = progress > 0 && progress < 1 ? "1" : "0";

      const cards    = stackCardRefs.current;
      const total    = cards.length;
      const stagger  = 0.02;
      const totalDur = 1 + stagger * (total - 1);

      cards.forEach((card, pos) => {
        if (!card) return;
        const localP = Math.max(0, Math.min(1, progress * totalDur - pos * stagger));
        const eased  = stackEase(localP);

        const zStart = -2.65 * vw - pos * 0.03 * vw;
        const zEnd   =  1.4  * vw + (total - pos - 1) * 0.03 * vw;
        const z      = zStart + (zEnd - zStart) * eased;

        const rotZ = -220 + 340 * eased;
        const rotY = -30  * eased;

        card.style.transform = `translateZ(${z}px) rotateZ(${rotZ}deg) rotateY(${rotY}deg)`;
      });
    };

    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", tick,    { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", tick);
    };
  }, []);

  return (
    <div style={{ background: "#F0EBE1" }}>

      {/* ── Scroll container: 350vh de recorrido para el stack ───────────── */}
      <div ref={wrapRef} style={{ position: "relative", height: "350vh" }}>
        <div style={{
          position:       "sticky",
          top:            0,
          height:         "100vh",
          perspective:    "1000px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}>

          {/* Label arriba */}
          <div style={{
            position:      "absolute",
            top:           "clamp(2rem, 5vh, 4rem)",
            left:          0,
            right:         0,
            textAlign:     "center",
            pointerEvents: "none",
            zIndex:        10,
          }}>
            <span style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color:         "rgba(26,26,26,0.4)",
            }}>
              Sí trabajamos con
            </span>
          </div>

          {/* Stack: todas las cards apiladas en grid-area:'card' */}
          <div
            ref={stackContentRef}
            style={{
              transformStyle:      "preserve-3d",
              display:             "grid",
              gridTemplateAreas:   "'card'",
              gridTemplateColumns: "100%",
              placeItems:          "center",
              width:               "100vw",
              height:              "100vh",
            }}
          >
            {YES_CARDS.map((card, i) => (
              <div
                key={i}
                ref={(el) => { stackCardRefs.current[i] = el; }}
                style={{
                  gridArea:       "card",
                  width:          "min(30vw, 260px)",
                  minWidth:       160,
                  aspectRatio:    "2 / 3",
                  borderRadius:   12,
                  background:     "#0D0D0D",
                  border:         "1px solid rgba(232,52,30,0.2)",
                  willChange:     "transform",
                  boxShadow:      "0 4px 40px 0 rgba(0,0,0,0.35)",
                  display:        "flex",
                  flexDirection:  "column",
                  justifyContent: "space-between",
                  padding:        "clamp(1.2rem, 3vw, 1.8rem)",
                }}
              >
                <span style={{
                  fontFamily:    "'DM Sans', sans-serif",
                  fontSize:      "0.6rem",
                  letterSpacing: "0.12em",
                  color:         "rgba(237,232,223,0.2)",
                }}>
                  {card.number}
                </span>

                <div>
                  <span style={{
                    display:      "block",
                    fontFamily:   "'DM Sans', sans-serif",
                    fontSize:     "clamp(0.85rem, 1.15vw, 1rem)",
                    fontWeight:   500,
                    color:        "#EDE8DF",
                    lineHeight:   1.55,
                    marginBottom: "0.9rem",
                  }}>
                    {card.text}
                  </span>
                  <span style={{
                    display:      "block",
                    width:        "1.5rem",
                    height:       "2px",
                    background:   "#E8341E",
                    borderRadius: 2,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom note — aparece al terminar el scroll del stack ─────────── */}
      <div style={{
        padding:   "clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize:   "0.82rem",
          color:      "#9A948D",
          margin:     0,
        }}>
          Si dudás si encajás,{" "}
          <FlipLink href="#contacto" style={{ color: "#1A1A1A", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            escribinos igual
          </FlipLink>
          . Lo evaluamos juntos.
        </p>
      </div>

    </div>
  );
}
