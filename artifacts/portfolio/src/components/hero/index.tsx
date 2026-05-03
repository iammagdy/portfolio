import { Text } from "@react-three/drei";
import { useProgress } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CloudContainer from "../models/Cloud";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";
import { MOBILE_BREAKPOINT } from "../../hooks/useBreakpoint";
import { useThemeStore } from "@stores";

const Hero = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const titleRef = useRef<any>(null);
  const bgTexRef = useRef<THREE.FramebufferTexture | null>(null);

  const { progress } = useProgress();
  const { gl, size } = useThree();
  const isMobile = size.width < MOBILE_BREAKPOINT;
  const themeType = useThemeStore((s) => s.theme.type);
  const isDark = themeType === 'dark';

  const textMaterial = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uBgTex = { value: null };
      shader.uniforms.uResolution = { value: new THREE.Vector2(1, 1) };
      shader.fragmentShader =
        `uniform sampler2D uBgTex;\nuniform vec2 uResolution;\n` +
        shader.fragmentShader.replace(
          /}\s*$/,
          `
          {
            vec2 fbUv = gl_FragCoord.xy / uResolution;
            vec3 bgCol = texture2D(uBgTex, fbUv).rgb;
            float lum = dot(bgCol, vec3(0.299, 0.587, 0.114));
            float darken = smoothstep(0.55, 0.9, lum);
            vec3 ink = mix(vec3(1.0), vec3(0.0), darken);
            gl_FragColor.rgb = ink;
          }
        }`
        );
      mat.userData.shader = shader;
    };
    return mat;
  }, []);

  useEffect(() => {
    return () => {
      bgTexRef.current?.dispose();
      bgTexRef.current = null;
      textMaterial.dispose();
    };
  }, [textMaterial]);

  useEffect(() => {
    const mesh = titleRef.current;
    if (!mesh) return;
    const handler = (renderer: THREE.WebGLRenderer) => {
      const drawSize = renderer.getDrawingBufferSize(new THREE.Vector2());
      const w = Math.max(1, Math.floor(drawSize.x));
      const h = Math.max(1, Math.floor(drawSize.y));
      let tex = bgTexRef.current;
      if (!tex || tex.image.width !== w || tex.image.height !== h) {
        tex?.dispose();
        tex = new THREE.FramebufferTexture(w, h);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        bgTexRef.current = tex;
      }
      renderer.copyFramebufferToTexture(tex);
      const sh = textMaterial.userData.shader;
      if (sh) {
        sh.uniforms.uBgTex.value = tex;
        sh.uniforms.uResolution.value.set(w, h);
      }
    };
    mesh.onBeforeRender = handler;
    return () => {
      if (mesh.onBeforeRender === handler) {
        mesh.onBeforeRender = () => {};
      }
    };
  }, [textMaterial]);

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
        material={textMaterial}
        position={[0, isMobile ? 1.5 : 2, -10]}
        font="./soria-font.ttf"
        fontSize={isMobile ? 0.7 : 1.2}
        anchorX="center"
        anchorY="middle"
        maxWidth={isMobile ? 7 : 14}
        renderOrder={10}
      >
        Hi, I am Magdy Saber.
      </Text>
      {/* Outline fallback: keeps a faint dark halo on the light theme so the
          text reads even before the framebuffer sample resolves on the very
          first frame. Dark theme doesn't need it. */}
      {!isDark && (
        <Text
          position={[0, isMobile ? 1.5 : 2, -10.01]}
          font="./soria-font.ttf"
          fontSize={isMobile ? 0.7 : 1.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={isMobile ? 7 : 14}
          fillOpacity={0}
          outlineWidth={isMobile ? 0.018 : 0.025}
          outlineColor="#0a0a0a"
          outlineOpacity={0.35}
          outlineBlur={isMobile ? 0.05 : 0.08}
        >
          Hi, I am Magdy Saber.
        </Text>
      )}
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
