import { Asset } from "expo-asset";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFrame } from "./Canvas";
import FloatingFrame from "./FloatingFrame";

interface Props {
  accent?: string;
  base?: string;
}

interface LoadedScene {
  scene: THREE.Group;
}

export default function WindowModel(props: Props) {
  return (
    <Suspense fallback={<FloatingFrame {...props} />}>
      {Platform.OS === "web" ? (
        <FloatingFrame {...props} />
      ) : (
        <NativeWindowGLB {...props} />
      )}
    </Suspense>
  );
}

function NativeWindowGLB({ accent = "#0690d4", base = "#ededed" }: Props) {
  const [obj, setObj] = useState<LoadedScene | null>(null);
  const [failed, setFailed] = useState(false);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const asset = Asset.fromModule(require("../assets/3d/window.glb"));
        await asset.downloadAsync();
        const uri = asset.localUri ?? asset.uri;
        const loader = new GLTFLoader();
        loader.load(
          uri,
          (gltf) => {
            if (cancelled) return;
            gltf.scene.traverse((child) => {
              const mesh = child as THREE.Mesh;
              if (mesh.isMesh) {
                mesh.material = new THREE.MeshStandardMaterial({
                  color: base,
                  metalness: 0.4,
                  roughness: 0.3,
                  emissive: accent,
                  emissiveIntensity: 0.15,
                });
              }
            });
            setObj({ scene: gltf.scene as unknown as THREE.Group });
          },
          undefined,
          () => {
            if (!cancelled) setFailed(true);
          },
        );
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accent, base]);

  useFrame((_state: unknown, delta: number) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.position.y = Math.sin(performance.now() / 1400) * 0.2;
    }
  });

  if (failed) return <FloatingFrame accent={accent} base={base} />;
  if (!obj) return null;

  return (
    <group ref={group} scale={1.2}>
      <primitive object={obj.scene} />
    </group>
  );
}
