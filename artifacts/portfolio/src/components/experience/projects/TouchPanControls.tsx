import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export const TouchPanControls = () => {
  const { camera, gl } = useThree();
  const isDraggingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const startRotYRef = useRef(0);
  const targetRotYRef = useRef(0);
  const axisLockedRef = useRef<"horizontal" | "vertical" | null>(null);

  useEffect(() => {
    targetRotYRef.current = camera.rotation.y;
  }, [camera]);

  useFrame(() => {
    if (!camera) return;
    const dampingFactor = 0.12;
    camera.rotation.y += (targetRotYRef.current - camera.rotation.y) * dampingFactor;
  });

  useEffect(() => {
    const target = gl.domElement;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDraggingRef.current = true;
      axisLockedRef.current = null;
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      startRotYRef.current = targetRotYRef.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = touchX - touchStartXRef.current;
      const deltaY = touchY - touchStartYRef.current;

      if (!axisLockedRef.current) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        if (absX < 6 && absY < 6) return;
        axisLockedRef.current = absX >= absY ? "horizontal" : "vertical";
      }

      if (axisLockedRef.current !== "horizontal") return;

      e.preventDefault();

      const sensitivity = 0.006;
      const newRotation = startRotYRef.current + deltaX * sensitivity;
      const maxRotation = Math.PI / 3;
      targetRotYRef.current = Math.min(Math.max(newRotation, -maxRotation), maxRotation);
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      axisLockedRef.current = null;
    };

    target.addEventListener("touchstart", handleTouchStart, { passive: true });
    target.addEventListener("touchmove", handleTouchMove, { passive: false });
    target.addEventListener("touchend", handleTouchEnd);
    target.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      target.removeEventListener("touchstart", handleTouchStart);
      target.removeEventListener("touchmove", handleTouchMove);
      target.removeEventListener("touchend", handleTouchEnd);
      target.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [gl]);

  return null;
};
