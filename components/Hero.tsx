"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CursorTrail from "./CursorTrail";
import DitherBg from "./DitherBg";
import WavyLines from "./WavyLines";

// ── DigitReel: columna vertical de dígitos estilo odómetro ───────────────────
// Usa un "0" invisible como sizer → el ancho siempre es el del dígito más ancho
function DigitReel({ index, size, visible }: {
  index:   number;
  size:    number;
  visible: boolean;
}) {
  return (
    <span style={{
      display:      "inline-block",
      position:     "relative",
      verticalAlign:"top",
      opacity:      visible ? 1 : 0,
      transition:   "opacity 0.35s ease",
    }}>
      {/* Sizer invisible: marca el ancho real del "0" en esta fuente/peso */}
      <span style={{ visibility: "hidden", display: "block", height: "1em", lineHeight: 1 }}>0</span>

      {/* Reel: posición absoluta sobre el sizer, overflow hidden + mask */}
      <span style={{
        position:        "absolute",
        inset:           0,
        overflow:        "hidden",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        maskImage:       "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
      }}>
        <span style={{
          display:    "block",
          transform:  `translateY(-${index}em)`,
          transition: "transform 0.15s cubic-bezier(0, 0, 0.15, 1)",
          willChange: "transform",
        }}>
          {Array.from({ length: size }, (_, i) => (
            <span key={i} style={{ display: "block", height: "1em", lineHeight: 1, textAlign: "right" }}>
              {i % 10}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

const HEADLINE   = "Diseño como el motor de crecimiento";

const TAGLINE    = "Convertimos ideas en productos que escalan.";
const DESCRIPTOR = "Partner estratégico para founders y equipos que construyen con criterio.";

export default function Hero() {
  const sectionRef      = useRef<HTMLElement>(null);
  const containerRef    = useRef<HTMLDivElement>(null);
  const titleRef        = useRef<HTMLHeadingElement>(null);
  const measureRef      = useRef<HTMLSpanElement>(null);
  const taglineRef      = useRef<HTMLSpanElement>(null);
  const descRef         = useRef<HTMLSpanElement>(null);

  const [count,         setCount]         = useState(0);
  const [loaderFading,  setLoaderFading]  = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);

  // ── Estado inicial oculto ─────────────────────────────────────────────────
  useEffect(() => {
    if (taglineRef.current) gsap.set(taglineRef.current, { yPercent: 115 });
    if (descRef.current)    gsap.set(descRef.current,    { yPercent: 115 });
  }, []);

  // ── Loader: RAF de 0 → 100 ────────────────────────────────────────────────
  useEffect(() => {
    const DURATION = 2200;
    const start    = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setCount(Math.round(e * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCount(100);
        setTimeout(() => {
          setLoaderFading(true);
          setTimeout(() => {
            setLoaderVisible(false);
            window.dispatchEvent(new CustomEvent("hero:loaderDone"));
          }, 600);
        }, 300);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Entry animations ──────────────────────────────────────────────────────
  useEffect(() => {
    if (loaderVisible) return;

    const title   = titleRef.current;
    const tagline = taglineRef.current;
    const desc    = descRef.current;
    if (!title || !tagline || !desc) return;

    const tl = gsap.timeline();

    tl.fromTo(title,
      { opacity: 0, y: -70 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
    );
    tl.fromTo(tagline,
      { yPercent: 115 },
      { yPercent: 0, duration: 0.75, ease: "power3.out" },
      "-=0.55"
    );
    tl.fromTo(desc,
      { yPercent: 115 },
      { yPercent: 0, duration: 0.75, ease: "power3.out" },
      "-=0.6"
    );
  }, [loaderVisible]);

  // Fit desactivado — el h1 usa font-size responsivo via CSS clamp

  // ── Fade out al scrollear ─────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const vh    = window.innerHeight;
      const start = vh * 0.3;
      const end   = vh * 0.7;
      const p     = Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)));
      section.style.opacity = String(1 - p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <>
      {/* ── Loader overlay ────────────────────────────────────────────────── */}
      {loaderVisible && (
        <div style={{
          position:       "fixed",
          inset:          0,
          background:     "#0D0D0D",
          zIndex:         9999,
          display:        "flex",
          alignItems:     "flex-end",
          justifyContent: "flex-start",
          paddingLeft:    0,
          paddingBottom:  "clamp(2rem, 5vh, 4rem)",
          opacity:        loaderFading ? 0 : 1,
          transition:     "opacity 0.6s ease",
          pointerEvents:  "none",
        }}>
          <div style={{
            fontFamily:         "'DM Sans', sans-serif",
            fontSize:           "clamp(6rem, 18vw, 14rem)",
            fontWeight:         900,
            color:              "#EDE8DF",
            lineHeight:         1,
            letterSpacing:      "-0.025em",
            fontVariantNumeric: "tabular-nums",
            fontFeatureSettings:'"tnum"',
            display:            "flex",
            opacity:            Math.min(count / 20, 1),
          }}>
            {/* Centenas */}
            <DigitReel index={Math.floor(count / 100)} size={2}  visible={count >= 100} />
            {/* Decenas */}
            <DigitReel index={Math.floor(count / 10)}  size={11} visible={count >= 10}  />
            {/* Unidades */}
            <DigitReel index={count}                   size={101} visible={true}        />
          </div>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        style={{
          background:    "#C8784A",
          minHeight:     "100svh",
          display:       "flex",
          flexDirection: "column",
          justifyContent:"space-between",
          position:      "relative",
          overflow:      "hidden",
        }}
      >
        <DitherBg />
        <WavyLines color="rgba(80,30,5,0.12)" />
        <CursorTrail />

        {/* ── Título centrado ────────────────────────────────────────────── */}
        <div
          ref={containerRef}
          style={{
            flex:           1,
            width:          "100%",
            position:       "relative",
            zIndex:         10,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "0 clamp(2rem, 8vw, 8rem)",
          }}
        >
          <h1
            ref={titleRef}
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontWeight:    500,
              color:         "#1A0C04",
              fontSize:      "clamp(3rem, 7.5vw, 8rem)",
              lineHeight:    0.92,
              letterSpacing: "-0.03em",
              whiteSpace:    "normal",
              textAlign:     "center",
              userSelect:    "none",
              margin:        0,
              padding:       0,
              maxWidth:      "18ch",
              opacity:       0,
            }}
          >
            <span ref={measureRef} style={{ display: "inline" }}>
              {HEADLINE}
            </span>
          </h1>
        </div>

        {/* ── Bottom row ────────────────────────────────────────────────── */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "flex-end",
            padding:        "clamp(1.5rem, 3vw, 2.5rem)",
            paddingBottom:  "clamp(2rem, 5vh, 4rem)",
            position:       "relative",
            zIndex:         10,
          }}
        >
          {/* Tagline — demo5 */}
          <div style={{ overflow: "hidden", maxWidth: "clamp(240px, 38vw, 520px)" }}>
            <span
              ref={taglineRef}
              style={{
                display:       "block",
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "clamp(0.95rem, 1.8vw, 1.4rem)",
                color:         "#111111",
                fontWeight:    600,
                letterSpacing: "-0.015em",
                lineHeight:    1.2,
              }}
            >
              {TAGLINE}
            </span>
          </div>

          {/* Descriptor — demo5 */}
          <div style={{ overflow: "hidden", maxWidth: "clamp(160px, 18vw, 240px)" }}>
            <span
              ref={descRef}
              style={{
                display:       "block",
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "clamp(0.6rem, 0.85vw, 0.8rem)",
                color:         "rgba(17,17,17,0.4)",
                fontWeight:    400,
                textAlign:     "right",
                lineHeight:    1.55,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {DESCRIPTOR}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
