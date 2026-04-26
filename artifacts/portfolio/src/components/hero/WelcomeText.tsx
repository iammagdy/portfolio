import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const WelcomeText = () => {
  const data = useScroll();
  const textRef = useRef<any>(null);

  useFrame(() => {
    if (!textRef.current) return;

    const fadeIn  = data.range(0.25, 0.15);
    const fadeOut = data.range(0.58, 0.12);

    textRef.current.fillOpacity = fadeIn * (1 - fadeOut);
    textRef.current.position.y  = 2.1 + fadeIn * 0.35;
  });

  return (
    <Text
      ref={textRef}
      font="./soria-font.ttf"
      fontSize={0.38}
      color="white"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.18}
      fillOpacity={0}
      position={[0, 2.1, 0]}
    >
      Welcome to My World
    </Text>
  );
};

export default WelcomeText;
