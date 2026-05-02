import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as THREE from "three";
import { useFrame } from "./Canvas";
import type { Project } from "@/constants/data";

function useImageTexture(uri?: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!uri || Platform.OS === "web") return;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      uri,
      (t) => {
        if (!cancelled) setTex(t);
      },
      undefined,
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [uri]);
  return tex;
}

interface OrbitingCardsProps {
  projects: Project[];
  radius?: number;
  speed?: number;
  onSelect: (index: number) => void;
}

export default function OrbitingCards({
  projects,
  radius = 4.2,
  speed = 0.18,
  onSelect,
}: OrbitingCardsProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((_state: unknown, delta: number) => {
    if (group.current) {
      group.current.rotation.y += delta * speed;
    }
  });

  return (
    <group ref={group}>
      {projects.map((p, i) => {
        const angle = (i / projects.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.6;
        return (
          <Card
            key={p.title}
            position={[x, y, z]}
            rotationY={-angle + Math.PI / 2}
            color={p.color ?? "#0690d4"}
            image={p.image}
            onPress={() => onSelect(i)}
          />
        );
      })}
    </group>
  );
}

interface CardProps {
  position: [number, number, number];
  rotationY: number;
  color: string;
  image?: string;
  onPress: () => void;
}

function Card({ position, rotationY, color, image, onPress }: CardProps) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useImageTexture(image);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(performance.now() / 1300 + position[0]) * 0.08;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh
        ref={ref}
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          onPress();
        }}
      >
        <planeGeometry args={[1.4, 2]} />
        {tex ? (
          <meshStandardMaterial
            map={tex}
            metalness={0.1}
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            metalness={0.3}
            roughness={0.4}
            emissive={color}
            emissiveIntensity={0.45}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>
      <mesh position={[0, -0.85, 0.01]}>
        <planeGeometry args={[1.2, 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}
