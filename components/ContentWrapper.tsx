"use client";

import { useEffect, useRef, ReactNode } from "react";

const SPEED       = 4.5;  // border-px per scroll-px
const TRAIL_LEN   = 0.10; // fraction of perimeter

export default function ContentWrapper({ children }: { children: ReactNode }) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const svgRef   = useRef<SVGSVGElement>(null);
  const rectRef  = useRef<SVGRectElement>(null);
  const glowRef  = useRef<SVGRectElement>(null);
  const gradRef  = useRef<SVGLinearGradientElement>(null);
  const glowGRef = useRef<SVGLinearGradientElement>(null);
  const radiusRef = useRef(0);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const svg   = svgRef.current;
    const rect  = rectRef.current;
    const glow  = glowRef.current;
    const grad  = gradRef.current;
    const glowG = glowGRef.current;
    if (!wrap || !svg || !rect || !glow || !grad || !glowG) return;

    // ── Perimeter of rounded rect ──────────────────────────────────────
    const getPerim = (W: number, H: number, r: number) =>
      2 * (W - 2 * r) + 2 * (H - 2 * r) + 2 * Math.PI * r;

    // ── Convert distance along clockwise path → (x, y) ─────────────────
    // Simplified: ignores corner-arc geometry (radii are small vs dimensions)
    const perimToXY = (d: number, W: number, H: number, perim: number): [number, number] => {
      d = ((d % perim) + perim) % perim;
      if (d <= W)       return [d, 0];         // top   →
      d -= W;
      if (d <= H)       return [W, d];          // right ↓
      d -= H;
      if (d <= W)       return [W - d, H];      // bottom ←
      d -= W;
      return [0, H - d];                        // left  ↑
    };

    // ── Resize SVG ─────────────────────────────────────────────────────
    const resize = () => {
      const W = wrap.offsetWidth;
      const H = wrap.offsetHeight;
      svg.setAttribute("width",   String(W));
      svg.setAttribute("height",  String(H));
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      [rect, glow].forEach((r) => {
        r.setAttribute("width",  String(W));
        r.setAttribute("height", String(H));
      });
    };

    // ── RAF loop ───────────────────────────────────────────────────────
    let lerpedScroll = 0;
    let rafId = 0;

    const animate = () => {
      const scrollY = window.scrollY;
      lerpedScroll += (scrollY - lerpedScroll) * 0.1;

      // Scale + radius
      const vh     = window.innerHeight;
      const range  = vh * 0.35;
      const p      = Math.max(0, Math.min(1, scrollY / range));
      const scale  = 1 - p * 0.12;
      const radius = p * 28;
      radiusRef.current = radius;

      wrap.style.transform = `scale(${scale})`;
      wrap.style.clipPath  = radius > 0
        ? `inset(0 0 0 0 round ${radius}px)` : "none";

      [rect, glow].forEach((r) => {
        r.setAttribute("rx", String(radius));
        r.setAttribute("ry", String(radius));
      });

      // ── Trail ─────────────────────────────────────────────────────
      const W = wrap.offsetWidth;
      const H = wrap.offsetHeight;
      const perim     = getPerim(W, H, radius);
      const trailLen  = perim * TRAIL_LEN;
      const travel    = lerpedScroll * SPEED;

      // Tail position = W+H (bottom-right corner) + travel, going clockwise
      const tailDist = (W + H) + travel;
      const headDist = tailDist + trailLen;

      // stroke-dashoffset = tailDist so the visible dash starts at tailDist
      rect.setAttribute("stroke-dasharray",  `${trailLen} ${perim - trailLen}`);
      rect.setAttribute("stroke-dashoffset", String(-tailDist));

      glow.setAttribute("stroke-dasharray",  `${trailLen * 1.2} ${perim - trailLen * 1.2}`);
      glow.setAttribute("stroke-dashoffset", String(-tailDist));

      // ── Gradient direction: tail → head ────────────────────────────
      const [tx, ty] = perimToXY(tailDist, W, H, perim);
      const [hx, hy] = perimToXY(headDist, W, H, perim);

      [grad, glowG].forEach((g) => {
        g.setAttribute("x1", String(tx));
        g.setAttribute("y1", String(ty));
        g.setAttribute("x2", String(hx));
        g.setAttribute("y2", String(hy));
      });

      rafId = requestAnimationFrame(animate);
    };

    resize();
    rafId = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position:        "relative",
        zIndex:          1,
        transformOrigin: "top center",
        willChange:      "transform, clip-path",
      }}
    >
      <svg
        ref={svgRef}
        style={{
          position: "absolute", top: 0, left: 0,
          pointerEvents: "none", zIndex: 50, overflow: "visible",
        }}
        width="0" height="0"
      >
        <defs>
          {/* Main gradient: transparent → orange → pink → purple → blue */}
          {/* Brand gradient: transparent → cream → red */}
          <linearGradient
            ref={gradRef} id="trailGrad"
            x1="0" y1="0" x2="1" y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#EDE8DF" stopOpacity="0" />
            <stop offset="40%"  stopColor="#EDE8DF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E8341E" stopOpacity="1" />
          </linearGradient>

          {/* Glow: red bloom */}
          <linearGradient
            ref={glowGRef} id="glowGrad"
            x1="0" y1="0" x2="1" y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#E8341E" stopOpacity="0" />
            <stop offset="100%" stopColor="#E8341E" stopOpacity="0.2" />
          </linearGradient>

          <filter id="glow-f" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow layer — wide, faint */}
        <rect
          ref={glowRef}
          x={0} y={0} width={0} height={0} rx={0} ry={0}
          fill="none"
          stroke="url(#glowGrad)"
          strokeWidth={18}
          strokeLinecap="round"
        />

        {/* Main trail */}
        <rect
          ref={rectRef}
          x={0} y={0} width={0} height={0} rx={0} ry={0}
          fill="none"
          stroke="url(#trailGrad)"
          strokeWidth={5}
          strokeLinecap="round"
          filter="url(#glow-f)"
        />
      </svg>

      {children}
    </div>
  );
}
