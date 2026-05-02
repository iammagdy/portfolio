import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "./Canvas";

interface Props {
  accent?: string;
  base?: string;
}

export default function FloatingFrame({ accent = "#0690d4", base = "#ededed" }: Props) {
  const group = useRef<THREE.Group>(null);
  const pane = useRef<THREE.Mesh>(null);
  const handle = useRef<THREE.Mesh>(null);

  useFrame((_state: unknown, delta: number) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.position.y = Math.sin(performance.now() / 1400) * 0.18;
    }
    if (pane.current) {
      pane.current.rotation.y = Math.sin(performance.now() / 900) * 0.6;
    }
    if (handle.current) {
      handle.current.rotation.z += delta * 0.6;
    }
  });

  const frameMat = (
    <meshStandardMaterial color={base} metalness={0.4} roughness={0.35} />
  );
  const accentMat = (
    <meshStandardMaterial
      color={accent}
      metalness={0.2}
      roughness={0.2}
      emissive={accent}
      emissiveIntensity={0.4}
    />
  );

  const W = 2.4;
  const H = 3;
  const T = 0.12;

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, T, T]} />
        {frameMat}
      </mesh>
      <mesh position={[0, -H / 2, 0]}>
        <boxGeometry args={[W, T, T]} />
        {frameMat}
      </mesh>
      <mesh position={[-W / 2, 0, 0]}>
        <boxGeometry args={[T, H, T]} />
        {frameMat}
      </mesh>
      <mesh position={[W / 2, 0, 0]}>
        <boxGeometry args={[T, H, T]} />
        {frameMat}
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[T, H, T]} />
        {frameMat}
      </mesh>

      <mesh ref={pane} position={[W / 4, 0, 0.02]}>
        <planeGeometry args={[W / 2 - 0.1, H - 0.2]} />
        <meshPhysicalMaterial
          color={accent}
          metalness={0.1}
          roughness={0.05}
          transmission={0.6}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={handle} position={[W / 2 - 0.15, 0, 0.1]}>
        <torusGeometry args={[0.12, 0.035, 12, 24]} />
        {accentMat}
      </mesh>
    </group>
  );
}
