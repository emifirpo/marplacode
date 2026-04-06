"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Vertex shader (del repo: wave effect + vUv) ──────────────────────────────
const vertexShader = /* glsl */ `
  uniform float uProgress;
  varying vec2 vUv;

  void main() {
    vec3 newPosition = position;

    float distanceToCenter = distance(vec2(0.5), uv);
    float wave = (1.0 - uProgress) * sin(distanceToCenter * 20.0 - uProgress * 5.0);
    newPosition.z += wave * 0.15;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
  }
`;

// ── Fragment shader (del repo: ruido Perlin 3D + dissolve) ───────────────────
// Perlin 3D Noise — Classic, by Stefan Gustavson
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;

  // ── Perlin 3D Noise (Stefan Gustavson) ──
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
    g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
    g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000,n100,n010,n110), vec4(n001,n101,n011,n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }
  // ────────────────────────────────────────────────────────────────────────────

  void main() {
    // UV desplazados con ruido animado (mismo que el repo original)
    vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1));

    // Fuerza del ruido en el punto desplazado
    float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

    // Umbral de reveal: avanza con uProgress (sin gradiente radial → full-section)
    strength = strength + uProgress * 2.8 - 1.4;
    strength = clamp(strength, 0.0, 1.0);

    // Opacidad progresiva (evita pop en los extremos)
    float fade = smoothstep(0.0, 0.5, uProgress) * smoothstep(1.0, 0.85, uProgress);

    // Overlay oscuro: alpha decrece a medida que strength sube con el scroll
    float alpha = (1.0 - strength) * (1.0 - smoothstep(0.85, 1.0, uProgress));

    gl_FragColor = vec4(0.051, 0.051, 0.051, alpha);
  }
`;

export default function CapabilitiesReveal({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas  = canvasRef.current;
    if (!wrapper || !canvas) return;

    // ── Three.js setup ──────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10) as any;
    camera.position.z = 1;

    // Plane that fills the orthographic frustum exactly
    const geometry = new THREE.PlaneGeometry(1, 1) as any;
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:     { value: 0 },
        uProgress: { value: 0 },
      },
      transparent: true,
      depthWrite:  false,
    });
    const mesh = new THREE.Mesh(geometry, material) as any;
    scene.add(mesh);

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      renderer.setSize(w, h);
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      // Scale the plane to match the wrapper aspect ratio
      mesh.scale.set(1, h / w, 1);
      camera.left   = -0.5;
      camera.right  =  0.5;
      camera.top    =  0.5 * (h / w);
      camera.bottom = -0.5 * (h / w);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    // ── Render loop ─────────────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      material.uniforms.uTime.value     = clock.getElapsedTime();
      material.uniforms.uProgress.value = progressRef.current;
      renderer.render(scene, camera);
    };
    tick();

    // ── ScrollTrigger: progress 0 → 1 mientras la sección entra al viewport ─
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top 60%",   // empieza cuando la sección está al 60% desde arriba
      end: "bottom 60%",  // termina cuando el fondo de la sección llega al 60%
      scrub: 1.5,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      st.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {/* Contenido real de la sección */}
      {children}

      {/* Canvas overlay — se disuelve al hacer scroll */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
