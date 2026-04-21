"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, useTexture } from "@react-three/drei";
import * as THREE from "three";

function MatcapMaterial() {
  const texture = useTexture("/matcap.jpeg");
  return <meshMatcapMaterial matcap={texture} />;
}

function CoreMesh() {
  const ring1   = useRef<THREE.Mesh>(null);
  const ring2   = useRef<THREE.Mesh>(null);
  const group   = useRef<THREE.Group>(null);
  const scrollY = useRef(0);
  const { invalidate } = useThree();

  useEffect(() => {
    const fn = () => { scrollY.current = window.scrollY; invalidate(); };
    window.addEventListener("scroll", fn, { passive: true });
    scrollY.current = window.scrollY;
    return () => window.removeEventListener("scroll", fn);
  }, [invalidate]);

  useFrame(() => {
    const b = scrollY.current * 0.004;
    if (ring1.current) { ring1.current.rotation.z = b;  ring1.current.rotation.x = b;  }
    if (ring2.current) { ring2.current.rotation.z = -b; ring2.current.rotation.x = -b; }
    if (group.current) { group.current.rotation.y = b * 0.5; }
  });

  return (
    <Center ref={group}>
      <mesh ref={ring1}>
        <torusGeometry args={[2.1, 0.09, 16, 80]} />
        <MatcapMaterial />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.09, 16, 80]} />
        <MatcapMaterial />
      </mesh>
      <group scale={0.75}>
        <mesh position={[0, 1, 0]}>
          <coneGeometry args={[1, 1.41, 4]} />
          <MatcapMaterial />
        </mesh>
        <mesh position={[0, -1, 0]} rotation={[-Math.PI, 0, 0]}>
          <coneGeometry args={[1, 1.41, 4]} />
          <MatcapMaterial />
        </mesh>
      </group>
    </Center>
  );
}

export default function CoreScene() {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 7], fov: 42 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1.5]}
    >
      <CoreMesh />
    </Canvas>
  );
}
