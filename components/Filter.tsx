"use client";

import { useEffect, useRef } from "react";
import FlipLink from "./FlipLink";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINE1 = "No somos para todos.";
const LINE2 = "Intencionalmente.";

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

export default function Filter() {
  const sectionRef      = useRef<HTMLElement>(null);
  const headingRefs     = useRef<(HTMLElement | null)[]>([]);
  const stackContentRef = useRef<HTMLDivElement>(null);
  const stackCardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  // ── Heading entry animation ───────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRefs.current.filter(Boolean), {
        yPercent: 110,
        opacity:  0,
        duration: 0.9,
        ease:     "power3.out",
        stagger:  0.12,
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Card stack — sincronizado con el scroll del ContentWrapper ────────────
  // Sube por el DOM hasta [data-cw-outer] (el outer div de ContentWrapper)
  // y usa su scroll progress (mismo que anima el border trail).
  useEffect(() => {
    const section = sectionRef.current;
    const content = stackContentRef.current;
    if (!section || !content) return;

    content.style.transform =
      "rotate3d(1,0,0,-25deg) rotate3d(0,1,0,50deg) rotate3d(0,0,1,25deg)";
    content.style.opacity = "0";

    let rafId: number;

    const tick = () => {
      const outerEl = section.closest<HTMLElement>("[data-cw-outer]");
      if (!outerEl) return;

      const vw         = window.innerWidth;
      const vh         = window.innerHeight;
      const scrollY    = window.scrollY;
      const outerTop    = outerEl.getBoundingClientRect().top + scrollY;
      const outerH      = outerEl.offsetHeight;
      const sceneStart  = outerTop - vh;
      const progress    = Math.max(0, Math.min(1, (scrollY - sceneStart) / outerH));

      content.style.opacity = progress > 0 && progress < 1 ? "1" : "0";

      const cards    = stackCardRefs.current;
      const total    = cards.length;
      const stagger  = 0.015;
      const totalDur = 1 + stagger * (total - 1);

      // Adelantamos la animación en 0.3 para que al llegar al sticky (~0.36)
      // las cards ya estén en la posición de abanico (~50% del recorrido)
      const advance  = 0.3;
      const cardP    = Math.max(0, Math.min(1, (progress + advance) / (1 + advance)));

      cards.forEach((card, pos) => {
        if (!card) return;

        const localP = Math.max(0, Math.min(1, cardP * totalDur - pos * stagger));
        const eased  = stackEase(localP);

        const zStart = -2.65 * vw - pos * 0.03 * vw;
        const zEnd   =  1.4  * vw + (total - pos - 1) * 0.03 * vw;
        const z      = zStart + (zEnd - zStart) * eased;
        const rotZ   = -220 + 340 * eased;
        const rotY   = -30  * eased;

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
    <section
      ref={sectionRef}
      id="capacidades"
      style={{
        background:    "#F0EBE1",
        position:      "relative",
        minHeight:     "100vh",
        display:       "flex",
        flexDirection: "column",
        justifyContent:"space-between",
        padding:       "clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 5rem) clamp(2.5rem, 5vh, 4rem)",
      }}
    >
      {/* Gradiente de entrada */}
      <div style={{
        position:      "absolute",
        top:           0, left: 0, right: 0,
        height:        "160px",
        background:    "linear-gradient(to bottom, transparent 0%, #F0EBE1 100%)",
        pointerEvents: "none",
        zIndex:        0,
      }} />

      {/* ── Heading ────────────────────────────────────────────────────────── */}
      <div style={{
        textAlign:    "center",
        position:     "relative",
        zIndex:       10,
        mixBlendMode: "difference",
      }}>
        <span style={{
          fontFamily:    "'DM Sans', sans-serif",
          fontSize:      "0.72rem",
          letterSpacing: "0.1em",
          color:         "#9A948D",
        }}>
          (Quiénes somos)
        </span>
        <h2 style={{
          fontFamily:   "'DM Sans', sans-serif",
          fontSize:     "clamp(2.8rem, 6vw, 5rem)",
          color:        "#ffffff",
          lineHeight:   1.1,
          marginTop:    "1rem",
          marginBottom: 0,
        }}>
          <span style={{ display: "block", overflow: "hidden" }}>
            <span ref={(el) => { headingRefs.current[0] = el; }} style={{ display: "block" }}>
              {LINE1}
            </span>
          </span>
          <em style={{ display: "block", overflow: "hidden" }}>
            <span ref={(el) => { headingRefs.current[1] = el; }} style={{ display: "block" }}>
              {LINE2}
            </span>
          </em>
        </h2>
      </div>

      {/* ── Card stack — absolute, cubre todo el section ─────────────────── */}
      {/* zIndex: 3 → behind heading (zIndex 10) pero visible sobre el fondo */}
      <div style={{
        position:       "absolute",
        inset:          0,
        zIndex:         3,
        perspective:    "1000px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        pointerEvents:  "none",
      }}>
        {/* Label centrado arriba */}
        <div style={{
          position:      "absolute",
          top:           "clamp(2rem, 5vh, 4rem)",
          left:          0,
          right:         0,
          textAlign:     "center",
        }}>
          <span style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.65rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         "rgba(26,26,26,0.35)",
          }}>
            Sí trabajamos con
          </span>
        </div>

        {/* Grid que apila todas las cards en el mismo lugar */}
        <div
          ref={stackContentRef}
          style={{
            transformStyle:      "preserve-3d",
            display:             "grid",
            gridTemplateAreas:   "'card'",
            gridTemplateColumns: "100%",
            placeItems:          "center",
            width:               "100%",
            height:              "100%",
          }}
        >
          {YES_CARDS.map((card, i) => (
            <div
              key={i}
              ref={(el) => { stackCardRefs.current[i] = el; }}
              style={{
                gridArea:       "card",
                width:          "min(28vw, 240px)",
                minWidth:       150,
                aspectRatio:    "2 / 3",
                borderRadius:   12,
                background:     "#0D0D0D",
                border:         "1px solid rgba(232,52,30,0.2)",
                willChange:     "transform",
                boxShadow:      "0 4px 40px 0 rgba(0,0,0,0.3)",
                display:        "flex",
                flexDirection:  "column",
                justifyContent: "space-between",
                padding:        "clamp(1.1rem, 2.5vw, 1.6rem)",
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
                  fontSize:     "clamp(0.8rem, 1.1vw, 0.95rem)",
                  fontWeight:   500,
                  color:        "#EDE8DF",
                  lineHeight:   1.55,
                  marginBottom: "0.85rem",
                }}>
                  {card.text}
                </span>
                <span style={{
                  display:      "block",
                  width:        "1.4rem",
                  height:       "2px",
                  background:   "#E8341E",
                  borderRadius: 2,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom note ────────────────────────────────────────────────────── */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize:   "0.82rem",
        color:      "#9A948D",
        margin:     0,
        textAlign:  "center",
        position:   "relative",
        zIndex:     10,
      }}>
        Si dudás si encajás,{" "}
        <FlipLink href="#contacto" style={{ color: "#1A1A1A", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          escribinos igual
        </FlipLink>
        . Lo evaluamos juntos.
      </p>
    </section>
  );
}
