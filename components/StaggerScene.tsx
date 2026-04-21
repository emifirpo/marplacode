"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";

function StaggerMaterial() {
  const texture = useTexture("/matcap.jpeg");
  return <meshMatcapMaterial matcap={texture} />;
}

function StaggerMesh() {
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const scrollY  = useRef(0);
  const { invalidate } = useThree();

  useEffect(() => {
    const fn = () => { scrollY.current = window.scrollY; invalidate(); };
    window.addEventListener("scroll", fn, { passive: true });
    scrollY.current = window.scrollY;
    return () => window.removeEventListener("scroll", fn);
  }, [invalidate]);

  useFrame(() => {
    const base = scrollY.current * 0.005;
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.y = base - i * 0.22;
    });
  });

  return (
    <Center scale={1.8} rotation={[Math.PI / 10, Math.PI / 4, 0]}>
      {Array.from({ length: 5 }).map((_, index) => (
        <RoundedBox
          key={index}
          ref={(el) => { if (el) meshRefs.current[index] = el; }}
          args={[1, 0.1, 1]}
          radius={0.02}
          position={[0, (index - 2) * 0.14, 0]}
        >
          <StaggerMaterial />
        </RoundedBox>
      ))}
    </Center>
  );
}

export default function StaggerScene() {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1.5]}
    >
      <StaggerMesh />
    </Canvas>
  );
}
