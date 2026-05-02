import { Text } from "@react-three/drei";
import { useProgress } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import CloudContainer from "../models/Cloud";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

const Hero = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const titleRef = useRef<any>(null);

  const { progress } = useProgress();
  const { size } = useThree();
  const isMobile = size.width < 768;

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

  return (
    <>
      <Text
        ref={titleRef}
        position={[0, isMobile ? 1.5 : 2, -10]}
        font="./soria-font.ttf"
        fontSize={isMobile ? 0.7 : 1.2}
        color="#ffffff"
      >
        Hi, I am Magdy Saber.
      </Text>
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
