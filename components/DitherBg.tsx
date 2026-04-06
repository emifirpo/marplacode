"use client";

import { useEffect, useRef } from "react";

export default function DitherBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  // ── Scroll-fade: disappears as hero scrolls away ─────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const BASE_OPACITY = 0.45;
    const onScroll = () => {
      const t = Math.min(1, Math.max(0, (window.scrollY / window.innerHeight - 0.2) / 0.6));
      container.style.opacity = String(BASE_OPACITY * (1 - t));
    };
    const timer = setTimeout(() => {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }, 1500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ── Canvas dither pattern ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Ring = { x: number; y: number; r: number; alpha: number };
    const rings: Ring[] = [];
    let w = 0, h = 0, raf: number;

    const resize = () => {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Static ordered dither matrix noise
    const GRID = 6;
    const drawDots = () => {
      ctx.clearRect(0, 0, w, h);
      // Draw static dot grid
      const cols = Math.ceil(w / GRID) + 1;
      const rows = Math.ceil(h / GRID) + 1;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Bayer-style threshold
          const bayer = ((((col ^ row) * 0x5d) + (row * 0x4b)) & 0xff) / 255;
          if (bayer > 0.82) {
            ctx.beginPath();
            ctx.arc(col * GRID, row * GRID, 0.7, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(237,232,223,0.4)";
            ctx.fill();
          }
        }
      }
      // Draw rings from clicks
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r     += 4;
        ring.alpha -= 0.022;
        if (ring.alpha <= 0) { rings.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232,52,30,${ring.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      drawDots();
    };
    tick();

    const handlePointer = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 0.6) return;
      const rect = canvas.getBoundingClientRect();
      rings.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 0,
        alpha: 0.7,
      });
    };
    window.addEventListener("click", handlePointer);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("click", handlePointer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.45,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
