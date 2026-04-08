"use client";

import { useEffect, useRef, MutableRefObject } from "react";

const capabilities = [
  {
    number: "01", title: "Product Thinking",
    tagline: "Definimos qué construir — y qué no.",
    avoid: "Evita gastar meses construyendo lo incorrecto.",
    tags: ["Discovery", "UX Research", "Roadmap"],
    bg: "linear-gradient(145deg, #0f0f0f 0%, #181818 45%, #222 75%, #111 100%)",
    noise: "radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.03) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.02) 0%, transparent 50%)",
  },
  {
    number: "02", title: "Design that Converts",
    tagline: "Interfaces que guían decisiones, no que se ven lindas.",
    avoid: "Evita rediseñar cada 6 meses porque 'no convierte'.",
    tags: ["UX/UI", "Design Systems", "Prototyping"],
    bg: "linear-gradient(145deg, #1a0400 0%, #2d0b04 35%, #c42d15 75%, #E8341E 100%)",
    noise: "radial-gradient(ellipse at 20% 80%, rgba(255,100,50,0.12) 0%, transparent 60%), radial-gradient(ellipse at 85% 15%, rgba(255,60,20,0.08) 0%, transparent 50%)",
  },
  {
    number: "03", title: "Engineering Ready to Scale",
    tagline: "Tecnología que aguanta el crecimiento.",
    avoid: "Evita refactorings costosos cuando lleguen los usuarios.",
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
    bg: "linear-gradient(145deg, #060c14 0%, #0c1825 40%, #112235 70%, #0a1520 100%)",
    noise: "radial-gradient(ellipse at 25% 75%, rgba(56,130,220,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(30,90,180,0.06) 0%, transparent 50%)",
  },
];

const cases = [
  { client: "Watch",                year: "2024", tag: "Web Experience",
    result: "Experiencia web inmersiva para marca de belleza. Proyecto de laboratorio interno.",
    video: "/watch.mp4",
    thumbBg: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)", leftBg: "#0f0f1a" },
  { client: "SaaS B2B",            year: "2023", tag: "Design System / Frontend",
    result: "Tiempo de desarrollo de nuevas features: −40% en el trimestre.",
    thumbBg: "linear-gradient(135deg, #150700 0%, #0a0300 100%)", leftBg: "#0d0400" },
  { client: "E-commerce regional",  year: "2024", tag: "Web / Performance",
    result: "Carga mobile: 8.4s → 1.8s. Conversiones mobile: +47%.",
    thumbBg: "linear-gradient(135deg, #080200 0%, #020000 100%)", leftBg: "#070200" },
];

const PAD           = 64;
const GAP           = 24;
const CARD_H_VH     = 70;
const CASES_W_RATIO = 0.62;
const NOISE         = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";
const easeInCubic  = (t: number) => t * t * t;
const power4       = (t: number) => t * t * t * t;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

function splitChars(text: string) {
  return text.split("").map((ch) => ({ ch, isSpace: ch === " " }));
}
const LINE0 = splitChars("(Capacidades)");
const LINE1 = splitChars("No ofrecemos servicios.");
const LINE2 = splitChars("Aportamos capacidades.");

export default function Capabilities() {
  const outerRef     = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);
  const galleryRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRefs       = useRef<HTMLDivElement[]>([]);
  const orangeBgRef  = useRef<HTMLDivElement>(null);

  // Cases card — position:absolute in sticky, tracks gallery in Phase 2
  const casesCardRef     = useRef<HTMLDivElement>(null);
  const casesLeftRef     = useRef<HTMLDivElement>(null);
  const caseRightRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const caseTabRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const caseTabNameRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const caseTabThumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const caseTabDotRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const pixelGridRef     = useRef<HTMLDivElement>(null);
  const pixelTimeouts    = useRef<ReturnType<typeof setTimeout>[]>([]);

  const chars0Ref = useRef<(HTMLElement | null)[]>([]);
  const chars1Ref = useRef<(HTMLElement | null)[]>([]);
  const chars2Ref = useRef<(HTMLElement | null)[]>([]);
  const scatter0  = useRef<{ x: number; y: number }[]>([]);
  const scatter1  = useRef<{ x: number; y: number }[]>([]);
  const scatter2  = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const make = (len: number) => Array.from({ length: len }, () => ({
      x: (Math.random() - 0.5) * 120, y: (Math.random() - 0.5) * 120,
    }));
    scatter0.current = make(LINE0.length);
    scatter1.current = make(LINE1.length);
    scatter2.current = make(LINE2.length);

    // Inicializar pixel grid (7×7 = 49 píxeles)
    const grid = pixelGridRef.current;
    if (grid) {
      const G = 7, pct = 100 / G;
      for (let r = 0; r < G; r++) {
        for (let c = 0; c < G; c++) {
          const px = document.createElement("div");
          px.style.cssText = `position:absolute;width:${pct}%;height:${pct}%;left:${c*pct}%;top:${r*pct}%;background:rgba(13,13,13,0.97);opacity:0;transition:opacity 0s;`;
          grid.appendChild(px);
        }
      }
    }
    return () => { pixelTimeouts.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    const outer     = outerRef.current;
    const sticky    = stickyRef.current;
    const header    = headerRef.current;
    const gallery   = galleryRef.current;
    const container = containerRef.current;
    const orangeBg  = orangeBgRef.current;
    const casesCard = casesCardRef.current;
    const casesLeft = casesLeftRef.current;
    if (!outer || !header || !gallery || !container || !casesCard) return;

    if (sticky) { sticky.style.borderRadius = "0px"; }
    if (casesLeft) casesLeft.style.transition = "background 0.6s cubic-bezier(0.16,1,0.3,1)";

    let phase1Px = 0, phase2Px = 0, phase3aPx = 0, waitPx = 0, casePx = 0;
    let phase2TxEnd = 0, headerH = 0, outerTop = 0, rafId = 0, prevScrolled = -9999, activeCase = -1;
    // card bounds at Phase 2 end (px in sticky container)
    let cardL = 0, cardT = 0, cardW = 0, cardH = 0;
    // gallery X position of cases card (before translate)
    let xCasesLeft = 0;

    const applyTabState = (idx: number) => {
      caseTabRefs.current.forEach((el, i) => { if (el) el.style.backgroundColor = i === idx ? "rgba(255,255,255,0.07)" : "transparent"; });
      caseTabNameRefs.current.forEach((el, i) => { if (el) el.style.color = i === idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)"; });
      caseTabThumbRefs.current.forEach((el, i) => { if (el) el.style.borderColor = i === idx ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"; });
      caseTabDotRefs.current.forEach((el, i) => { if (el) el.style.opacity = i === idx ? "1" : "0"; });
    };

    const GRID_SIZE = 7;
    const TOTAL_PX  = GRID_SIZE * GRID_SIZE;
    const STEP_MS   = 280 / TOTAL_PX;

    const showCase = (idx: number) => {
      if (idx === activeCase) return;
      const from = activeCase;
      activeCase = idx; // marca inmediatamente para evitar re-triggers
      applyTabState(idx);

      const grid = pixelGridRef.current;
      if (!grid || from === -1) {
        // Primera vez: sin transición, mostrar directo
        caseRightRefs.current.forEach((el, i) => { if (el) el.style.opacity = i === idx ? "1" : "0"; });
        return;
      }

      // Cancelar timeouts previos
      pixelTimeouts.current.forEach(clearTimeout);
      pixelTimeouts.current = [];

      const pixels = Array.from(grid.children) as HTMLElement[];
      // Orden aleatorio para show y hide
      const showOrder = [...pixels].sort(() => Math.random() - 0.5);
      const hideOrder = [...pixels].sort(() => Math.random() - 0.5);

      // 1. Mostrar pixels aleatoriamente
      showOrder.forEach((px, i) => {
        const t = setTimeout(() => { px.style.opacity = "1"; }, i * STEP_MS);
        pixelTimeouts.current.push(t);
      });

      // 2. Al completarse los pixels, cambiar el panel
      const mid = setTimeout(() => {
        caseRightRefs.current.forEach((el, i) => { if (el) el.style.opacity = i === idx ? "1" : "0"; });
      }, 280);
      pixelTimeouts.current.push(mid);

      // 3. Esconder pixels aleatoriamente
      hideOrder.forEach((px, i) => {
        const t = setTimeout(() => { px.style.opacity = "0"; }, 280 + i * STEP_MS);
        pixelTimeouts.current.push(t);
      });
    };

    const setCardPos = (left: number, top: number, width: number, height: number, radius: number, opacity: number, _unused?: boolean) => {
      casesCard.style.transition   = "none";
      casesCard.style.left         = `${left}px`;
      casesCard.style.top          = `${top}px`;
      casesCard.style.width        = `${width}px`;
      casesCard.style.height       = `${height}px`;
      casesCard.style.borderRadius = `${radius}px`;
      casesCard.style.opacity      = String(opacity);
    };

    const setup = () => {
      header.style.height = ""; header.style.opacity = "";
      const vw = window.innerWidth, vh = window.innerHeight;
      headerH = header.offsetHeight;

      const capCardH   = Math.round(vh * CARD_H_VH / 100);
      const capCardW   = Math.round(capCardH * 1.6);
      const casesCardW = Math.round(vw * CASES_W_RATIO);

      xCasesLeft   = PAD + capabilities.length * (capCardW + GAP);
      const xCasesRight = xCasesLeft + casesCardW;
      phase2TxEnd  = -(xCasesRight - vw + PAD);
      phase2Px     = Math.max(0, -phase2TxEnd);

      cardW = casesCardW;
      cardH = capCardH;
      cardT = (vh - cardH) / 2;
      cardL = xCasesLeft + phase2TxEnd; // screen position at end of Phase 2

      phase3aPx = vh * 0.7; // scroll-driven expansion travel
      waitPx    = vh * 0.4;
      casePx    = cases.length * vh;
      phase1Px  = vh * 0.8;

      outer.style.height = `calc(100vh + ${phase1Px + phase2Px + phase3aPx + waitPx + casePx}px)`;
      outerTop     = outer.getBoundingClientRect().top + window.scrollY;
      prevScrolled = -9999;
      activeCase   = -1;

      // Reset card to its starting position (off-screen right)
      setCardPos(xCasesLeft, cardT, cardW, cardH, 14, 0, false);
      casesCard.style.pointerEvents = "none";
    };

    const applyCharScatter = (els: (HTMLElement | null)[], scatters: { x: number; y: number }[], progress: number, hide: boolean) => {
      const e = power4(progress);
      els.forEach((ch, i) => {
        if (!ch) return;
        if (hide) { ch.style.opacity = "0"; ch.style.transform = ""; return; }
        const sc = scatters[i]; if (!sc) return;
        ch.style.opacity   = String(1 - e);
        ch.style.transform = `translateX(${sc.x * e}%) translateY(${sc.y * e}%)`;
      });
    };

    const update = () => {
      const vw       = window.innerWidth;
      const vh       = window.innerHeight;
      const scrolled = window.scrollY - outerTop;
      if (Math.abs(scrolled - prevScrolled) < 0.5) return;
      prevScrolled = scrolled;

      const phase3Start = phase1Px + phase2Px;
      const phase3aEnd  = phase3Start + phase3aPx;

      // Before
      if (scrolled <= 0) {
        gallery.style.transform = "translateY(100%)";
        gallery.style.paddingTop = `${headerH * 2}px`;
        header.style.height = ""; header.style.opacity = "";
        if (orangeBg) orangeBg.style.opacity = "0";
        setCardPos(xCasesLeft, cardT, cardW, cardH, 14, 0, false);
        casesCard.style.pointerEvents = "none";
        applyCharScatter(chars0Ref.current, scatter0.current, 0, false);
        applyCharScatter(chars1Ref.current, scatter1.current, 0, false);
        applyCharScatter(chars2Ref.current, scatter2.current, 0, false);

      // Phase 1: scatter + collapse header; gallery empieza a moverse en la 2da mitad
      } else if (scrolled <= phase1Px) {
        const t         = scrolled / phase1Px;
        const scatterT  = Math.min(1, t / 0.45);
        applyCharScatter(chars0Ref.current, scatter0.current, scatterT, false);
        applyCharScatter(chars1Ref.current, scatter1.current, scatterT, false);
        applyCharScatter(chars2Ref.current, scatter2.current, scatterT, false);
        const collapseT = Math.max(0, Math.min(1, (t - 0.35) / 0.65));
        const eased     = easeInCubic(collapseT);
        // Gallery sube verticalmente mientras el texto scatter
        const slideUp = easeOutQuart(t);
        gallery.style.transform  = `translateY(${(1 - slideUp) * 100}%)`;
        gallery.style.paddingTop = `${headerH * 2 * (1 - eased)}px`;
        header.style.height  = `${headerH * (1 - eased)}px`;
        header.style.opacity = String(1 - eased);
        if (orangeBg) orangeBg.style.opacity = "0";
        setCardPos(xCasesLeft, cardT, cardW, cardH, 14, 0, false);
        casesCard.style.pointerEvents = "none";

      // Phase 2: gallery scrollea horizontalmente
      } else if (scrolled <= phase3Start) {
        const t  = phase2Px > 0 ? (scrolled - phase1Px) / phase2Px : 1;
        const tx = phase2TxEnd * t;

        gallery.style.transform = `translateX(${tx}px)`;
        gallery.style.paddingTop = "0px";
        header.style.height = "0px"; header.style.opacity = "0";
        applyCharScatter(chars0Ref.current, scatter0.current, 0, true);
        applyCharScatter(chars1Ref.current, scatter1.current, 0, true);
        applyCharScatter(chars2Ref.current, scatter2.current, 0, true);
        if (orangeBg) orangeBg.style.opacity = String(Math.min(1, t / 0.15));

        // Card tracks gallery usando el mismo tx
        const screenLeft = xCasesLeft + tx;
        const entryT     = Math.max(0, Math.min(1, (screenLeft - vw * 0.95) / -(vw * 0.3)));
        setCardPos(screenLeft, cardT, cardW, cardH, 14, entryT, false);
        casesCard.style.pointerEvents = "none";

      // Phase 3a: gallery sigue saliendo de cuadro + Cases card se expande
      } else if (scrolled <= phase3aEnd) {
        const t = (scrolled - phase3Start) / phase3aPx;
        const e = easeOutQuart(t);

        // Gallery sigue slideeando para sacar las cap cards de pantalla
        const extraSlide = cardL; // cardL = distancia que falta para que cap3 salga por la izquierda
        gallery.style.transform = `translateX(${phase2TxEnd - extraSlide * e}px)`;
        gallery.style.paddingTop = "0px";
        if (orangeBg) orangeBg.style.opacity = "1";

        const left   = cardL + (0   - cardL)  * e;
        const top    = cardT + (0   - cardT)   * e;
        const width  = cardW + (vw  - cardW)   * e;
        const height = cardH + (vh  - cardH)   * e;
        const radius = 14   * (1 - e);
        setCardPos(left, top, width, height, radius, 1, false);
        casesCard.style.pointerEvents = e > 0.95 ? "auto" : "none";
        showCase(0);

      // Phase 3b+: fullscreen, wait then switch cases
      } else {
        gallery.style.transform = `translateX(${phase2TxEnd - cardL}px)`;
        gallery.style.paddingTop = "0px";
        if (orangeBg) orangeBg.style.opacity = "1";
        setCardPos(0, 0, vw, vh, 0, 1, false);
        casesCard.style.pointerEvents = "auto";

        const raw = Math.max(0, scrolled - phase3aEnd - waitPx);
        showCase(Math.min(cases.length - 1, Math.floor(raw / vh)));
      }

      // Parallax per cap bg
      const vcenter = vw * 0.5;
      bgRefs.current.forEach((bg) => {
        if (!bg) return;
        const card = bg.closest("[data-gallery-card]") as HTMLElement;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const t2   = Math.max(-1, Math.min(1, (rect.left + rect.width * 0.5 - vcenter) / (vw * 0.5)));
        bg.style.transform = `translate3d(${-t2 * 8}%, 0, 0)`;
      });
    };

    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); };
    const onResize = () => { setup(); update(); };
    const raf0     = requestAnimationFrame(() => { setup(); update(); });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf0); cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const renderChars = (
    chars: { ch: string; isSpace: boolean }[],
    refs: MutableRefObject<(HTMLElement | null)[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: any,
  ) =>
    chars.map(({ ch, isSpace }, i) =>
      isSpace ? <span key={i} style={{ display: "inline-block", width: "0.28em" }} /> : (
        <span key={i} ref={(el) => { refs.current[i] = el; }} style={{ display: "inline-block", willChange: "transform, opacity", ...style }}>{ch}</span>
      )
    );

  return (
    <div ref={outerRef} id="capacidades-detalle" style={{ position: "relative" }}>
      <div ref={stickyRef} style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#0D0D0D" }}>

        {/* Orange bg */}
        <div ref={orangeBgRef} style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #1a0900 0%, #2d1100 40%, #1f0a00 70%, #150700 100%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundRepeat: "repeat", backgroundSize: "180px 180px", opacity: 0.09, mixBlendMode: "overlay" }} />
        </div>

        {/* Header */}
        <div ref={headerRef} style={{ overflow: "visible", padding: "9rem 4rem 3rem", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(237,232,223,0.35)", fontSize: "0.72rem", letterSpacing: "0.1em", display: "inline-block" }}>
            {renderChars(LINE0, chars0Ref)}
          </span>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2.8rem, 5vw, 4.5rem)", color: "#EDE8DF", fontWeight: 300, marginTop: "0.5rem", lineHeight: 1.1, perspective: "1000px", perspectiveOrigin: "50% 50%" }}>
            <span style={{ display: "block", transformStyle: "preserve-3d" }}>{renderChars(LINE1, chars1Ref)}</span>
            <span style={{ display: "block", color: "rgba(237,232,223,0.35)", fontStyle: "italic", transformStyle: "preserve-3d" }}>{renderChars(LINE2, chars2Ref)}</span>
          </h2>
        </div>

        {/* Gallery — capability cards only; spacer reserves Cases width for scrollWidth */}
        <div ref={galleryRef} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", zIndex: 1, willChange: "transform" }}>
          <div ref={containerRef} style={{ display: "flex", gap: "1.5rem", paddingLeft: "4rem", paddingRight: "4rem", alignItems: "center", flexShrink: 0 }}>
            {capabilities.map((cap, i) => (
              <div key={i} data-gallery-card="" style={{ flexShrink: 0, aspectRatio: "16 / 10", height: `${CARD_H_VH}vh`, overflow: "hidden", position: "relative", borderRadius: "14px" }}>
                <div ref={(el) => { if (el) bgRefs.current[i] = el; }} style={{ position: "absolute", top: 0, left: "-12.5%", width: "125%", height: "100%", background: cap.bg, willChange: "transform" }}>
                  <div style={{ position: "absolute", inset: 0, background: cap.noise }} />
                  <div style={{ position: "absolute", bottom: "-0.05em", right: "-0.02em", fontSize: "clamp(8rem, 20vw, 18rem)", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{cap.number}</div>
                </div>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.6rem 2rem", background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 28%, rgba(0,0,0,0.72) 100%)" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(237,232,223,0.28)", fontSize: "0.65rem", letterSpacing: "0.14em" }}>{cap.number}</span>
                  <div>
                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.3rem, 2.2vw, 2rem)", color: "#EDE8DF", fontWeight: 700, lineHeight: 1.2, marginBottom: "0.45rem" }}>{cap.title}</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(237,232,223,0.52)", fontSize: "0.82rem", lineHeight: 1.55, marginBottom: "0.6rem", maxWidth: "36ch" }}>{cap.tagline}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(237,232,223,0.3)", fontSize: "0.7rem", lineHeight: 1.4, marginBottom: "0.75rem", fontStyle: "italic" }}>{cap.avoid}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {cap.tags.map((tag) => (
                        <span key={tag} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", padding: "0.2rem 0.55rem", borderRadius: "999px", background: "rgba(237,232,223,0.07)", color: "rgba(237,232,223,0.36)", border: "1px solid rgba(237,232,223,0.09)" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Spacer: keeps scrollWidth correct for phase2 calculation */}
            <div style={{ flexShrink: 0, width: `${CASES_W_RATIO * 100}vw` }} />
            <div style={{ flexShrink: 0, width: "4rem" }} />
          </div>
        </div>

        {/* ── Cases card: position:absolute, tracks gallery in Phase 2, expands to 100% in Phase 3 ── */}
        <div
          ref={casesCardRef}
          style={{ position: "absolute", overflow: "hidden", zIndex: 3, display: "flex", opacity: 0, pointerEvents: "none" }}
        >
          {/* Left panel */}
          <div ref={casesLeftRef} style={{ width: "36%", height: "100%", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "4rem 3rem 3.5rem", position: "relative", overflow: "hidden", boxSizing: "border-box" }}>
            <div style={{ position: "relative" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)" }}>(Casos)</span>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2.8rem)", color: "rgba(255,255,255,0.9)", fontWeight: 300, lineHeight: 1.15, marginTop: "1rem", marginBottom: "1rem" }}>
                Sin portfolio<br /><em style={{ color: "rgba(255,255,255,0.4)" }}>pasivo.</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(0.65rem, 1vw, 0.8rem)", color: "rgba(255,255,255,0.35)", lineHeight: 1.65, maxWidth: "26ch" }}>
                Contexto, problema, decisión y resultado real.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", position: "relative" }}>
              {cases.map((c, i) => (
                <div key={i} ref={(el) => { caseTabRefs.current[i] = el; }}
                  style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.65rem 0.7rem", borderRadius: "10px", backgroundColor: i === 0 ? "rgba(255,255,255,0.07)" : "transparent", transition: "background-color 0.4s" }}>
                  <div ref={(el) => { caseTabThumbRefs.current[i] = el; }}
                    style={{ width: 76, height: 48, borderRadius: 7, background: c.thumbBg, flexShrink: 0, border: i === 0 ? "1.5px solid rgba(255,255,255,0.3)" : "1.5px solid rgba(255,255,255,0.06)", transition: "border-color 0.4s", overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "80px 80px", opacity: 0.1 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div ref={(el) => { caseTabNameRefs.current[i] = el; }} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(0.7rem, 1.1vw, 0.82rem)", color: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)", transition: "color 0.4s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.client}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", marginTop: "0.2rem" }}>{c.tag}</div>
                  </div>
                  <div ref={(el) => { caseTabDotRefs.current[i] = el; }} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.6)", flexShrink: 0, opacity: i === 0 ? 1 : 0, transition: "opacity 0.4s" }} />
                </div>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.09em", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "0.75rem 1.6rem", display: "inline-block", cursor: "pointer" }}>VER TODOS</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", marginTop: "0.85rem", lineHeight: 1.5 }}>Los nombres son confidenciales por acuerdo.</p>
            </div>
          </div>

          {/* Right panels */}
          <div style={{ flex: 1, height: "100%", position: "relative", overflow: "hidden", borderRadius: "16px" }}>
            {cases.map((c, i) => (
              <div key={i} ref={(el) => { caseRightRefs.current[i] = el; }}
                style={{ position: "absolute", inset: 0, opacity: i === 0 ? 1 : 0 }}>
                {/* Video (solo caso con video definido) */}
                {"video" in c && c.video && (
                  <video
                    src={c.video as string}
                    autoPlay loop muted playsInline
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                <div style={{ position: "absolute", top: "50%", right: "5%", transform: "translateY(-50%)", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(8rem, 20vw, 18rem)", color: "rgba(255,255,255,0.03)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>0{i + 1}</div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2.5rem 3rem", background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)" }}>{c.year}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "0.3rem 0.85rem", borderRadius: "999px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>[{c.tag.toUpperCase()}]</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem" }}>
                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "rgba(255,255,255,0.92)", fontWeight: 300, lineHeight: 1.1, margin: 0 }}>{c.client}</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.55, maxWidth: "32ch", textAlign: "right", margin: 0, flexShrink: 0 }}>{c.result}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Pixel grid overlay para transición entre casos */}
            <div ref={pixelGridRef} style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }} />
          </div>
        </div>

      </div>
    </div>
  );
}
