"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, useTexture } from "@react-three/drei";
import * as THREE from "three";

function MatcapMaterial() {
  const texture = useTexture("/matcap.jpeg");
  return <meshMatcapMaterial matcap={texture} />;
}

const COUNT  = 8;
const RADIUS = 1.8;

function CoinsMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const coinRefs = useRef<THREE.Group[]>([]);
  const scrollY  = useRef(0);
  const { invalidate } = useThree();

  useEffect(() => {
    const fn = () => { scrollY.current = window.scrollY; invalidate(); };
    window.addEventListener("scroll", fn, { passive: true });
    scrollY.current = window.scrollY;
    return () => window.removeEventListener("scroll", fn);
  }, [invalidate]);

  useFrame(() => {
    const b = scrollY.current * 0.003;
    if (groupRef.current) groupRef.current.rotation.z = -b;
    coinRefs.current.forEach((g, i) => {
      if (!g) return;
      const phase = (i / COUNT) * Math.PI * 2;
      g.rotation.x = b + phase;
      g.rotation.y = b + phase;
      g.rotation.z = b + phase;
    });
  });

  return (
    <Center>
      <group scale={0.55} ref={groupRef}>
        {Array.from({ length: COUNT }).map((_, i) => {
          const angle = (i / COUNT) * Math.PI * 2 + Math.PI / COUNT;
          return (
            <group
              key={i}
              rotation={[0, 0, angle]}
              position={[
                Math.cos(angle) * RADIUS,
                Math.sin(angle) * RADIUS,
                0,
              ]}
            >
              <group
                ref={(el) => { if (el) coinRefs.current[i] = el; }}
                rotation={[0, Math.PI / COUNT, Math.PI / 2]}
              >
                <mesh>
                  <cylinderGeometry args={[1, 1, 0.1, 64]} />
                  <MatcapMaterial />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
    </Center>
  );
}

export default function CoinsScene() {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1.5]}
    >
      <CoinsMesh />
    </Canvas>
  );
}
