import { Box, Edges, Line, Text, TextProps } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { WORK_TIMELINE } from "@constants";
import { WorkTimelinePoint } from "@types";

const TimelinePoint = ({ point, diff }: { point: WorkTimelinePoint, diff: number }) => {
  const { size } = useThree();
  const isMobile = size.width < 768;

  const textProps: Partial<TextProps> = useMemo(() => ({
    font: "./Vercetti-Regular.woff",
    color: "white",
    anchorX: "center" as const,
    textAlign: "center" as const,
    fillOpacity: 2 - 2 * diff,
  }), [diff]);

  const titleProps = useMemo(() => ({
    ...textProps,
    font: "./soria-font.ttf",
    fontSize: 0.4,
    maxWidth: 3.2,
    lineHeight: 1.1,
  }), [textProps]);

  const panelWidth = 3.6;
  const panelHeight = 2.7;
  const panelCenterY = -1.0;
  const panelX = point.position === 'left'
    ? -0.3 - panelWidth / 2
    : 0.3 + panelWidth / 2;
  const panelOpacity = Math.min(1, Math.max(0, 2 - 2 * diff)) * 0.5;

  return (
    <group position={point.point} scale={isMobile ? 0.55 : 0.6}>
      <Box args={[0.2, 0.2, 0.2]} position={[0, 0, -0.1]} scale={[1 - diff, 1 - diff, 1 - diff]}>
        <meshBasicMaterial color="white" wireframe />
        <Edges color="white" lineWidth={1.5} />
      </Box>
      <group position={[panelX, 0, 0]}>
        <mesh position={[0, panelCenterY, -0.15]}>
          <planeGeometry args={[panelWidth, panelHeight]} />
          <meshBasicMaterial
            color="#0a0a18"
            transparent
            opacity={panelOpacity}
            depthWrite={false}
          />
        </mesh>
        <Text {...textProps} fontSize={0.3} position={[0, 0.05, 0]}>
          {point.year}
        </Text>
        <Text {...titleProps} position={[0, -0.85 - diff / 2, 0]}>
          {point.title}
        </Text>
        <Text {...textProps} fontSize={0.2} maxWidth={3.2} position={[0, -2.05 - diff * 0.1, 0]}>
          {point.subtitle}
        </Text>
      </group>
    </group>
  );
};

const Timeline = ({ progress }: { progress: number }) => {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;
  const isActive = usePortalStore((state) => state.activePortalId === 'work');
  const timeline = useMemo(() => WORK_TIMELINE, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(timeline.map(p => p.point), false), [timeline]);
  const curvePoints = useMemo(() => curve.getPoints(500), [curve]);
  const visibleCurvePoints = useMemo(() => curvePoints.slice(0, Math.max(1, Math.ceil(progress * curvePoints.length))), [curvePoints, progress]);
  const activeIndex = progress * (timeline.length - 1);
  const visibleTimelinePoints = useMemo(() => {
    const windowRadius = 1.2;
    return timeline
      .map((point, i) => ({ point, i }))
      .filter(({ i }) => i <= activeIndex + 0.05 && Math.abs(i - activeIndex) <= windowRadius);
  }, [timeline, activeIndex]);

  const [visibleDashedCurvePoints, setVisibleDashedCurvePoints] = useState<THREE.Vector3[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useFrame((_, delta) => {
    if (isActive) {
      const position = curve.getPoint(progress);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, (isMobile ? 0 : -2) + position.x, 4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, (isMobile ? -36 : -39) + position.z, 4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 13 - position.y, 4, delta);
    }
  });

  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    if (groupRef.current) {
      tl.to(groupRef.current.scale, {
        x: isActive ? 1 : 0,
        y: isActive ? 1 : 0,
        z: isActive ? 1 : 0,
        duration: 1,
        delay: isActive ? 0.4 : 0,
      });
      tl.to(groupRef.current.position, {
        y: isActive ? 0 : -2,
        duration: 1,
        delay: isActive ? 0.4 : 0,
      }, 0);
    }

    if (isActive) {
      let i = 0;
      clearInterval(intervalRef.current!);
      setTimeout(() => {
        intervalRef.current = setInterval(() => {
          const p = i++ / 100;
          setVisibleDashedCurvePoints(curvePoints.slice(0, Math.max(1, Math.ceil(p * curvePoints.length))));
          if (i > 100 && intervalRef.current) clearInterval(intervalRef.current);
        }, 10);
      }, 1000);
    } else {
      setVisibleDashedCurvePoints([]);
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isActive]);

  return (
    <group position={[0, -0.1, -0.1]}>
      <Line points={visibleCurvePoints} color="white" lineWidth={3} />
      {visibleDashedCurvePoints.length > 0 && (
        <Line
          points={visibleDashedCurvePoints}
          color="white"
          lineWidth={0.5}
          dashed
          dashSize={0.25}
          gapSize={0.25}
        />
      )}
      <group ref={groupRef}>
        {visibleTimelinePoints.map(({ point, i }) => {
          const diff = Math.min(Math.abs(i - activeIndex), 1);
          return <TimelinePoint point={point} key={i} diff={diff} />;
        })}
      </group>
    </group>
  );
};

export default Timeline;
