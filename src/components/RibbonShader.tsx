"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

import { createRibbonMaterial } from "@/shaders/ribbonMaterial";

function RibbonPlane({ formation }: { formation: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => createRibbonMaterial(), []);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 0.45, 300, 20);

    const positions = geo.attributes.position as THREE.BufferAttribute;

    const halfWidth = 12 / 2;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      if (Math.abs(x) > halfWidth * 0.95) {
        positions.setY(i, y * 0.02);
        continue;
      }

      const normalized = Math.abs(x) / halfWidth;

      let taper = Math.pow(Math.cos(normalized * Math.PI * 0.5), 0.8);

      //   if (normalized > 0.92) {
      //     const t = (normalized - 0.92) / 0.08;

      //     taper *= Math.pow(1 - t, 2.5);
      //   }

      positions.setY(i, y * taper);
    }

    geo.userData.original = Float32Array.from(geo.attributes.position.array);

    return geo;
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;

    if (!mesh) return;

    const position = mesh.geometry.attributes.position as THREE.BufferAttribute;

    const original = mesh.geometry.userData.original as Float32Array;

    const time = clock.getElapsedTime();

    material.uniforms.uTime.value = time;
    material.uniforms.uFormation.value = formation;

    for (let i = 0; i < position.count; i++) {
      const x = original[i * 3];

      const y = original[i * 3 + 1];

      const wave =
        Math.sin(x * 0.3 + time * 0.18) * 0.42 +
        Math.sin(x * 0.4 - time * 0.35) * 0.08 +
        Math.sin(x * 1.2 + time * 0.4) * 0.015;

      position.setY(i, y + wave);
    }

    position.needsUpdate = true;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, -0.3, 0]}
      material={material}
    />
  );
}

export default function RibbonShader({ formation }: { formation: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 6.6],
          fov: 45,
        }}
      >
        <RibbonPlane formation={formation} />
      </Canvas>
    </div>
  );
}
