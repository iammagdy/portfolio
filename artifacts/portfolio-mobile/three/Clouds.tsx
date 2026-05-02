import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "./Canvas";

interface Props {
  count?: number;
  color?: string;
}

export default function Clouds({ count = 6, color = "#ffffff" }: Props) {
  const group = useRef<THREE.Group>(null);

  const puffs = useMemo(() => {
    const list: { pos: [number, number, number]; scale: number; speed: number }[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        pos: [
          (Math.random() - 0.5) * 18,
          -3 - Math.random() * 8,
          -4 - Math.random() * 12,
        ],
        scale: 1.2 + Math.random() * 2.4,
        speed: 0.05 + Math.random() * 0.1,
      });
    }
    return list;
  }, [count]);

  useFrame((_state: unknown, delta: number) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.position.x += puffs[i].speed * delta;
      if (child.position.x > 12) child.position.x = -12;
    });
  });

  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.06}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
