"use client";

import { useEffect, useRef, MutableRefObject } from "react";

// ── Data ─────────────────────────────────────────────────────────────────────
const capabilities = [
  {
    number: "01",
    title: "Product Thinking",
    tagline: "Definimos qué construir — y qué no.",
    avoid: "Evita gastar meses construyendo lo incorrecto.",
    tags: ["Discovery", "UX Research", "Roadmap"],
    bg: "linear-gradient(145deg, #0f0f0f 0%, #181818 45%, #222 75%, #111 100%)",
    noise:
      "radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.03) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.02) 0%, transparent 50%)",
  },
  {
    number: "02",
    title: "Design that Converts",
    tagline: "Interfaces que guían decisiones, no que se ven lindas.",
    avoid: "Evita rediseñar cada 6 meses porque 'no convierte'.",
    tags: ["UX/UI", "Design Systems", "Prototyping"],
    bg: "linear-gradient(145deg, #1a0400 0%, #2d0b04 35%, #c42d15 75%, #E8341E 100%)",
    noise:
      "radial-gradient(ellipse at 20% 80%, rgba(255,100,50,0.12) 0%, transparent 60%), radial-gradient(ellipse at 85% 15%, rgba(255,60,20,0.08) 0%, transparent 50%)",
  },
  {
    number: "03",
    title: "Engineering Ready to Scale",
    tagline: "Tecnología que aguanta el crecimiento.",
    avoid: "Evita refactorings costosos cuando lleguen los usuarios.",
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
    bg: "linear-gradient(145deg, #060c14 0%, #0c1825 40%, #112235 70%, #0a1520 100%)",
    noise:
      "radial-gradient(ellipse at 25% 75%, rgba(56,130,220,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(30,90,180,0.06) 0%, transparent 50%)",
  },
];

// ── Constants ─────────────────────────────────────────────────────────────────
const SCALE_TARGET  = 1.35;
const SCALE_PORTION = 0.22; // first 22% = zoom phase
const PAD           = 64;   // paddingLeft/Right on container (4rem)

// ── Helpers ───────────────────────────────────────────────────────────────────
const easeInCubic = (t: number) => t * t * t;

// Split a string into char objects for scatter animation
function splitChars(text: string) {
  return text.split("").map((ch) => ({ ch, isSpace: ch === " " }));
}

const LINE1_CHARS = splitChars("No ofrecemos servicios.");
const LINE2_CHARS = splitChars("Aportamos capacidades.");

export default function Capabilities() {
  const outerRef     = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);
  const galleryRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRefs       = useRef<HTMLDivElement[]>([]);

  // Char refs for scatter (line1 + line2)
  const chars1Ref = useRef<(HTMLElement | null)[]>([]);
  const chars2Ref = useRef<(HTMLElement | null)[]>([]);

  // Pre-computed scatter targets
  const scatter1 = useRef<{ rx:number;ry:number;rz:number;tx:number;ty:number;tz:number }[]>([]);
  const scatter2 = useRef<{ rx:number;ry:number;rz:number;tx:number;ty:number;tz:number }[]>([]);

  // ── Init scatter vectors ─────────────────────────────────────────────────
  useEffect(() => {
    const make = (len: number) =>
      Array.from({ length: len }, () => ({
        rx: (Math.random() - 0.5) * 720,
        ry: (Math.random() - 0.5) * 720,
        rz: (Math.random() - 0.5) * 180,
        tx: (Math.random() - 0.5) * 500,
        ty: (Math.random() - 0.5) * 400,
        tz: (Math.random() - 0.5) * 600,
      }));
    scatter1.current = make(LINE1_CHARS.length);
    scatter2.current = make(LINE2_CHARS.length);

    // Enable 3D on char parents
    chars1Ref.current.forEach((c) => {
      if (c?.parentElement) c.parentElement.style.transformStyle = "preserve-3d";
    });
    chars2Ref.current.forEach((c) => {
      if (c?.parentElement) c.parentElement.style.transformStyle = "preserve-3d";
    });
  }, []);

  // ── Main scroll animation ────────────────────────────────────────────────
  useEffect(() => {
    const outer     = outerRef.current;
    const header    = headerRef.current;
    const gallery   = galleryRef.current;
    const container = containerRef.current;
    if (!outer || !header || !gallery || !container) return;

    let totalTravel  = 0;
    let totalExtra   = 0;
    let headerH      = 0;
    let outerTop     = 0;
    let rafId        = 0;
    let prevP        = -1;

    const setup = () => {
      // Reset header to measure natural height
      header.style.height  = "";
      header.style.opacity = "";

      const vw      = window.innerWidth;
      const scrollW = container.scrollWidth;
      headerH = header.offsetHeight;

      // Left-origin math: txEnd is where gallery ends up (negative = shifted left)
      const txEnd = vw - (scrollW - PAD) * SCALE_TARGET;
      totalTravel = 0 - txEnd; // positive value
      totalExtra  = totalTravel / (1 - SCALE_PORTION);

      outer.style.height = `calc(100vh + ${totalExtra}px)`;

      // Measure outer's distance from top of document
      outerTop = outer.getBoundingClientRect().top + window.scrollY;
      prevP = -1;
    };

    const applyCharScatter = (
      charEls: (HTMLElement | null)[],
      scatters: { rx:number;ry:number;rz:number;tx:number;ty:number;tz:number }[],
      eased: number,
      hide: boolean,
    ) => {
      charEls.forEach((ch, i) => {
        if (!ch) return;
        if (hide) {
          ch.style.opacity   = "0";
          ch.style.transform = "";
          return;
        }
        const sc = scatters[i];
        if (!sc) return;
        ch.style.opacity   = String(1 - eased);
        ch.style.transform = `
          rotateX(${sc.rx * eased}deg)
          rotateY(${sc.ry * eased}deg)
          rotateZ(${sc.rz * eased}deg)
          translate3d(${sc.tx * eased}px, ${sc.ty * eased}px, ${sc.tz * eased}px)
        `;
      });
    };

    const update = () => {
      const vh      = window.innerHeight;
      const scrollY = window.scrollY;
      const p       = Math.max(0, Math.min(1, (scrollY - outerTop) / totalExtra));

      if (Math.abs(p - prevP) < 0.0002) return;
      prevP = p;

      if (p <= SCALE_PORTION) {
        // ── Phase 1: zoom in + header collapses + chars scatter ─────────
        const t     = p / SCALE_PORTION;
        const eased = easeInCubic(t);
        const s     = 1 + t * (SCALE_TARGET - 1);

        gallery.style.transform       = `translateX(0px) scale(${s})`;
        gallery.style.transformOrigin = "left center";

        // Header height collapses → gallery grows to true vertical center
        header.style.height  = `${headerH * (1 - eased)}px`;
        header.style.opacity = String(1 - eased);

        applyCharScatter(chars1Ref.current, scatter1.current, eased, false);
        applyCharScatter(chars2Ref.current, scatter2.current, eased, false);

      } else {
        // ── Phase 2: horizontal scroll ───────────────────────────────────
        const scrollP = (p - SCALE_PORTION) / (1 - SCALE_PORTION);
        const tx      = -(scrollP * totalTravel);

        gallery.style.transform       = `translateX(${tx}px) scale(${SCALE_TARGET})`;
        gallery.style.transformOrigin = "left center";

        header.style.height  = "0px";
        header.style.opacity = "0";

        applyCharScatter(chars1Ref.current, scatter1.current, 0, true);
        applyCharScatter(chars2Ref.current, scatter2.current, 0, true);
      }

      // ── Parallax per card background ─────────────────────────────────────
      const vcenter = window.innerWidth * 0.5;
      bgRefs.current.forEach((bg) => {
        if (!bg) return;
        const card = bg.closest("[data-gallery-card]") as HTMLElement;
        if (!card) return;
        const rect   = card.getBoundingClientRect();
        const center = rect.left + rect.width * 0.5;
        const t2     = Math.max(-1, Math.min(1, (center - vcenter) / vcenter));
        bg.style.transform = `translate3d(${-t2 * 10}%, 0, 0)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    const onResize = () => { setup(); update(); };

    // Delay setup one frame so layout is settled
    const raf0 = requestAnimationFrame(() => { setup(); update(); });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf0);
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ── Char span helper ─────────────────────────────────────────────────────
  const renderChars = (
    chars: { ch: string; isSpace: boolean }[],
    refs: MutableRefObject<(HTMLElement | null)[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: any,
  ) =>
    chars.map(({ ch, isSpace }, i) =>
      isSpace ? (
        <span key={i} style={{ display: "inline-block", width: "0.28em" }} />
      ) : (
        <span
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          style={{
            display: "inline-block",
            willChange: "transform, opacity",
            ...style,
          }}
        >
          {ch}
        </span>
      ),
    );

  return (
    <div
      ref={outerRef}
      id="capacidades-detalle"
      style={{ position: "relative", marginBottom: "5rem" }}
    >
      {/* Sticky panel */}
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowX: "clip",
          overflowY: "visible",
          background: "#0D0D0D",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header: collapses height during phase 1 ─────────────────────── */}
        <div
          ref={headerRef}
          style={{
            flexShrink: 0,
            overflow: "visible",
            padding: "2.5rem 4rem 0.5rem",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(237,232,223,0.35)",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
            }}
          >
            (Capacidades)
          </span>

          {/* Title line 1 */}
          <h2
            style={{
              fontFamily: "'Abril Fatface', Georgia, serif",
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              color: "#EDE8DF",
              fontWeight: 300,
              marginTop: "0.5rem",
              lineHeight: 1.1,
              perspective: "1000px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            <span style={{ display: "block", transformStyle: "preserve-3d" }}>
              {renderChars(LINE1_CHARS, chars1Ref)}
            </span>
            <span
              style={{
                display: "block",
                color: "rgba(237,232,223,0.35)",
                fontStyle: "italic",
                transformStyle: "preserve-3d",
              }}
            >
              {renderChars(LINE2_CHARS, chars2Ref)}
            </span>
          </h2>
        </div>

        {/* ── Gallery: flex:1 → grows to full 100vh as header collapses ────── */}
        <div
          ref={galleryRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "visible",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            ref={containerRef}
            style={{
              display: "flex",
              gap: "1.5rem",
              paddingLeft: "4rem",
              paddingRight: "4rem",
              alignItems: "center",
            }}
          >
            {capabilities.map((cap, i) => (
              <div
                key={i}
                data-gallery-card=""
                style={{
                  flexShrink: 0,
                  aspectRatio: "16 / 10",
                  height: "52vh",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "14px",
                }}
              >
                {/* Parallax bg */}
                <div
                  ref={(el) => { if (el) bgRefs.current[i] = el; }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-12.5%",
                    width: "125%",
                    height: "100%",
                    background: cap.bg,
                    willChange: "transform",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: cap.noise }} />
                  {/* Faded number texture */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-0.05em",
                      right: "-0.02em",
                      fontSize: "clamp(8rem, 20vw, 18rem)",
                      fontFamily: "'Abril Fatface', Georgia, serif",
                      color: "rgba(255,255,255,0.04)",
                      lineHeight: 1,
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    {cap.number}
                  </div>
                </div>

                {/* Content overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "1.6rem 2rem",
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 28%, rgba(0,0,0,0.72) 100%)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(237,232,223,0.28)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.14em",
                    }}
                  >
                    {cap.number}
                  </span>

                  <div>
                    <h3
                      style={{
                        fontFamily: "'Abril Fatface', Georgia, serif",
                        fontSize: "clamp(1.3rem, 2.2vw, 2rem)",
                        color: "#EDE8DF",
                        fontWeight: 300,
                        lineHeight: 1.2,
                        marginBottom: "0.45rem",
                      }}
                    >
                      {cap.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "rgba(237,232,223,0.52)",
                        fontSize: "0.82rem",
                        lineHeight: 1.55,
                        marginBottom: "0.6rem",
                        maxWidth: "36ch",
                      }}
                    >
                      {cap.tagline}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "rgba(237,232,223,0.3)",
                        fontSize: "0.7rem",
                        lineHeight: 1.4,
                        marginBottom: "0.75rem",
                        fontStyle: "italic",
                      }}
                    >
                      {cap.avoid}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {cap.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.62rem",
                            padding: "0.2rem 0.55rem",
                            borderRadius: "999px",
                            background: "rgba(237,232,223,0.07)",
                            color: "rgba(237,232,223,0.36)",
                            border: "1px solid rgba(237,232,223,0.09)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            flexShrink: 0,
            padding: "0 4rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
          }}
        >
          <div style={{ width: 24, height: 1, background: "rgba(237,232,223,0.15)" }} />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.6rem",
              color: "rgba(237,232,223,0.15)",
              letterSpacing: "0.1em",
            }}
          >
            scroll para explorar
          </span>
          <div style={{ width: 24, height: 1, background: "rgba(237,232,223,0.15)" }} />
        </div>
      </div>
    </div>
  );
}
