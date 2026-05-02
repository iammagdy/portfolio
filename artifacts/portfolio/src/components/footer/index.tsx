import { Svg, Text, useCursor, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FOOTER_LINKS } from "../../constants";
import { FooterLink } from "../../types";

const FooterLinkItem = ({ link, isMobile }: { link: FooterLink; isMobile: boolean }) => {
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);
  const onClick = () => {
    if (link.url.startsWith('mailto:')) {
      window.location.href = link.url;
    } else {
      window.open(link.url, '_blank');
    }
  };
  const onPointerMove = (e: MouseEvent) => {
    if (isMobile) return;
    const hoverDiv = document.getElementById(`footer-link-${link.name}`);
    gsap.to(hoverDiv, {
      top: `${e.clientY + 14}px`,
      left: `${e.clientX}px`,
      duration: 0.6,
    });
  };

  useEffect(() => {
    if (!document.getElementById(`footer-link-${link.name}`)) {
      const hoverDiv = document.createElement('div');
      hoverDiv.id = `footer-link-${link.name}`;
      hoverDiv.textContent = link.hoverText ?? link.name.toUpperCase();
      hoverDiv.style.position = 'fixed';
      hoverDiv.style.zIndex = '2';
      hoverDiv.style.bottom = '0';
      hoverDiv.style.opacity = '0';
      hoverDiv.style.left = window.innerWidth / 2 + 'px';
      hoverDiv.style.fontSize = '0.8rem';
      hoverDiv.style.pointerEvents = 'none';
      document.body.appendChild(hoverDiv);
    }
  }, [])

  useEffect(() => {
    if (isMobile) return;

    const hoverDiv = document.getElementById(`footer-link-${link.name}`);

    if (hovered) {
      gsap.fromTo(hoverDiv, { opacity: 0 }, { opacity: 0.5, delay: 0.2 });
    } else {
      gsap.to(hoverDiv, { opacity: 0 });
    }

    gsap.to(textRef.current, {
      letterSpacing: hovered ? 0.3 : 0,
      duration: 0.3,
    });

    return () => {
      gsap.killTweensOf(hoverDiv);
      gsap.killTweensOf(textRef.current);
    }
  }, [hovered]);

  useCursor(hovered);

  // Generous invisible hit-plane behind each link so taps don't have to land
  // exactly on the text/SVG pixels. Sizes are tuned to roughly equal a 44px
  // physical touch target at the camera's footer distance.
  const hitWidth = isMobile ? 0.95 : 1.9;
  const hitHeight = isMobile ? 0.95 : 0.7;

  const HitArea = (
    <mesh
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerMove={isMobile ? undefined : onPointerMove}
      position={[0, isMobile ? 0.15 : 0, 0.01]}
      renderOrder={20}
    >
      <planeGeometry args={[hitWidth, hitHeight]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
    </mesh>
  );

  if (isMobile) {
    return (
      <group>
        {HitArea}
        {/* Bumped scale 0.0015 → 0.0022 so the icon itself is more visible too. */}
        <Svg scale={0.0022} position={[-0.11, 0.11, 0]} src={link.icon} />
      </group>
    );
  }

  return (
    <group ref={textRef}>
      {HitArea}
      <Text
        font="./Vercetti-Regular.woff"
        fontSize={0.2}
        color="white"
      >
        {link.name.toUpperCase()}
      </Text>
    </group>
  );
}

const Footer = () => {
  const groupRef = useRef<THREE.Group>(null);
  const data = useScroll();
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame(() => {
    const d = data.range(0.8, 0.2);
    if (groupRef.current) {
      groupRef.current.visible = d > 0;
    }
  });

  // Wider spacing on mobile so the bigger hit-planes don't overlap.
  const spacing = isMobile ? 1.4 : 2;
  const centerOffset = -((FOOTER_LINKS.length - 1) * spacing) / 2;

  const getLinks = () => {
    return FOOTER_LINKS.map((link, i) => {
      return (
        <group key={i} position={[i * spacing, 0, 0]}>
          <FooterLinkItem link={link} isMobile={isMobile} />
        </group>
      );
    });
  };

  return (
    <group position={[0, -44, 18]} rotation={[-Math.PI / 2, 0, 0]} ref={groupRef}>
      <group position={[centerOffset, 0, 0]}>
        { getLinks() }
      </group>
    </group>
  );
};

export default Footer;
