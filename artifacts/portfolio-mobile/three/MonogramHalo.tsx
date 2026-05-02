import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "./Canvas";

interface Props {
  accent?: string;
}

export default function MonogramHalo({ accent = "#0690d4" }: Props) {
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((_state: unknown, delta: number) => {
    if (ring.current) ring.current.rotation.z += delta * 0.4;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.25;
    if (core.current) {
      core.current.rotation.y += delta * 0.5;
      core.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={ring}>
        <torusGeometry args={[2.6, 0.04, 16, 100]} />
        <meshBasicMaterial color={accent} transparent opacity={0.7} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.025, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={accent}
          metalness={0.6}
          roughness={0.2}
          emissive={accent}
          emissiveIntensity={0.6}
          flatShading
        />
      </mesh>
    </group>
  );
}
