import { Box, Edges, Line, Text, TextProps } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { WORK_TIMELINE } from "@constants";
import { WorkTimelinePoint } from "@types";

const onTextSync = (text: { material?: THREE.Material }) => {
  if (text.material) {
    text.material.depthTest = false;
    text.material.depthWrite = false;
    text.material.transparent = true;
  }
};

const MOBILE_PANEL_DEPTH = 36;

const TimelinePoint = ({ point, diff }: { point: WorkTimelinePoint, diff: number }) => {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;
  const outerGroupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);

  const tmpForward = useMemo(() => new THREE.Vector3(), []);
  const tmpRight = useMemo(() => new THREE.Vector3(), []);
  const tmpTarget = useMemo(() => new THREE.Vector3(), []);
  const tmpInverse = useMemo(() => new THREE.Matrix4(), []);
  const panelMeshLocalOffset = useMemo(() => new THREE.Vector3(), []);

  const textProps: Partial<TextProps> = useMemo(() => ({
    font: "./Vercetti-Regular.woff",
    color: "white",
    anchorX: "center" as const,
    textAlign: "center" as const,
    fillOpacity: 2 - 2 * diff,
    renderOrder: 12,
    onSync: onTextSync,
  }), [diff]);

  const titleProps = useMemo(() => ({
    ...textProps,
    font: "./soria-font.ttf",
    fontSize: 0.34,
    maxWidth: 3.0,
    lineHeight: 1.15,
    overflowWrap: 'break-word' as const,
  }), [textProps]);

  const hasDescription = !!point.description;
  const panelWidth = 3.6;
  const panelHeight = hasDescription ? 3.4 : 2.7;
  const panelCenterY = hasDescription ? -1.35 : -1.0;
  const panelX = point.position === 'left'
    ? -0.3 - panelWidth / 2
    : 0.3 + panelWidth / 2;
  const panelOpacity = Math.min(1, Math.max(0, 2 - 2 * diff)) * 0.85;
  const outerScale = isMobile ? 0.55 : 0.6;

  // On mobile, anchor every panel to a point directly in front of the camera
  // each frame so the title squares always land in the middle of the screen,
  // regardless of where the underlying curve point sits. The wireframe Box
  // marker stays on the curve, so the dashed line and fly-through effect are
  // unchanged. On desktop the original side-aligned layout is preserved.
  useFrame(() => {
    const inner = innerGroupRef.current;
    const outer = outerGroupRef.current;
    if (!inner || !outer) return;

    if (!isMobile) {
      inner.position.set(panelX, 0, 0);
      return;
    }

    // Target world position: a fixed distance in front of the camera along
    // its look direction (the screen-centre ray), plus the existing
    // left/right side displacement along the camera's right axis so each
    // entry stays in its assigned lane on screen.
    camera.getWorldDirection(tmpForward);
    tmpRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
    tmpTarget
      .copy(camera.position)
      .addScaledVector(tmpForward, MOBILE_PANEL_DEPTH)
      .addScaledVector(tmpRight, panelX * outerScale);

    // Convert that world target into the outer group's child coordinate
    // space using its full world matrix (which encodes every parent
    // rotation/translation/scale up through the Experience tree).
    outer.updateWorldMatrix(true, false);
    tmpInverse.copy(outer.matrixWorld).invert();
    tmpTarget.applyMatrix4(tmpInverse);

    // The panel mesh is at local offset (0, panelCenterY, -0.15) inside
    // the inner group. Position the inner group so the panel mesh's centre
    // lands on the target.
    panelMeshLocalOffset.set(0, panelCenterY, -0.15);
    inner.position.copy(tmpTarget).sub(panelMeshLocalOffset);
  });

  return (
    <group ref={outerGroupRef} position={point.point} scale={outerScale}>
      <Box
        args={[0.2, 0.2, 0.2]}
        position={[0, 0, -0.1]}
        scale={[1 - diff, 1 - diff, 1 - diff]}
        renderOrder={10}
      >
        <meshBasicMaterial color="white" wireframe depthTest={false} />
        <Edges color="white" lineWidth={1.5} renderOrder={10}>
          <lineBasicMaterial color="white" depthTest={false} />
        </Edges>
      </Box>
      <group ref={innerGroupRef} position={[panelX, 0, 0]}>
        <mesh position={[0, panelCenterY, -0.15]} renderOrder={11}>
          <planeGeometry args={[panelWidth, panelHeight]} />
          <meshBasicMaterial
            color="#0a0a18"
            transparent
            opacity={panelOpacity}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
        <Text {...textProps} fontSize={0.28} position={[0, -0.05, 0]}>
          {point.year}
        </Text>
        <Text {...titleProps} position={[0, -1.05 - diff / 2, 0]}>
          {point.title}
        </Text>
        <Text {...textProps} fontSize={0.2} maxWidth={3.0} position={[0, -2.15 - diff * 0.1, 0]}>
          {point.subtitle}
        </Text>
        {point.description && (
          <Text {...textProps} fontSize={0.18} maxWidth={3.0} lineHeight={1.3} textAlign="center" position={[0, -2.75 - diff * 0.1, 0]}>
            {point.description}
          </Text>
        )}
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
      <Line
        points={visibleCurvePoints}
        color="white"
        lineWidth={3}
        depthTest={false}
        renderOrder={9}
      />
      {visibleDashedCurvePoints.length > 0 && (
        <Line
          points={visibleDashedCurvePoints}
          color="white"
          lineWidth={0.5}
          dashed
          dashSize={0.25}
          gapSize={0.25}
          depthTest={false}
          renderOrder={9}
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
