"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CursorTrail from "./CursorTrail";
import DitherBg from "./DitherBg";
import WavyLines from "./WavyLines";

gsap.registerPlugin(ScrollTrigger);

const BRAND      = "Marplacode";
const TAGLINE    = "Convertimos ideas en productos que escalan.";
const DESCRIPTOR = "Partner estratégico para founders y equipos que construyen con criterio.";

export default function Hero() {
  const sectionRef    = useRef<HTMLElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLHeadingElement>(null);
  const taglineRef    = useRef<HTMLParagraphElement>(null);
  const descRef       = useRef<HTMLParagraphElement>(null);
  const brandCharRefs = useRef<(HTMLElement | null)[]>([]);
  const brandOffsets  = useRef<{ x: number; y: number }[]>([]);

  // ── Fit title to full container width ────────────────────────────────────
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fit = () => {
      const container = containerRef.current;
      const measure   = measureRef.current;
      const title     = titleRef.current;
      if (!container || !measure || !title) return;

      // Set base size on the h1, measure the inner span (always content-width)
      title.style.fontSize = "200px";
      void measure.offsetWidth; // force reflow
      const containerW = container.offsetWidth;
      const textW      = measure.offsetWidth;
      if (!textW) return;
      title.style.fontSize = `${(containerW / textW) * 200 * 0.985}px`;
    };

    // Run immediately, after fonts, and again after 600ms as safety net
    fit();
    document.fonts.ready.then(() => {
      requestAnimationFrame(fit);
      setTimeout(fit, 600);
    });

    const ro = new ResizeObserver(() => requestAnimationFrame(fit));
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Pre-compute scatter offsets ───────────────────────────────────────────
  useEffect(() => {
    brandOffsets.current = Array.from({ length: BRAND.length }, () => ({
      x: gsap.utils.random(-70, 70),
      y: gsap.utils.random(-70, 70),
    }));
  }, []);

  // ── Entry: Demo10 random scatter → rest ──────────────────────────────────
  useEffect(() => {
    const chars = brandCharRefs.current.filter(Boolean) as HTMLElement[];
    const tl    = gsap.timeline({ delay: 0.15 });

    tl.fromTo(
      chars,
      {
        opacity:  0,
        xPercent: (i) => brandOffsets.current[i]?.x ?? 0,
        yPercent: (i) => brandOffsets.current[i]?.y ?? 0,
      },
      {
        opacity:  1,
        xPercent: 0,
        yPercent: 0,
        duration: 0.7,
        ease:     "power4",
        stagger:  { each: 0.028, from: "random" },
      }
    );

    if (taglineRef.current) {
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3" },
        0.35
      );
    }
    if (descRef.current) {
      tl.fromTo(
        descRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3" },
        0.45
      );
    }
  }, []);

  // ── Exit: scroll-driven Demo10 scatter out ────────────────────────────────
  useEffect(() => {
    const chars = brandCharRefs.current.filter(Boolean) as HTMLElement[];
    const tl    = gsap.timeline({ paused: true });

    tl.fromTo(
      chars,
      { opacity: 1, xPercent: 0, yPercent: 0 },
      {
        opacity:  0,
        xPercent: (i) => brandOffsets.current[i]?.x ?? 0,
        yPercent: (i) => brandOffsets.current[i]?.y ?? 0,
        duration: 0.3,
        ease:     "power4.in",
        stagger:  { each: 0.03, from: "random" },
      }
    );
    if (taglineRef.current) tl.to(taglineRef.current, { opacity: 0, y: -10, duration: 0.2 }, 0);
    if (descRef.current)    tl.to(descRef.current,    { opacity: 0, y: -10, duration: 0.2 }, 0);

    // Delay setup until fonts+fit are done so titleRef has the real size
    const setup = () => {
      const title = titleRef.current;
      if (!title) return;

      const heroH       = window.innerHeight;
      // Bottom edge of the title in viewport coords (hero is sticky at top:0)
      const titleBottom = title.getBoundingClientRect().bottom;
      // scrollY at which the rising content section first touches the title bottom
      const animStart   = heroH - titleBottom;
      // scroll distance to complete the animation (content travels from title-bottom to title-top)
      const animRange   = titleBottom;

      ScrollTrigger.create({
        trigger:  document.body,
        start:    "top top",
        end:      `+=${heroH}`,
        scrub:    true,
        onUpdate: (self) => {
          const scrolled = self.progress * heroH;
          const p = Math.max(0, Math.min(1, (scrolled - animStart) / animRange));
          tl.progress(p);
        },
      });
    };

    document.fonts.ready.then(() => requestAnimationFrame(setup));

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background:     "#0D0D0D",
        minHeight:      "100svh",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "space-between",
        position:       "relative",
        overflow:       "hidden",
      }}
    >
      <DitherBg />
      <WavyLines />
      <CursorTrail />

      {/* ── Giant full-width title ──────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ width: "100%", position: "relative", zIndex: 10 }}
      >
        <h1
          ref={titleRef}
          style={{
            fontFamily:    "'Tilt Warp', sans-serif",
            fontWeight:    800,
            color:         "#EDE8DF",
            lineHeight:    0.86,
            letterSpacing: "-0.07em",
            whiteSpace:    "nowrap",
            userSelect:    "none",
            margin:        0,
            padding:       0,
          }}
        >
          {/* inner span: display inline-block so offsetWidth = text content width */}
          <span ref={measureRef} style={{ display: "inline-block" }}>
            {BRAND.split("").map((ch, ci) => (
              <span
                key={ci}
                ref={(el) => { brandCharRefs.current[ci] = el; }}
                style={{ display: "inline-block", willChange: "transform, opacity" }}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>
      </div>

      {/* ── Bottom row ─────────────────────────────────────────────────── */}
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
        <p
          ref={taglineRef}
          style={{
            fontFamily:    "'Tilt Warp', sans-serif",
            fontSize:      "clamp(0.95rem, 1.8vw, 1.4rem)",
            color:         "#EDE8DF",
            fontWeight:    600,
            letterSpacing: "-0.015em",
            lineHeight:    1.2,
            maxWidth:      "clamp(240px, 38vw, 520px)",
            opacity:       0,
            margin:        0,
          }}
        >
          {TAGLINE}
        </p>

        <p
          ref={descRef}
          style={{
            fontFamily:    "'Tilt Warp', sans-serif",
            fontSize:      "clamp(0.6rem, 0.85vw, 0.8rem)",
            color:         "rgba(237,232,223,0.4)",
            fontWeight:    400,
            textAlign:     "right",
            maxWidth:      "clamp(160px, 18vw, 240px)",
            lineHeight:    1.55,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            opacity:       0,
            margin:        0,
          }}
        >
          {DESCRIPTOR}
        </p>
      </div>
    </section>
  );
}
