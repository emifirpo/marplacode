"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Frames totales del JSON (op: 663)
const LOTTIE_FRAMES = 663;

// ── DigitReel: columna vertical de dígitos estilo odómetro ───────────────────
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
      <span style={{ visibility: "hidden", display: "block", height: "1em", lineHeight: 1 }}>0</span>
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

const HEADLINE  = "Diseño como el motor de crecimiento";
const SUBTITLE  = "Convertimos ideas en productos que escalan — con criterio, velocidad y foco en el negocio.";

const TAGLINE    = "Convertimos ideas en productos que escalan.";
const DESCRIPTOR = "Partner estratégico para founders y equipos que construyen con criterio.";

// ── easing helpers ───────────────────────────────────────────────────────────
const easeOutExpo  = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeInExpo   = (t: number) => t === 0 ? 0 : Math.pow(2, 10 * t - 10);

export default function Hero() {
  const sectionRef   = useRef<HTMLElement>(null);
  const taglineRef   = useRef<HTMLSpanElement>(null);
  const descRef      = useRef<HTMLSpanElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const lottieRef       = useRef<any>(null);
  const lottieWrapRef   = useRef<HTMLDivElement>(null);

  // Word refs — Demo 1 (Codrops TextBlockTransitions)
  const h1WordsRef  = useRef<HTMLElement[]>([]);
  const subWordsRef = useRef<HTMLElement[]>([]);
  const entryTlRef  = useRef<any>(null); // para poder killarlo si el user scrollea rápido

  const [count,         setCount]         = useState(0);
  const [loaderFading,  setLoaderFading]  = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/logo-animated.json").then(r => r.json()).then(setAnimationData);
  }, []);

  // ── Estado inicial oculto (tagline y descriptor) ──────────────────────────
  useEffect(() => {
    if (taglineRef.current) taglineRef.current.style.transform = "translateY(115%)";
    if (descRef.current)    descRef.current.style.transform = "translateY(115%)";
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

  // ── Entry animations — Demo 1 (Codrops) ──────────────────────────────────
  useEffect(() => {
    if (loaderVisible) return;

    const tagline  = taglineRef.current;
    const desc     = descRef.current;
    const h1Words  = h1WordsRef.current.filter(Boolean);
    const subWords = subWordsRef.current.filter(Boolean);
    if (!tagline || !desc) return;

    // TODO: Convert GSAP timeline to CSS animations
    // For now, apply end states directly
    if (lottieWrapRef.current) {
      lottieWrapRef.current.style.opacity = "1";
      lottieWrapRef.current.style.transform = "translateY(0)";
    }

    h1Words.forEach(word => {
      if (word) {
        word.style.opacity = "1";
        word.style.transform = "translateY(0) rotate(0)";
      }
    });

    subWords.forEach(word => {
      if (word) {
        word.style.opacity = "1";
        word.style.transform = "translateY(0) rotate(0)";
      }
    });

    tagline.style.transform = "translateY(0)";
    desc.style.transform = "translateY(0)";
  }, [loaderVisible]);

  // ── Scroll → Lottie + text exit (Demo 7) + fade-out ─────────────────────
  // Reparto del scroll vertical:
  //   0              → LOTTIE_END    : Lottie frame-by-frame
  //   LOTTIE_END     → TEXT_END      : H1 + subtitle salen hacia arriba (Demo 7 salida)
  //   TEXT_END       → TEXT_END+FADE : hero se desvanece
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const vh           = window.innerHeight;
    const LOTTIE_END   = vh * 0.2;   // Lottie completo a los 20vh de scroll
    const TEXT_RANGE   = vh * 0.35;  // texto sale en 35vh (empieza a los 20vh)
    const TEXT_END     = LOTTIE_END + TEXT_RANGE;  // 0.55vh
    const FADE_RANGE   = vh * 0.25;  // fade del hero en 25vh (0.55 → 0.8vh)

    const onScroll = () => {
      const sy = window.scrollY;

      // ── 1. Lottie scroll-driven ───────────────────────────────────────
      const lottie = lottieRef.current;
      if (lottie) {
        const p = Math.max(0, Math.min(1, sy / LOTTIE_END));
        lottie.goToAndStop(p * LOTTIE_FRAMES, true);
      }

      // ── 2. Texto: salida Demo 1 reversa (scroll-driven) ──────────────
      const textP = Math.max(0, Math.min(1, (sy - LOTTIE_END) / TEXT_RANGE));
      if (textP > 0) {
        const applyExit = (words: HTMLElement[], groupOffset: number) => {
          const total = words.length;
          words.forEach((word, i) => {
            if (!word) return;
            const center   = (total - 1) / 2;
            const dist     = Math.abs(i - center) / center;
            const delay    = groupOffset + dist * 0.15;
            const localP   = Math.max(0, Math.min(1, (textP - delay) / (1 - delay)));
            const eased    = easeInExpo(localP);

            const rot = i < total / 2 ? -3 : 3;
            word.style.opacity = String(1 - eased);
            word.style.transform = `translateY(${-30 * eased}%) rotate(${rot * eased}deg)`;
          });
        };

        applyExit(h1WordsRef.current.filter(Boolean),  0);
        applyExit(subWordsRef.current.filter(Boolean), 0.05);
      }

      // ── 3. Fade del hero, comienza cuando el texto terminó ────────────
      const fadeP = Math.max(0, Math.min(1, (sy - TEXT_END) / FADE_RANGE));
      section.style.opacity = String(1 - fadeP);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Scroll → video playback (adelante/atrás) — solo desktop ─────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // En mobile (touch) dejamos autoplay+loop, sin seeking por scroll
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    video.preload = "auto";

    // Tiempo virtual que controlamos manualmente
    let virtualTime   = 0;
    let scrollVel     = 0;   // px/s — capturado en el evento scroll
    let lastScrollY   = window.scrollY;
    let lastScrollT   = performance.now();
    let lastRafT      = performance.now();
    let seeking       = false;
    let rafId: number;

    // ── Capturar velocidad de scroll en el evento (no en RAF) ────────────
    const onScroll = () => {
      const now = performance.now();
      const dt  = Math.max((now - lastScrollT) / 1000, 0.001);
      scrollVel = (window.scrollY - lastScrollY) / dt;
      lastScrollY = window.scrollY;
      lastScrollT = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Cuando termina un seek, permitir el siguiente ────────────────────
    const onSeeked = () => { seeking = false; };
    video.addEventListener("seeked", onSeeked);

    const tick = (now: number) => {
      const dt = Math.max((now - lastRafT) / 1000, 0.001);
      lastRafT = now;

      // Decay velocity (frame-rate independiente)
      scrollVel *= Math.pow(0.88, dt * 60);

      // Multiplicador de velocidad según scroll
      let mult: number;
      if      (scrollVel < -60)  mult = Math.max(-4, scrollVel / 200);  // reversa
      else if (scrollVel >  60)  mult = Math.min( 5, 1 + scrollVel / 250); // acelerado
      else                       mult = 1;                                   // normal

      // Avanzar tiempo virtual
      if (video.duration) {
        virtualTime += dt * mult;
        // Loop limpio
        if (virtualTime > video.duration) virtualTime -= video.duration;
        if (virtualTime < 0)              virtualTime += video.duration;

        // Seekar solo si no hay un seek en curso (evita saturar el decoder)
        if (!seeking && Math.abs(video.currentTime - virtualTime) > 0.04) {
          seeking = true;
          video.currentTime = virtualTime;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    // Esperar a que el video esté listo y arrancar
    const onReady = () => {
      virtualTime = 0;
      rafId = requestAnimationFrame(tick);
    };

    if (video.readyState >= 1) {
      onReady();
    } else {
      video.addEventListener("loadedmetadata", onReady, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      video.removeEventListener("seeked", onSeeked);
    };
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
            <DigitReel index={Math.floor(count / 100)} size={2}   visible={count >= 100} />
            <DigitReel index={Math.floor(count / 10)}  size={11}  visible={count >= 10}  />
            <DigitReel index={count}                   size={101} visible={true}         />
          </div>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        style={{
          background:    "#0D0D0D",
          minHeight:     "100svh",
          display:       "flex",
          flexDirection: "column",
          justifyContent:"space-between",
          position:      "relative",
          overflow:      "hidden",
        }}
      >
        {/* ── Video background ──────────────────────────────────────────── */}
        <video
          ref={videoRef}
          src="/hero-web.mp4"
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
          style={{
            position:   "absolute",
            inset:      0,
            width:      "100%",
            height:     "100%",
            objectFit:  "cover",
            zIndex:     0,
          }}
        />
        {/* Overlay oscuro para contraste con el texto */}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: "rgba(0,0,0,0.48)",
          zIndex:     1,
        }} />

        {/* ── Título izquierda arriba ────────────────────────────────────── */}
        <div style={{
          position:   "relative",
          zIndex:     10,
          padding:    "clamp(2rem, 5vw, 4rem)",
          paddingTop: "clamp(3rem, 7vh, 5rem)",
        }}>
          {/* Lottie logo */}
          <div
            ref={lottieWrapRef}
            style={{ width: "clamp(140px, 16vw, 220px)", marginBottom: "clamp(1.5rem, 3vh, 2.5rem)", opacity: 0 }}
          >
            {animationData && (
              <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                autoplay={false}
                loop={false}
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </div>

          {/* H1 — Demo 1 (Codrops): word spans con opacity 0 inicial, GSAP los anima */}
          <h1
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontWeight:    500,
              color:         "#FFFFFF",
              fontSize:      "clamp(2.8rem, 6.5vw, 7rem)",
              lineHeight:    1.02,
              letterSpacing: "-0.03em",
              whiteSpace:    "normal",
              textAlign:     "left",
              userSelect:    "none",
              margin:        0,
              maxWidth:      "14ch",
            }}
          >
            {HEADLINE.split(" ").map((word, i, arr) => (
              <span
                key={i}
                ref={el => { if (el) h1WordsRef.current[i] = el as HTMLElement; }}
                style={{
                  display:    "inline-block",
                  marginRight: i < arr.length - 1 ? "0.28em" : 0,
                  opacity:    0,
                  willChange: "transform, opacity",
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtítulo — Demo 1 */}
          <p style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontWeight:    400,
            color:         "rgba(255,255,255,0.65)",
            fontSize:      "clamp(0.9rem, 1.4vw, 1.15rem)",
            lineHeight:    1.55,
            letterSpacing: "-0.01em",
            margin:        "clamp(1rem, 2.5vh, 1.8rem) 0 0",
            maxWidth:      "42ch",
          }}>
            {SUBTITLE.split(" ").map((word, i, arr) => (
              <span
                key={i}
                ref={el => { if (el) subWordsRef.current[i] = el as HTMLElement; }}
                style={{
                  display:    "inline-block",
                  marginRight: i < arr.length - 1 ? "0.25em" : 0,
                  opacity:    0,
                  willChange: "transform, opacity",
                }}
              >
                {word}
              </span>
            ))}
          </p>
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
          <div style={{ overflow: "hidden", maxWidth: "clamp(240px, 38vw, 520px)" }}>
            <span
              ref={taglineRef}
              style={{
                display:       "block",
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "clamp(0.95rem, 1.8vw, 1.4rem)",
                color:         "#EDE8DF",
                fontWeight:    600,
                letterSpacing: "-0.015em",
                lineHeight:    1.2,
              }}
            >
              {TAGLINE}
            </span>
          </div>

          <div style={{ overflow: "hidden", maxWidth: "clamp(160px, 18vw, 240px)" }}>
            <span
              ref={descRef}
              style={{
                display:       "block",
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "clamp(0.6rem, 0.85vw, 0.8rem)",
                color:         "rgba(237,232,223,0.4)",
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
