"use client";

import { useEffect, useRef, ReactNode } from "react";

const TRAIL_LEN = 0.10;
// RELEASE_P y height están relacionados: height = 100vh / (1 - RELEASE_P) para gap = 0
// Con 0.65 → height = 286vh → gap ≈ 0 y ~86vh de animación sticky
const RELEASE_P  = 0.50;

export default function ContentWrapper({ children }: { children: ReactNode }) {
  const outerRef  = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const svgRef    = useRef<SVGSVGElement>(null);
  const rectRef   = useRef<SVGRectElement>(null);
  const glowRef   = useRef<SVGRectElement>(null);
  const gradRef   = useRef<SVGLinearGradientElement>(null);
  const glowGRef  = useRef<SVGLinearGradientElement>(null);
  const outerTopRef  = useRef(0);
  const releasedRef  = useRef(false);

  useEffect(() => {
    const outer     = outerRef.current;
    const stickyDiv = stickyRef.current;
    const inner     = innerRef.current;
    const svg       = svgRef.current;
    const rect      = rectRef.current;
    const glow      = glowRef.current;
    const grad      = gradRef.current;
    const glowG     = glowGRef.current;
    if (!outer || !stickyDiv || !inner || !svg || !rect || !glow || !grad || !glowG) return;

    const getPerim = (W: number, H: number, r: number) =>
      2 * (W - 2 * r) + 2 * (H - 2 * r) + 2 * Math.PI * r;

    const perimToXY = (d: number, W: number, H: number, perim: number): [number, number] => {
      d = ((d % perim) + perim) % perim;
      if (d <= W)  return [d, 0];
      d -= W;
      if (d <= H)  return [W, d];
      d -= H;
      if (d <= W)  return [W - d, H];
      d -= W;
      return [0, H - d];
    };

    const updateBounds = () => {
      // Cache the outer div's document-top so we can compute localScroll
      outerTopRef.current = outer.getBoundingClientRect().top + window.scrollY;

      const W = inner.offsetWidth;
      const H = inner.offsetHeight;
      svg.setAttribute("width",   String(W));
      svg.setAttribute("height",  String(H));
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      [rect, glow].forEach((r) => {
        r.setAttribute("width",  String(W));
        r.setAttribute("height", String(H));
      });
    };

    let lerpedTrailP = 0;
    let rafId        = 0;

    const animate = () => {
      const scrollY = window.scrollY;
      const vh      = window.innerHeight;

      // ── Phase 1: entry scale ──────────────────────────────────────────
      // Driven by live viewport position — animates while element scrolls up.
      // outerViewportTop: vh → 0 as element enters; stays 0 once pinned.
      const outerViewportTop = outer.getBoundingClientRect().top;
      const entryP = Math.max(0, Math.min(1, (vh - outerViewportTop) / vh));

      const scale  = 1 - entryP * 0.06;
      const radius = entryP * 24;

      inner.style.transform = `scale(${scale})`;
      inner.style.clipPath   = radius > 0.5
        ? `inset(0 0 0 0 round ${radius}px)` : "none";

      [rect, glow].forEach((r) => {
        r.setAttribute("rx", String(radius));
        r.setAttribute("ry", String(radius));
      });

      // ── Phase 2: trail — scene progress, arranca cuando el outer entra al viewport
      // sceneStart: cuando el top del outer toca el bottom del viewport
      // sceneLength: outerH completo (entrada + scroll sticky)
      const outerTop    = outerTopRef.current;
      const outerH      = outer.offsetHeight;
      const sceneStart  = outerTop - vh;
      const rawTrailP   = outerH > 0 ? Math.max(0, Math.min(1, (scrollY - sceneStart) / outerH)) : 0;

      // ── Sticky release: cuando las cards volaron, el container scroll away ─
      if (rawTrailP >= RELEASE_P) {
        if (!releasedRef.current) releasedRef.current = true;
        // Deslizar hacia arriba como fixed — sin tocar dimensiones del outer
        const releaseAt = outerTop - vh + RELEASE_P * outerH;
        const overshoot = Math.max(0, scrollY - releaseAt);
        stickyDiv.style.position = "fixed";
        stickyDiv.style.left     = "0";
        stickyDiv.style.right    = "0";
        stickyDiv.style.top      = `${-overshoot}px`;
      } else if (rawTrailP < RELEASE_P && releasedRef.current) {
        // Al volver para arriba, restaurar sticky
        stickyDiv.style.position = "sticky";
        stickyDiv.style.top      = "0";
        stickyDiv.style.left     = "";
        stickyDiv.style.right    = "";
        releasedRef.current = false;
      }

      lerpedTrailP += (rawTrailP - lerpedTrailP) * 0.1;

      // ── Trail: travels full perimeter as lerpedTrailP goes 0 → 1 ────
      const W     = inner.offsetWidth;
      const H     = inner.offsetHeight;
      const perim = getPerim(W, H, radius);
      const trailLen = perim * TRAIL_LEN;

      const travel   = lerpedTrailP * perim * 1.1;
      const tailDist = (W + H) + travel;
      const headDist = tailDist + trailLen;

      rect.setAttribute("stroke-dasharray",  `${trailLen} ${perim - trailLen}`);
      rect.setAttribute("stroke-dashoffset", String(-tailDist));

      glow.setAttribute("stroke-dasharray",  `${trailLen * 1.2} ${perim - trailLen * 1.2}`);
      glow.setAttribute("stroke-dashoffset", String(-tailDist));

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

    updateBounds();
    rafId = requestAnimationFrame(animate);
    window.addEventListener("resize", updateBounds);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  return (
    // Outer: provides the extra scroll height so the sticky child has room
    <div
      ref={outerRef}
      data-cw-outer=""
      style={{ position: "relative", height: "230vh" }}
    >
      {/* Sticky shell: stays centered in viewport while user scrolls through outer */}
      <div
        ref={stickyRef}
        style={{
          position:       "sticky",
          top:            0,
          height:         "100vh",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        {/* Content + SVG border trail */}
        <div
          ref={innerRef}
          style={{
            position:        "relative",
            width:           "100%",
            transformOrigin: "center center",
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
              <linearGradient
                ref={gradRef} id="trailGrad"
                x1="0" y1="0" x2="1" y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor="#EDE8DF" stopOpacity="0" />
                <stop offset="40%"  stopColor="#EDE8DF" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#E8341E" stopOpacity="1" />
              </linearGradient>

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

            <rect
              ref={glowRef}
              x={0} y={0} width={0} height={0} rx={0} ry={0}
              fill="none"
              stroke="url(#glowGrad)"
              strokeWidth={18}
              strokeLinecap="round"
            />
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
      </div>
    </div>
  );
}
