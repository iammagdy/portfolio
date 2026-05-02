import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

export const useScrollNear = (threshold: number): boolean => {
  const data = useScroll();
  const [near, setNear] = useState(false);
  const stickyRef = useRef(false);

  useFrame(() => {
    if (stickyRef.current) return;
    if (data.offset >= threshold) {
      stickyRef.current = true;
      setNear(true);
    }
  });

  return near;
};
