"use client";

import { useEffect, useRef, MutableRefObject } from "react";
import WavyLines from "./WavyLines";
import CTAButton from "./CTAButton";

// Variantes oscuras de #C8784A (H≈22°, S≈60%) — entre L 8% y 14%, sin llegar a negro
const capabilities = [
  {
    number: "01", title: "Product Thinking",
    tagline: "Definimos qué construir — y qué no.",
    avoid: "Evita gastar meses construyendo lo incorrecto.",
    tags: ["Discovery", "UX Research", "Roadmap"],
    bg: "linear-gradient(145deg, #1a0c06 0%, #211009 45%, #271409 75%, #1c0e07 100%)",
    noise: "radial-gradient(ellipse at 30% 70%, rgba(200,120,74,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,120,74,0.04) 0%, transparent 50%)",
  },
  {
    number: "02", title: "Design that Converts",
    tagline: "Interfaces que guían decisiones, no que se ven lindas.",
    avoid: "Evita rediseñar cada 6 meses porque 'no convierte'.",
    tags: ["UX/UI", "Design Systems", "Prototyping"],
    bg: "linear-gradient(145deg, #1e0e07 0%, #28130a 35%, #301609 75%, #251109 100%)",
    noise: "radial-gradient(ellipse at 20% 80%, rgba(200,120,74,0.08) 0%, transparent 60%), radial-gradient(ellipse at 85% 15%, rgba(200,120,74,0.05) 0%, transparent 50%)",
  },
  {
    number: "03", title: "Engineering Ready to Scale",
    tagline: "Tecnología que aguanta el crecimiento.",
    avoid: "Evita refactorings costosos cuando lleguen los usuarios.",
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
    bg: "linear-gradient(145deg, #1c0d07 0%, #231109 40%, #2b1509 70%, #1e0e07 100%)",
    noise: "radial-gradient(ellipse at 25% 75%, rgba(200,120,74,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,120,74,0.04) 0%, transparent 50%)",
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
  const casesRightRef    = useRef<HTMLDivElement>(null);
  const spacerRef        = useRef<HTMLDivElement>(null);
  const caseRightRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const caseTabRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const caseTabNameRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const caseTabThumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const caseTabDotRefs   = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile nav bar
  const mobileNavBarRef    = useRef<HTMLDivElement>(null);
  const mobileCaseTitleRef = useRef<HTMLHeadingElement>(null);
  const mobileCaseTagRef   = useRef<HTMLSpanElement>(null);
  const mobilePrevRef      = useRef<HTMLButtonElement>(null);
  const mobileNextRef      = useRef<HTMLButtonElement>(null);
  const mobileDotRefs      = useRef<(HTMLSpanElement | null)[]>([]);

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

    return () => {};
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
    let isMobileMode = false;
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

    const showCase = (idx: number) => {
      if (idx === activeCase) return;
      const from = activeCase;
      activeCase = idx; // marca inmediatamente para evitar re-triggers
      applyTabState(idx);

      // Update mobile nav bar
      if (mobileCaseTitleRef.current) mobileCaseTitleRef.current.textContent = cases[idx].client;
      if (mobileCaseTagRef.current)   mobileCaseTagRef.current.textContent   = `[${cases[idx].tag.toUpperCase()}]`;
      mobileDotRefs.current.forEach((dot, i) => {
        if (dot) dot.style.background = i === idx ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)";
      });
      if (mobilePrevRef.current) mobilePrevRef.current.style.opacity = idx === 0 ? "0.3" : "1";
      if (mobileNextRef.current) mobileNextRef.current.style.opacity = idx === cases.length - 1 ? "0.3" : "1";

      caseRightRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transition = "opacity 0.35s ease";
        el.style.opacity = i === idx ? "1" : "0";
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

      const isMobile = vw < 768;
      const padPx    = isMobile ? 16 : PAD;
      const gapPx    = isMobile ? 12 : GAP;

      // Update container gap and padding to match JS calculations
      container.style.paddingLeft  = `${padPx}px`;
      container.style.paddingRight = `${padPx}px`;
      container.style.gap          = `${gapPx}px`;

      const capCardH   = Math.round(Math.min(vh * CARD_H_VH / 100, vw * 0.78 * 1.25));
      const capCardW   = Math.round(Math.min(vh * CARD_H_VH / 100 * 1.6, vw * 0.78));
      // On mobile, cases card = same width as cap cards (appears right after last card)
      const casesCardW = isMobile ? capCardW : Math.round(vw * CASES_W_RATIO);

      // Update spacer width to match casesCardW
      if (spacerRef.current) spacerRef.current.style.width = `${casesCardW}px`;

      xCasesLeft   = padPx + capabilities.length * (capCardW + gapPx);
      const xCasesRight = xCasesLeft + casesCardW;
      phase2TxEnd  = -(xCasesRight - vw + padPx);
      phase2Px     = Math.max(0, -phase2TxEnd);

      cardW = casesCardW;
      cardH = capCardH;
      cardT = (vh - cardH) / 2;
      cardL = xCasesLeft + phase2TxEnd; // screen position at end of Phase 2

      phase3aPx = isMobile ? vh * 0.5 : vh * 0.7;
      waitPx    = vh * 0.4;
      // On mobile, case switching is via tap buttons — no extra scroll needed
      casePx    = isMobile ? 0 : cases.length * vh;
      phase1Px  = isMobile ? vh * 0.35 : vh * 0.8;
      isMobileMode = isMobile;

      // Mobile: video fills the whole card, nav bar overlays at bottom
      if (casesLeft)             casesLeft.style.display             = isMobile ? "none" : "";
      if (casesRightRef.current) {
        casesRightRef.current.style.height       = isMobile ? "100%" : "";
        casesRightRef.current.style.borderRadius = isMobile ? "0"    : "";
      }
      if (mobileNavBarRef.current) mobileNavBarRef.current.style.display = isMobile ? "flex" : "none";
      if (isMobile && mobilePrevRef.current) {
        mobilePrevRef.current.onclick = () => showCase(Math.max(0, activeCase - 1));
      }
      if (isMobile && mobileNextRef.current) {
        mobileNextRef.current.onclick = () => showCase(Math.min(cases.length - 1, activeCase + 1));
      }

      outer.style.height = `calc(100vh + ${phase1Px + phase2Px + phase3aPx + waitPx + casePx}px)`;
      outerTop     = outer.getBoundingClientRect().top + window.scrollY;
      prevScrolled = -9999;
      activeCase   = -1;

      // Reset card to its starting position (off-screen right)
      setCardPos(xCasesLeft, cardT, cardW, cardH, 14, 0, false);
      casesCard.style.pointerEvents = "none";

      // Click + hover en tabs
      caseTabRefs.current.forEach((tab, i) => {
        if (!tab) return;
        tab.style.cursor = "pointer";
        tab.onmouseenter = () => {
          if (activeCase !== i) tab.style.backgroundColor = "rgba(255,255,255,0.04)";
        };
        tab.onmouseleave = () => {
          if (activeCase !== i) tab.style.backgroundColor = "transparent";
        };
        tab.onclick = () => {
          const target = outerTop + phase1Px + phase2Px + phase3aPx + waitPx + i * window.innerHeight;
          window.scrollTo({ top: target, behavior: "smooth" });
        };
      });
    };

    // ── Color de fondo scroll-driven ─────────────────────────────────────────
    const BG_DARK   = [13,  13,  13 ];  // #0D0D0D
    const BG_ORANGE = [200, 120, 74 ];  // #C8784A
    const BG_CASE   = [26,  12,   6 ];  // #1a0c06
    const lerpBg = (from: number[], to: number[], t: number) => {
      if (!sticky) return;
      const e = Math.max(0, Math.min(1, t));
      const r = Math.round(from[0] + (to[0] - from[0]) * e);
      const g = Math.round(from[1] + (to[1] - from[1]) * e);
      const b = Math.round(from[2] + (to[2] - from[2]) * e);
      sticky.style.background = `rgb(${r},${g},${b})`;
    };
    const setBg     = (t: number) => lerpBg(BG_DARK,   BG_ORANGE, t);
    const setCaseBg = (t: number) => lerpBg(BG_ORANGE, BG_CASE,   t);

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
        setBg(0);

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
        setBg(easeInCubic(t));

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
        setBg(1);

      // Phase 3a: gallery sigue saliendo de cuadro + Cases card se expande
      } else if (scrolled <= phase3aEnd) {
        const t = (scrolled - phase3Start) / phase3aPx;
        const e = easeOutQuart(t);

        // Gallery sigue slideeando para sacar las cap cards de pantalla
        const extraSlide = cardL; // cardL = distancia que falta para que cap3 salga por la izquierda
        gallery.style.transform = `translateX(${phase2TxEnd - extraSlide * e}px)`;
        gallery.style.paddingTop = "0px";
        if (orangeBg) orangeBg.style.opacity = String(1 - e);

        const left   = cardL + (0   - cardL)  * e;
        const width  = cardW + (vw  - cardW)   * e;
        const height = cardH + (vh  - cardH)   * e;
        // top fijo en cardT (igual que las cap cards) durante el 90% de la expansión;
        // solo baja a 0 en el último 10% para evitar el salto al entrar en phase 3b
        const topT   = Math.max(0, (e - 0.9) / 0.1);
        const top    = cardT * (1 - topT);
        const radius = 14   * (1 - e);
        setCardPos(left, top, width, height, radius, 1, false);
        casesCard.style.pointerEvents = e > 0.95 ? "auto" : "none";
        showCase(0);
        setCaseBg(e);

      // Phase 3b+: fullscreen, wait then switch cases
      } else {
        gallery.style.transform = `translateX(${phase2TxEnd - cardL}px)`;
        gallery.style.paddingTop = "0px";
        if (orangeBg) orangeBg.style.opacity = "0";
        setCardPos(0, 0, vw, vh, 0, 1, false);
        casesCard.style.pointerEvents = "auto";
        setCaseBg(1);

        if (!isMobileMode) {
          const raw = Math.max(0, scrolled - phase3aEnd - waitPx);
          showCase(Math.min(cases.length - 1, Math.floor(raw / vh)));
        }
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
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #a85e30 0%, #c8784a 40%, #b86838 70%, #a05530 100%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundRepeat: "repeat", backgroundSize: "180px 180px", opacity: 0.09, mixBlendMode: "overlay" }} />
          <WavyLines color="rgba(255,255,255,0.10)" xGap={10} yGap={32} />
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
              <div key={i} data-gallery-card="" style={{ flexShrink: 0, width: `min(${CARD_H_VH * 1.6}vh, 78vw)`, height: `min(${CARD_H_VH}vh, ${78 * 1.25}vw)`, overflow: "hidden", position: "relative", borderRadius: "14px" }}>
                <div ref={(el) => { if (el) bgRefs.current[i] = el; }} style={{ position: "absolute", top: 0, left: "-12.5%", width: "125%", height: "100%", background: cap.bg, willChange: "transform" }}>
                  <div style={{ position: "absolute", inset: 0, background: cap.noise }} />
                  <div style={{ position: "absolute", bottom: "-0.05em", right: "-0.02em", fontSize: "clamp(8rem, 20vw, 18rem)", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{cap.number}</div>
                </div>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.6rem 2rem", background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 28%, rgba(0,0,0,0.72) 100%)" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(237,232,223,0.28)", fontSize: "0.65rem", letterSpacing: "0.14em" }}>{cap.number}</span>
                  <div>
                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2rem, 3.8vw, 3.8rem)", color: "#EDE8DF", fontWeight: 500, lineHeight: 1.05, marginBottom: "0.55rem", letterSpacing: "-0.02em" }}>{cap.title}</h3>
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
            {/* Spacer: keeps scrollWidth correct for phase2 calculation — width set dynamically in setup() */}
            <div ref={spacerRef} style={{ flexShrink: 0, width: `${CASES_W_RATIO * 100}vw` }} />
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
                Selected<br /><em style={{ color: "rgba(255,255,255,0.4)" }}>works.</em>
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
              <CTAButton label="Ver todos" href="#casos" height={42} minWidth={120} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", marginTop: "0.85rem", lineHeight: 1.5 }}>Los nombres son confidenciales por acuerdo.</p>
            </div>
          </div>

          {/* Right panels */}
          <div ref={casesRightRef} style={{ flex: 1, height: "100%", position: "relative", overflow: "hidden", borderRadius: "16px" }}>
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
          </div>

          {/* ── Mobile nav bar: video header + title + prev/next (hidden on desktop) ── */}
          <div
            ref={mobileNavBarRef}
            style={{
              display:       "none", // setup() lo activa en mobile
              position:      "absolute",
              bottom:        0,
              left:          0,
              right:         0,
              zIndex:        5,
              flexDirection: "column",
              gap:           "0.55rem",
              padding:       "4rem 1.4rem 5.8rem",
              background:    "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.82) 35%, rgba(0,0,0,0.45) 65%, transparent 100%)",
              pointerEvents: "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h3
                  ref={mobileCaseTitleRef}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.9rem, 7.5vw, 2.6rem)", color: "rgba(255,255,255,0.92)", fontWeight: 300, lineHeight: 1.05, margin: 0 }}
                >
                  {cases[0].client}
                </h3>
                <span
                  ref={mobileCaseTagRef}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "0.22rem 0.65rem", borderRadius: "999px", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", display: "inline-block", marginTop: "0.45rem" }}
                >
                  [{cases[0].tag.toUpperCase()}]
                </span>
              </div>
              {/* Prev / Next */}
              <div style={{ display: "flex", gap: "0.45rem", pointerEvents: "auto" }}>
                <button
                  ref={mobilePrevRef}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: "1.15rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.3s", opacity: 0.3 }}
                >←</button>
                <button
                  ref={mobileNextRef}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: "1.15rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.3s" }}
                >→</button>
              </div>
            </div>
            {/* Dots */}
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              {cases.map((_, i) => (
                <span
                  key={i}
                  ref={el => { mobileDotRefs.current[i] = el; }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)", transition: "background 0.3s", display: "inline-block" }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
