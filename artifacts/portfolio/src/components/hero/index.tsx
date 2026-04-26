;

import { Text } from "@react-three/drei";

import { useProgress } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThemeStore } from "../../stores/themeStore";
import CloudContainer, { CLOUD_BOUNDS } from "../models/Cloud";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

const Hero = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const titleRef = useRef<any>(null);
  const isOverlapRef = useRef(false);
  const [outlineColor, setOutlineColor] = useState<string>("#ffffff");

  const { progress } = useProgress();
  const { camera, size } = useThree();
  const isMobile = size.width < 768;
  const themeType = useThemeStore((state) => state.theme.type);
  const isLight = themeType === "light";

  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  const tmpVec2 = useMemo(() => new THREE.Vector3(), []);
  const cameraRight = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      gsap.fromTo(titleRef.current.position, {
        y: -10,
        duration: 1,
      }, {
        y: 0,
        duration: 3
      });
    }
  }, [progress]);

  useEffect(() => {
    if (isLight && isOverlapRef.current) {
      isOverlapRef.current = false;
      setOutlineColor("#ffffff");
    }
  }, [isLight]);

  useFrame(() => {
    if (isLight) return;
    const text = titleRef.current;
    if (!text || !text.textRenderInfo) return;
    const blockBounds = text.textRenderInfo.blockBounds;
    if (!blockBounds) return;
    const [bMinX, bMinY, bMaxX, bMaxY] = blockBounds;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const corners: [number, number][] = [
      [bMinX, bMinY],
      [bMaxX, bMinY],
      [bMinX, bMaxY],
      [bMaxX, bMaxY],
    ];
    for (const [x, y] of corners) {
      tmpVec.set(x, y, 0);
      text.localToWorld(tmpVec);
      tmpVec.project(camera);
      if (tmpVec.x < minX) minX = tmpVec.x;
      if (tmpVec.y < minY) minY = tmpVec.y;
      if (tmpVec.x > maxX) maxX = tmpVec.x;
      if (tmpVec.y > maxY) maxY = tmpVec.y;
    }

    if (maxX < -1 || minX > 1 || maxY < -1 || minY > 1) {
      if (isOverlapRef.current) {
        isOverlapRef.current = false;
        setOutlineColor("#ffffff");
      }
      return;
    }

    cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion);

    let overlaps = false;
    for (const c of CLOUD_BOUNDS) {
      tmpVec.copy(c.center).applyMatrix4(camera.matrixWorldInverse);
      if (tmpVec.z > c.radius) continue;
      tmpVec.copy(c.center).project(camera);
      tmpVec2.copy(c.center).addScaledVector(cameraRight, c.radius).project(camera);
      const r = Math.hypot(tmpVec2.x - tmpVec.x, tmpVec2.y - tmpVec.y);
      const closestX = Math.max(minX, Math.min(tmpVec.x, maxX));
      const closestY = Math.max(minY, Math.min(tmpVec.y, maxY));
      const dx = tmpVec.x - closestX;
      const dy = tmpVec.y - closestY;
      const effectiveR = isOverlapRef.current ? r + 0.05 : r;
      if (dx * dx + dy * dy <= effectiveR * effectiveR) {
        overlaps = true;
        break;
      }
    }

    if (overlaps !== isOverlapRef.current) {
      isOverlapRef.current = overlaps;
      setOutlineColor(overlaps ? "#000000" : "#ffffff");
    }
  });

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: isMobile ? 0.7 : 1.2,
    color: "#ffffff",
    outlineWidth: isLight ? 0 : "5%",
    outlineColor,
    outlineOpacity: isLight ? 0 : 1,
  };

  return (
    <>
      <Text position={[0, isMobile ? 1.5 : 2, -10]} {...fontProps} ref={titleRef}>Hi, I am Magdy Saber.</Text>
      <StarsContainer />
      <CloudContainer/>
      <group position={[0, -25, 5.69]}>
        <pointLight castShadow position={[1, 1, -2.5]} intensity={60} distance={10}/>
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
