"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Shaders verbatim from rock-biter/cursor-trail ────────────────────────────

const trailVertex = /* glsl */ `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const trailFragment = /* glsl */ `
uniform vec2 uResolution;
uniform sampler2D uMap;
uniform vec2 uPointer;
uniform float uDt;
uniform float uSpeed;
uniform float uTime;

vec4 permute(vec4 x){return mod(x*x*34.+x,289.);}
float snoise(vec3 v){
  const vec2 C = 1./vec2(6,3);
  const vec4 D = vec4(0,.5,1,2);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1. - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.x;
  vec3 x2 = x0 - i2 + C.y;
  vec3 x3 = x0 - D.yyy;
  i = mod(i,289.);
  vec4 p = permute( permute( permute(
    i.z + vec4(0., i1.z, i2.z, 1.))
  + i.y + vec4(0., i1.y, i2.y, 1.))
  + i.x + vec4(0., i1.x, i2.x, 1.));
  vec3 ns = .142857142857 * D.wyz - D.xzx;
  vec4 j = p - 49. * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = floor(j - 7. * x_ ) *ns.x + ns.yyyy;
  vec4 h = 1. - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 sh = -step(h, vec4(0));
  vec4 a0 = b0.xzyw + (floor(b0)*2.+ 1.).xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + (floor(b1)*2.+ 1.).xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.);
  return .5 + 12. * dot( m * m * m, vec4( dot(p0,x0), dot(p1,x1),dot(p2,x2), dot(p3,x3) ) );
}
vec3 snoiseVec3( vec3 x ){
  return vec3( snoise(vec3( x )*2.-1.),
               snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ))*2.-1.,
               snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 )*2.-1.) );
}
vec3 curlNoise( vec3 p ){
  const float e = .1;
  vec3 dx = vec3( e, 0., 0. );
  vec3 dy = vec3( 0., e, 0. );
  vec3 dz = vec3( 0., 0., e );
  vec3 p_x0 = snoiseVec3( p - dx ); vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy ); vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz ); vec3 p_z1 = snoiseVec3( p + dz );
  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec2 uv2 = uv + curlNoise(vec3(uv * 4. + uTime * 0.1, uTime * 0.1)).xy * uDt * 0.3;
  uv += curlNoise(vec3(uv * 2. + uTime * 0.1, uTime * 0.1)).xy * uDt * 0.15;

  vec3 mapColor  = texture2D(uMap, uv).rgb;
  vec3 mapColor2 = texture2D(uMap, uv2).rgb;

  uv -= 0.5;
  uv *= 2.0;
  uv.x *= uResolution.x / uResolution.y;
  vec2 pointer = uPointer;
  pointer.x *= uResolution.x / uResolution.y;

  float d = distance(uv, pointer);

  vec3 color = mix(mapColor, mapColor2, 0.5);
  color *= 1. - uDt * 2.;
  float speed = clamp(uSpeed * 2., 0.075, 0.25);
  float t  = smoothstep(speed, 0., d);
  float t2 = smoothstep(speed, 0., d);
  float t3 = smoothstep(speed, 0., d);
  t2 = pow(t2, 10.);
  t3 = pow(t3, 4.);
  float scale = speed * 5.;
  t *= scale; t2 *= scale; t3 *= scale;

  color = mix(color, vec3(0.25, 0.1, 0.9), t);
  color = mix(color, vec3(0.1,  0.9, 0.8), t3);
  color = mix(color, vec3(1.0),             t2);
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

const bgVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const bgFragment = /* glsl */ `
uniform sampler2D uTrailMap;
varying vec2 vUv;
void main() {
  vec3 color = texture2D(uTrailMap, vUv).rgb;
  gl_FragColor = vec4(color, 1.0);
}
`;

// ─── Fullscreen triangle geometry ─────────────────────────────────────────────
function makeTriangle() {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(
    new Float32Array([-1, -1, 0,  3, -1, 0,  -1, 3, 0]), 3
  ));
  geo.setAttribute("uv", new THREE.BufferAttribute(
    new Float32Array([0, 0,  2, 0,  0, 2]), 2
  ));
  return geo;
}

function createRenderTarget(w: number, h: number) {
  return new THREE.WebGLRenderTarget(w, h, {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  // Scroll fade — hero only
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const t = Math.min(1, Math.max(0, (window.scrollY / window.innerHeight - 0.15) / 0.55));
      el.style.opacity = String(1 - t);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Three.js trail — verbatim rock-biter logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const sizes = { width: window.innerWidth, height: window.innerHeight };

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: window.devicePixelRatio < 2,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── Camera (passthrough vertex shader ignores projection) ─────────────────
    const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(4, 4, 4);
    camera.lookAt(new THREE.Vector3(0, 2.5, 0));

    // ── Geometry ──────────────────────────────────────────────────────────────
    const triGeo = makeTriangle();

    // ── Render targets ────────────────────────────────────────────────────────
    const rtW = sizes.width  * 0.25;
    const rtH = sizes.height * 0.25;
    let rt1 = createRenderTarget(rtW, rtH);
    let rt2 = createRenderTarget(rtW, rtH);
    let inputRT  = rt1;
    let outputRT = rt2;

    // ── Trail material ────────────────────────────────────────────────────────
    const trailMaterial = new THREE.ShaderMaterial({
      vertexShader:   trailVertex,
      fragmentShader: trailFragment,
      uniforms: {
        uResolution: { value: new THREE.Vector2(rtW, rtH) },
        uMap:        { value: null },
        uPointer:    { value: new THREE.Vector2(0, 0) },
        uDt:         { value: 0 },
        uSpeed:      { value: 0 },
        uTime:       { value: 0 },
      },
    });
    const trailMesh  = new THREE.Mesh(triGeo, trailMaterial);
    const sceneTrail = new THREE.Scene();
    sceneTrail.add(trailMesh);

    // ── Background (display) material ─────────────────────────────────────────
    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader:   bgVertex,
      fragmentShader: bgFragment,
      uniforms: {
        uTrailMap: { value: null },
      },
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(triGeo, bgMaterial);
    bgMesh.renderOrder = -1;
    const scene = new THREE.Scene();
    scene.add(bgMesh);

    // ── Pointer ───────────────────────────────────────────────────────────────
    const pointer = new THREE.Vector2();
    const onPointer = (ev: MouseEvent) => {
      pointer.x =  (ev.clientX / sizes.width)  * 2 - 1;
      pointer.y = -(ev.clientY / sizes.height) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointer);

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      sizes.width  = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const nw = sizes.width * 0.25;
      const nh = sizes.height * 0.25;
      trailMaterial.uniforms.uResolution.value.set(nw, nh);
      rt1.setSize(nw, nh);
      rt2.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // ── Clock & loop ──────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let time = 0;
    let rafId: number;

    const tic = () => {
      rafId = requestAnimationFrame(tic);

      const dt = clock.getDelta();
      time += dt;

      trailMaterial.uniforms.uTime.value = time;
      const prevPointer = trailMaterial.uniforms.uPointer.value as THREE.Vector2;

      trailMaterial.uniforms.uSpeed.value = THREE.MathUtils.lerp(
        trailMaterial.uniforms.uSpeed.value,
        Math.sqrt((pointer.x - prevPointer.x) ** 2 + (pointer.y - prevPointer.y) ** 2),
        dt * 3
      );

      (trailMaterial.uniforms.uPointer.value as THREE.Vector2).lerp(pointer, dt * 15);
      trailMaterial.uniforms.uDt.value = dt;

      // Trail pass → outputRT
      trailMaterial.uniforms.uMap.value = inputRT.texture;
      renderer.setRenderTarget(outputRT);
      renderer.render(sceneTrail, camera);

      // Display pass → screen
      renderer.setRenderTarget(null);
      bgMaterial.uniforms.uTrailMap.value = outputRT.texture;
      renderer.render(scene, camera);

      // Swap ping-pong
      const tmp = inputRT;
      inputRT  = outputRT;
      outputRT = tmp;
    };
    tic();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      rt1.dispose();
      rt2.dispose();
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
        mixBlendMode: "screen",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
