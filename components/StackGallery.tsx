"use client";
import { useEffect, useRef } from "react";

// 9 cards — dark gradient backgrounds with colored accents, matching Marplacode's palette
const CARDS = [
  { bg: "linear-gradient(135deg, #1a0033 0%, #111 100%)", accent: "#c471e1" },
  { bg: "linear-gradient(135deg, #001a33 0%, #111 100%)", accent: "#71c4e1" },
  { bg: "linear-gradient(135deg, #1a1100 0%, #111 100%)", accent: "#e1c471" },
  { bg: "linear-gradient(135deg, #001a1a 0%, #111 100%)", accent: "#71e1c4" },
  { bg: "linear-gradient(135deg, #1a0011 0%, #111 100%)", accent: "#e17191" },
  { bg: "linear-gradient(135deg, #110033 0%, #111 100%)", accent: "#9171e1" },
  { bg: "linear-gradient(135deg, #001100 0%, #111 100%)", accent: "#71e171" },
  { bg: "linear-gradient(135deg, #330011 0%, #111 100%)", accent: "#e171a0" },
  { bg: "linear-gradient(135deg, #001133 0%, #111 100%)", accent: "#71a0e1" },
];

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function StackGallery() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const content = contentRef.current;
    if (!wrap || !content) return;

    // Initial tilted-deck state, matches effect-1 from 3DStackMotion
    content.style.transform =
      "rotate3d(1, 0, 0, -25deg) rotate3d(0, 1, 0, 50deg) rotate3d(0, 0, 1, 25deg)";
    content.style.opacity = "0";

    // Cache absolute top position (relative to document)
    let wrapTop = 0;
    const updateWrapTop = () => {
      wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
    };
    updateWrapTop();

    let rafId: number;

    const tick = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      const scrollStart = wrapTop;
      const scrollEnd = wrapTop + wrap.offsetHeight - vh;
      const rawProgress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Match ScrollTrigger's onEnter / onLeave opacity logic
      content.style.opacity = progress > 0 && progress < 1 ? "1" : "0";

      const cards = cardRefs.current;
      const total = cards.length;
      // Slightly larger stagger than original (0.005) to spread 9 cards more visibly
      const stagger = 0.025;
      const totalDuration = 1 + stagger * (total - 1);

      cards.forEach((card, pos) => {
        if (!card) return;

        // Per-card local progress with stagger offset, same model as GSAP stagger in scrub
        const localProgress = Math.max(
          0,
          Math.min(1, progress * totalDuration - pos * stagger)
        );
        const eased = easeInOut(localProgress);

        // z animation: from very far back → through → very far in front
        // Mirrors effect-1: z: (pos) => -2.65*vw - pos*0.03*vw  → 1.4*vw + (total-pos-1)*0.03*vw
        const zStart = -2.65 * vw - pos * 0.03 * vw;
        const zEnd = 1.4 * vw + (total - pos - 1) * 0.03 * vw;
        const z = zStart + (zEnd - zStart) * eased;

        // Rotation: rotationZ from -220 → 120, rotationY → -30
        const rotZ = -220 + 340 * eased;
        const rotY = -30 * eased;

        card.style.transform = `translateZ(${z}px) rotateZ(${rotZ}deg) rotateY(${rotY}deg)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      updateWrapTop();
      tick();
    };

    // Initial render
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    // Outer: tall so the sticky inner has scroll space (350vh → 250vh of scrub range)
    <div ref={wrapRef} style={{ position: "relative", height: "350vh" }}>
      {/* Sticky inner: 100vh, provides perspective for 3D space */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          perspective: "1000px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Content: CSS grid stacks all cards on top of each other via grid-area:'card' */}
        <div
          ref={contentRef}
          style={{
            position: "relative",
            transformStyle: "preserve-3d",
            display: "grid",
            gridTemplateAreas: "'card'",
            gridTemplateColumns: "100%",
            placeItems: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{
                gridArea: "card",
                width: "30vw",
                maxWidth: 255,
                minWidth: 150,
                aspectRatio: "2 / 3",
                borderRadius: 10,
                background: card.bg,
                outline: `1px solid ${card.accent}`,
                willChange: "transform",
                // Subtle noise texture via box-shadow to match Marplacode's dark aesthetic
                boxShadow: `0 2px 24px 0 rgba(0,0,0,0.8), inset 0 0 40px 0 rgba(0,0,0,0.4)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
