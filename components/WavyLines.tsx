"use client";

import { useEffect, useRef } from "react";

// ─── Perlin noise (port of noisejs) ───────────────────────────────────────────
const grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];

class Noise {
  private perm:  Uint8Array;
  private gradP: [number,number,number][];

  constructor(seed: number) {
    this.perm  = new Uint8Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }

  private seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      p[i] = i & 1
        ? (i ^ (seed & 255)) ^ ((seed >> 8) & 255)
        :  i ^ ((seed >> 8) & 255);
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i]  = p[i & 255];
      this.gradP[i] = grad3[this.perm[i] % 12] as [number,number,number];
    }
  }

  private fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  private lerp(a: number, b: number, t: number) { return (1 - t) * a + t * b; }

  perlin2(x: number, y: number): number {
    let X = Math.floor(x); let Y = Math.floor(y);
    x -= X; y -= Y;
    X &= 255; Y &= 255;
    const [g00x,g00y] = this.gradP[X   + this.perm[Y  ]];
    const [g01x,g01y] = this.gradP[X   + this.perm[Y+1]];
    const [g10x,g10y] = this.gradP[X+1 + this.perm[Y  ]];
    const [g11x,g11y] = this.gradP[X+1 + this.perm[Y+1]];
    const n00 = g00x * x       + g00y * y;
    const n01 = g01x * x       + g01y * (y-1);
    const n10 = g10x * (x-1)   + g10y * y;
    const n11 = g11x * (x-1)   + g11y * (y-1);
    const u = this.fade(x);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Point {
  x: number; y: number;
  wave:   { x: number; y: number };
  cursor: { x: number; y: number; vx: number; vy: number };
}
interface Mouse { x:number; y:number; lx:number; ly:number; sx:number; sy:number; v:number; vs:number; a:number; set:boolean; }

interface Props {
  color?: string;
  xGap?:  number;
  yGap?:  number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WavyLines({
  color = "rgba(237,232,223,0.12)",
  xGap  = 10,
  yGap  = 32,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svg       = svgRef.current;
    if (!container || !svg) return;

    const mouse: Mouse = { x:-10, y:0, lx:0, ly:0, sx:0, sy:0, v:0, vs:0, a:0, set:false };
    let lines: Point[][] = [];
    let paths: SVGPathElement[] = [];
    const noise = new Noise(Math.random());
    let bounding = container.getBoundingClientRect();
    let rafId: number;

    // ── helpers ──────────────────────────────────────────────────────────────
    const setSize = () => {
      bounding = container.getBoundingClientRect();
      svg.style.width  = `${bounding.width}px`;
      svg.style.height = `${bounding.height}px`;
    };

    const setLines = () => {
      lines = [];
      paths.forEach(p => p.remove());
      paths = [];

      const { width, height } = bounding;
      const oWidth  = width  + 200;
      const oHeight = height + 30;
      const totalLines  = Math.ceil(oWidth  / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);
      const xStart = (width  - xGap * totalLines)  / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      for (let i = 0; i <= totalLines; i++) {
        const pts: Point[] = [];
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({ x: xStart + xGap * i, y: yStart + yGap * j,
            wave: { x:0, y:0 }, cursor: { x:0, y:0, vx:0, vy:0 } });
        }
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill",         "none");
        path.setAttribute("stroke",       color);
        path.setAttribute("stroke-width", "1");
        svg.appendChild(path);
        paths.push(path);
        lines.push(pts);
      }
    };

    // ── mouse — usa clientX/Y con bounding actualizado para secciones en mitad de página
    const updateMouse = (clientX: number, clientY: number) => {
      bounding = container.getBoundingClientRect(); // refrescar: la sección puede no estar en top:0
      mouse.x = clientX - bounding.left;
      mouse.y = clientY - bounding.top;
      if (!mouse.set) {
        mouse.sx = mouse.x; mouse.sy = mouse.y;
        mouse.lx = mouse.x; mouse.ly = mouse.y;
        mouse.set = true;
      }
    };

    // ── physics + draw ────────────────────────────────────────────────────────
    const movePoints = (time: number) => {
      lines.forEach(pts => {
        pts.forEach(p => {
          const move = noise.perlin2(
            (p.x + time * 0.0125) * 0.002,
            (p.y + time * 0.005)  * 0.0015
          ) * 12;
          p.wave.x = Math.cos(move) * 32;
          p.wave.y = Math.sin(move) * 16;

          const dx = p.x - mouse.sx;
          const dy = p.y - mouse.sy;
          const d  = Math.hypot(dx, dy);
          const l  = Math.max(175, mouse.vs);
          if (d < l) {
            const s = 1 - d / l;
            const f = Math.cos(d * 0.001) * s;
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
          }
          p.cursor.vx += (0 - p.cursor.x) * 0.005;
          p.cursor.vy += (0 - p.cursor.y) * 0.005;
          p.cursor.vx *= 0.925;
          p.cursor.vy *= 0.925;
          p.cursor.x  += p.cursor.vx * 2;
          p.cursor.y  += p.cursor.vy * 2;
          p.cursor.x   = Math.min(100, Math.max(-100, p.cursor.x));
          p.cursor.y   = Math.min(100, Math.max(-100, p.cursor.y));
        });
      });
    };

    const moved = (p: Point, withCursor = true) => ({
      x: Math.round((p.x + p.wave.x + (withCursor ? p.cursor.x : 0)) * 10) / 10,
      y: Math.round((p.y + p.wave.y + (withCursor ? p.cursor.y : 0)) * 10) / 10,
    });

    const drawLines = () => {
      lines.forEach((pts, li) => {
        const start = moved(pts[0], false);
        let d = `M ${start.x} ${start.y}`;
        pts.forEach((pt, pi) => {
          const isLast = pi === pts.length - 1;
          const m = moved(pt, !isLast);
          d += ` L ${m.x} ${m.y}`;
        });
        paths[li].setAttribute("d", d);
      });
    };

    const tick = (time: number) => {
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d  = Math.hypot(dx, dy);
      mouse.v   = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs  = Math.min(100, mouse.vs);
      mouse.lx  = mouse.x;
      mouse.ly  = mouse.y;
      mouse.a   = Math.atan2(dy, dx);
      movePoints(time);
      drawLines();
      rafId = requestAnimationFrame(tick);
    };

    // ── events ────────────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onResize = () => { setSize(); setLines(); };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize",    onResize);
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    setSize();
    setLines();
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize",    onResize);
      container.removeEventListener("touchmove", onTouchMove);
      paths.forEach(p => p.remove());
    };
  }, [color, xGap, yGap]);

  return (
    <div ref={containerRef} style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      <svg ref={svgRef} style={{ display:"block", width:"100%", height:"100%" }} />
    </div>
  );
}
