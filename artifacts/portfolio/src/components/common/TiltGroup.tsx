import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { useTiltStore } from "@stores";

const PARALLAX_X = 0.45;
const PARALLAX_Y = 0.3;
const DAMP_LAMBDA = 4;

const TiltGroup = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null);
  const tiltX = useTiltStore((s) => s.tiltX);
  const tiltY = useTiltStore((s) => s.tiltY);
  const isListening = useTiltStore((s) => s.isListening);
  const { size } = useThree();

  useFrame((_, delta) => {
    if (!ref.current) return;
    const isMobile = size.width < 768;
    const enabled = isMobile && isListening;
    const targetX = enabled ? -tiltX * PARALLAX_X : 0;
    const targetY = enabled ? -tiltY * PARALLAX_Y : 0;
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, targetX, DAMP_LAMBDA, delta);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, DAMP_LAMBDA, delta);
  });

  return <group ref={ref}>{children}</group>;
};

export default TiltGroup;
