import { Text } from "@react-three/drei";
import { useProgress } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import CloudContainer from "../models/Cloud";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";
import { MOBILE_BREAKPOINT } from "../../hooks/useBreakpoint";
import { useThemeStore } from "@stores";

const Hero = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const titleRef = useRef<any>(null);

  const { progress } = useProgress();
  const { size } = useThree();
  const isMobile = size.width < MOBILE_BREAKPOINT;
  const themeType = useThemeStore((s) => s.theme.type);
  const isDark = themeType === 'dark';

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      gsap.fromTo(titleRef.current.position, {
        y: -10,
        duration: 1,
      }, {
        y: 0,
        duration: 3,
        delay: 0.15,
      });
    }
  }, [progress]);

  return (
    <>
      <Text
        ref={titleRef}
        position={[0, isMobile ? 1.5 : 2, -10]}
        font="./soria-font.ttf"
        fontSize={isMobile ? 0.7 : 1.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={isMobile ? 7 : 14}
        outlineWidth={isDark ? 0 : (isMobile ? 0.018 : 0.025)}
        outlineColor={isDark ? '#000000' : '#0a0a0a'}
        outlineOpacity={isDark ? 0 : 0.55}
        outlineBlur={isDark ? 0 : (isMobile ? 0.05 : 0.08)}
        strokeWidth={isDark ? (isMobile ? 0.006 : 0.01) : 0}
        strokeColor={isDark ? '#ffffff' : '#000000'}
      >
        Hi, I am Magdy Saber.
      </Text>
      <StarsContainer />
      <CloudContainer/>
      <group position={[0, -25, 5.69]}>
        <pointLight castShadow position={[1, 1, -2.5]} intensity={60} distance={10} color={'#ffe9c4'} />
        <pointLight position={[-2, 0.8, 2]} intensity={6} distance={8} color={'#9ec7ff'} />
        <directionalLight position={[0, 4, 1]} intensity={0.6} color={'#ffffff'} />
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
