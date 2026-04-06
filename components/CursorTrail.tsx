"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  // ── Scroll-fade: disappears as hero scrolls away ─────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      const t = Math.min(1, Math.max(0, (window.scrollY / window.innerHeight - 0.15) / 0.55));
      container.style.opacity = String(1 - t);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Trail canvas ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Dot = { x: number; y: number; r: number; alpha: number };
    const dots: Dot[] = [];
    let mx = -999, my = -999;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dots.push({ x: mx, y: my, r: 3 + Math.random() * 3, alpha: 0.55 });
      if (dots.length > 80) dots.shift();
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.alpha -= 0.018;
        d.r     -= 0.04;
        if (d.alpha <= 0 || d.r <= 0) { dots.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 52, 30, ${d.alpha})`;
        ctx.fill();
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
