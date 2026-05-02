import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

export const SCENE_DURATIONS = {
  hero: 7000,
  identity: 7000,
  projects1: 8500,
  projects2: 7500,
  career: 10000,
  outro: 7000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Scene1,
  identity: Scene2,
  projects1: Scene3,
  projects2: Scene4,
  career: Scene5,
  outro: Scene6,
};

const bgPositions = [
  { x1: '30%', y1: '40%', x2: '70%', y2: '60%', o1: 0.12, o2: 0.08 },
  { x1: '70%', y1: '30%', x2: '20%', y2: '70%', o1: 0.1, o2: 0.1 },
  { x1: '20%', y1: '60%', x2: '80%', y2: '30%', o1: 0.1, o2: 0.12 },
  { x1: '60%', y1: '70%', x2: '30%', y2: '20%', o1: 0.08, o2: 0.15 },
  { x1: '40%', y1: '20%', x2: '60%', y2: '80%', o1: 0.06, o2: 0.1 },
  { x1: '50%', y1: '50%', x2: '50%', y2: '50%', o1: 0.12, o2: 0.12 },
];

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];
  const bg = bgPositions[sceneIndex] ?? bgPositions[0];

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: '#050810' }}
    >
      {/* Persistent animated bg orb 1 */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,1) 0%, transparent 70%)' }}
        animate={{
          left: bg.x1,
          top: bg.y1,
          opacity: bg.o1,
          x: '-50%',
          y: '-50%',
        }}
        transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Persistent animated bg orb 2 */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,1) 0%, transparent 70%)' }}
        animate={{
          left: bg.x2,
          top: bg.y2,
          opacity: bg.o2,
          x: '-50%',
          y: '-50%',
        }}
        transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Persistent accent line */}
      <motion.div
        className="absolute h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)' }}
        animate={{
          top: sceneIndex % 2 === 0 ? '20%' : '80%',
          left: '5%',
          right: '5%',
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 60px)',
        }}
      />

      {/* Scene layer */}
      <AnimatePresence initial={false} mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
