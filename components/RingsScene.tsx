"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, useTexture } from "@react-three/drei";
import * as THREE from "three";

function MatcapMaterial() {
  const texture = useTexture("/matcap.jpeg");
  return <meshMatcapMaterial matcap={texture} />;
}

function RingsMesh() {
  const refs    = useRef<THREE.Mesh[]>([]);
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
    const configs = [
      { y:  b,       x:  b * 0.7  },
      { y: -b * 0.8, x:  b * 0.5  },
      { y:  b * 1.2, x: -b * 0.6  },
      { y: -b * 0.6, x:  b * 0.9  },
    ];
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.y = configs[i].y;
      m.rotation.x = configs[i].x;
    });
  });

  return (
    <Center>
      {[2.2, 1.6, 1.0, 0.5].map((r, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el; }}>
          <torusGeometry args={[r, 0.09, 16, 80]} />
          <MatcapMaterial />
        </mesh>
      ))}
    </Center>
  );
}

export default function RingsScene() {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1.5]}
    >
      <RingsMesh />
    </Canvas>
  );
}
