"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import AnimatedHeadline from "./AnimatedHeadline";

const RingsScene   = dynamic(() => import("./RingsScene"),   { ssr: false });
const CoreScene    = dynamic(() => import("./CoreScene"),    { ssr: false });
const CoinsScene   = dynamic(() => import("./CoinsScene"),   { ssr: false });
const StaggerScene = dynamic(() => import("./StaggerScene"), { ssr: false });

const SCENES = [RingsScene, CoreScene, CoinsScene, StaggerScene];

const steps = [
  {
    number: "01",
    title: "Entender el negocio",
    description:
      "Antes de hablar de diseño o tecnología, entendemos qué problema real tiene el negocio. Hacemos las preguntas incómodas. ¿Qué métrica mueve la aguja? ¿Quién es el usuario? ¿Qué está fallando hoy?",
    duration: "1–2 semanas",
  },
  {
    number: "02",
    title: "Definir el producto",
    description:
      "Con el contexto claro, definimos qué construir primero. No el producto perfecto: el producto correcto para este momento. Priorizamos por impacto, esfuerzo y aprendizaje.",
    duration: "1 semana",
  },
  {
    number: "03",
    title: "Diseñar con intención",
    description:
      "Cada pantalla tiene un objetivo. Diseñamos flujos antes que mockups. Validamos con usuarios reales antes de pasar a producción. El pixel perfect viene después del 'funciona'.",
    duration: "2–4 semanas",
  },
  {
    number: "04",
    title: "Construir e iterar",
    description:
      "Desarrollo en ciclos cortos con entregables reales. Nada de 'estamos trabajando'. Cada sprint tiene un resultado visible, testeado y en staging. Iteramos sobre datos, no sobre opiniones.",
    duration: "4–12 semanas",
  },
];

const SCROLL_PER_CARD = 550;
const BORDER_DEFAULT  = "rgba(237,232,223,0.07)";
const BORDER_GLOW     = "rgba(255,255,255,0.22)";
const E               = "cubic-bezier(0.16,1,0.3,1)";

export default function Process() {
  const stickyZoneRef = useRef<HTMLDivElement>(null);
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const spotlightRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // word-level refs for text transitions: [cardIndex][wordIndex]
  const titleWordRefs = useRef<(HTMLSpanElement | null)[][]>(
    steps.map(() => [])
  );
  const descRefs      = useRef<(HTMLParagraphElement | null)[]>([]);
  const numberRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const badgeRefs     = useRef<(HTMLSpanElement | null)[]>([]);

  // ── Content animation helpers ─────────────────────────────────────────────
  const showContent = (i: number) => {
    // number
    const num = numberRefs.current[i];
    if (num) { num.style.opacity = "1"; num.style.transform = "translateY(0)"; }
    // badge
    const badge = badgeRefs.current[i];
    if (badge) { badge.style.opacity = "1"; badge.style.transform = "translateY(0)"; }
    // title words
    titleWordRefs.current[i]?.forEach((w, wi) => {
      if (!w) return;
      w.style.transitionDelay = `${wi * 0.07}s`;
      w.style.opacity = "1";
      w.style.transform = "translateY(0)";
    });
    // description
    const desc = descRefs.current[i];
    const wordCount = titleWordRefs.current[i]?.length ?? 0;
    if (desc) {
      desc.style.transitionDelay = `${wordCount * 0.07 + 0.1}s`;
      desc.style.opacity = "1";
      desc.style.transform = "translateY(0)";
    }
  };

  const hideContent = (i: number) => {
    const num = numberRefs.current[i];
    if (num) { num.style.opacity = "0"; num.style.transform = "translateY(0.4em)"; }
    const badge = badgeRefs.current[i];
    if (badge) { badge.style.opacity = "0"; badge.style.transform = "translateY(0.4em)"; }
    titleWordRefs.current[i]?.forEach((w) => {
      if (!w) return;
      w.style.transitionDelay = "0s";
      w.style.opacity = "0";
      w.style.transform = "translateY(0.5em)";
    });
    const desc = descRefs.current[i];
    if (desc) {
      desc.style.transitionDelay = "0s";
      desc.style.opacity = "0";
      desc.style.transform = "translateY(0.4em)";
    }
  };

  // ── Scroll stacking + content trigger ────────────────────────────────────
  useEffect(() => {
    const zone = stickyZoneRef.current;
    if (!zone) return;

    const triggered = new Array(steps.length).fill(false);

    const onScroll = () => {
      const rect    = zone.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const totalP  = scrolled / SCROLL_PER_CARD;

      steps.forEach((_, i) => {
        const card    = cardRefs.current[i];
        const overlay = overlayRefs.current[i];
        if (!card) return;

        const enterP    = Math.max(0, Math.min(1, totalP - i + 1));
        const stackedBy = Math.max(0, totalP - i);
        const cStack    = Math.min(stackedBy, steps.length - i - 1);

        let transform: string;
        let shadowOpacity: number;

        if (enterP < 1) {
          transform     = `translateY(${(1 - enterP) * 100}%)`;
          shadowOpacity = 0;
        } else {
          const ty = -cStack * 22;
          const sc = Math.max(0.86, 1 - cStack * 0.04);
          transform     = `translateY(${ty}px) scale(${sc})`;
          const nextEnterP = Math.max(0, Math.min(1, totalP - i));
          shadowOpacity = nextEnterP * 0.72;
        }

        card.style.transform = transform;
        card.style.zIndex    = String(i + 1);
        if (overlay) {
          overlay.style.background = `rgba(0,0,0,${Math.min(0.82, shadowOpacity)})`;
        }

        // text entrance: trigger when fully in, reset when fully out
        if (enterP >= 0.92 && !triggered[i]) {
          triggered[i] = true;
          showContent(i);
        } else if (enterP < 0.15 && triggered[i]) {
          triggered[i] = false;
          hideContent(i);
        }
      });
    };

    // init hidden state
    steps.forEach((_, i) => hideContent(i));

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Spotlight border hover ────────────────────────────────────────────────
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    innerRefs.current.forEach((inner, i) => {
      const outer     = cardRefs.current[i];
      const spotlight = spotlightRefs.current[i];
      if (!inner || !outer) return;

      const onMove = (e: MouseEvent) => {
        const rect = inner.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        outer.style.background = `radial-gradient(500px circle at ${x}px ${y}px, ${BORDER_GLOW}, ${BORDER_DEFAULT} 60%)`;
        if (spotlight) {
          spotlight.style.background = `radial-gradient(500px circle at ${x}px ${y}px, rgba(255,255,255,0.045), transparent 50%)`;
          spotlight.style.opacity = "1";
        }
      };

      const onLeave = () => {
        outer.style.background = BORDER_DEFAULT;
        if (spotlight) spotlight.style.opacity = "0";
      };

      inner.addEventListener("mousemove", onMove);
      inner.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        inner.removeEventListener("mousemove", onMove);
        inner.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="proceso" style={{ background: "#0D0D0D" }}>

      {/* ── Header ── */}
      <div style={{ padding: isMobile ? "4rem 1.5rem 3rem" : "8rem 1.5rem 5rem", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <AnimatedHeadline
          className="mb-3 font-light leading-tight"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "#EDE8DF" }}
        >
          Sin humo.
        </AnimatedHeadline>
        <AnimatedHeadline
          className="font-light leading-tight"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "rgba(237,232,223,0.32)", fontStyle: "italic" }}
        >
          Cuatro etapas, entregables reales.
        </AnimatedHeadline>
      </div>

      {/* ── Sticky stacking zone ── */}
      <div
        ref={stickyZoneRef}
        style={{ position: "relative", height: `calc(100vh + ${SCROLL_PER_CARD * (steps.length - 1)}px)` }}
      >
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          {steps.map((step, i) => {
            const Scene = SCENES[i];
            return (
              // ── Outer: 1px border layer ──────────────────────────────────
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{
                  position:        "absolute",
                  inset:           isMobile ? "8px" : "20px",
                  borderRadius:    "18px",
                  padding:         "1px",
                  background:      BORDER_DEFAULT,
                  willChange:      "transform",
                  transformOrigin: "top center",
                  transform:       i === 0 ? "translateY(0)" : "translateY(100%)",
                  zIndex:          i + 1,
                }}
              >
                {/* ── Inner card ────────────────────────────────────────── */}
                <div
                  ref={(el) => { innerRefs.current[i] = el; }}
                  style={{
                    width: "100%", height: "100%",
                    background: "#1a1a1a", borderRadius: "17px",
                    padding: isMobile ? "1.2rem 1.2rem 1rem" : "clamp(2rem, 4vw, 3.5rem)",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden", position: "relative",
                  }}
                >
                  {/* Darkening overlay */}
                  <div
                    ref={(el) => { overlayRefs.current[i] = el; }}
                    style={{
                      position: "absolute", inset: 0, background: "rgba(0,0,0,0)",
                      borderRadius: "17px", pointerEvents: "none", zIndex: 10,
                    }}
                  />
                  {/* Spotlight overlay */}
                  <div
                    ref={(el) => { spotlightRefs.current[i] = el; }}
                    style={{
                      position: "absolute", inset: 0, borderRadius: "17px",
                      pointerEvents: "none", opacity: 0,
                      transition: "opacity 0.4s ease", zIndex: 9,
                    }}
                  />

                  {/* ── Layout ─────────────────────────────────────────── */}
                  <div style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "0.75rem" : "5rem",
                    height: "100%",
                    minHeight: 0,
                  }}>

                    {/* Columna izquierda — en mobile va debajo */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, order: isMobile ? 1 : 0 }}>

                      {/* Número */}
                      <div style={{ marginBottom: "1rem", flexShrink: 0, overflow: "hidden" }}>
                        <span
                          ref={(el) => { numberRefs.current[i] = el; }}
                          style={{
                            display: "block",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: isMobile ? "clamp(2rem, 8vw, 3rem)" : "clamp(3.5rem, 7vw, 6rem)",
                            fontWeight: 200,
                            color: "rgba(237,232,223,0.12)",
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                            opacity: 0,
                            transform: "translateY(0.4em)",
                            transition: `opacity 0.7s ${E}, transform 0.7s ${E}`,
                          }}
                        >
                          {step.number}
                        </span>
                      </div>

                      {/* Badge */}
                      <span
                        ref={(el) => { badgeRefs.current[i] = el; }}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.7rem",
                          padding: "4px 14px",
                          borderRadius: "999px",
                          background: "rgba(237,232,223,0.04)",
                          color: "rgba(237,232,223,0.2)",
                          border: "1px solid rgba(237,232,223,0.07)",
                          display: "inline-block",
                          alignSelf: "flex-start",
                          marginBottom: "0.75rem",
                          flexShrink: 0,
                          opacity: 0,
                          transform: "translateY(0.4em)",
                          transition: `opacity 0.6s ${E} 0.05s, transform 0.6s ${E} 0.05s`,
                        }}
                      >
                        {step.duration}
                      </span>

                      {/* Título — word by word */}
                      <h3 style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: isMobile ? "clamp(1.5rem, 5.5vw, 2rem)" : "clamp(2.2rem, 4vw, 3.8rem)",
                        fontWeight: 300,
                        color: "#EDE8DF",
                        lineHeight: 1.05,
                        letterSpacing: "-0.02em",
                        flexShrink: 0,
                        marginBottom: "0.75rem",
                        overflow: "visible",
                      }}>
                        {step.title.split(" ").map((word, wi) => (
                          <span
                            key={wi}
                            ref={(el) => { titleWordRefs.current[i][wi] = el; }}
                            style={{
                              display: "inline-block",
                              marginRight: "0.22em",
                              opacity: 0,
                              transform: "translateY(0.5em)",
                              transition: `opacity 0.65s ${E}, transform 0.65s ${E}`,
                              willChange: "transform, opacity",
                            }}
                          >
                            {word}
                          </span>
                        ))}
                      </h3>

                      {/* Descripción */}
                      <p
                        ref={(el) => { descRefs.current[i] = el; }}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: isMobile ? "0.78rem" : "0.88rem",
                          lineHeight: 1.55,
                          color: "rgba(237,232,223,0.38)",
                          fontWeight: 300,
                          flexShrink: 0,
                          maxWidth: isMobile ? "none" : "420px",
                          opacity: 0,
                          transform: "translateY(0.4em)",
                          transition: `opacity 0.7s ease, transform 0.7s ${E}`,
                        }}
                      >
                        {step.description}
                      </p>

                      <div style={{ flex: 1 }} />
                    </div>

                    {/* Columna derecha: 3D — en mobile va arriba con altura fija */}
                    <div style={{
                      width:        isMobile ? "100%" : "38%",
                      height:       isMobile ? "clamp(160px, 42vw, 220px)" : "auto",
                      flexShrink:   0,
                      borderRadius: "12px",
                      overflow:     "hidden",
                      position:     "relative",
                      order:        isMobile ? 0 : 1,
                    }}>
                      <Scene />
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: "6rem", background: "#0D0D0D" }} />
    </section>
  );
}
