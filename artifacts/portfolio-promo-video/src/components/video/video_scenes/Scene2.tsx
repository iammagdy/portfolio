import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const taglineWords = ['Building', 'production-ready', 'apps', 'at', '10x', 'speed.'];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => setPhase(5), 5800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 1, clipPath: 'inset(0 100% 0 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0D1526 0%, #050810 60%, #0A0F1E 100%)' }} />

      <motion.div
        className="absolute right-0 top-0 bottom-0 w-[40%]"
        style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.06) 0%, rgba(245,158,11,0.04) 100%)' }}
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: 'linear-gradient(180deg, transparent, #3B82F6, #F59E0B, transparent)' }}
        initial={{ scaleY: 0 }}
        animate={phase >= 1 ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative z-10 px-[10%] max-w-[90%]">
        <motion.p
          className="text-xs tracking-[0.5em] uppercase mb-6"
          style={{ color: 'rgba(59,130,246,0.8)', fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Current Role
        </motion.p>

        <div style={{ perspective: '1000px' }}>
          <motion.h2
            className="font-bold leading-tight mb-8"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.85) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 40, rotateX: -20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            AI Product{' '}
            <span style={{ background: 'linear-gradient(135deg, #60A5FA, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Engineer
            </span>
          </motion.h2>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 max-w-[700px]">
          {taglineWords.map((word, i) => (
            <motion.span
              key={i}
              className="font-medium"
              style={{
                fontSize: 'clamp(1rem, 2.2vw, 1.6rem)',
                fontFamily: 'var(--font-display)',
                color: word === '10x' ? '#F59E0B' : 'rgba(255,255,255,0.75)',
                fontWeight: word === '10x' ? 700 : 400,
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, delay: phase >= 3 ? i * 0.07 : 0, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="mt-10 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {['AI-First Workflow', 'Full-Stack SaaS', '8 Products Built'].map((tag, i) => (
            <motion.div
              key={tag}
              className="px-4 py-2 rounded-full text-xs tracking-wider uppercase"
              style={{
                border: '1px solid rgba(59,130,246,0.3)',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-display)',
                background: 'rgba(59,130,246,0.06)',
              }}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={phase >= 4 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.9 }}
              transition={{ delay: i * 0.1 + 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {tag}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
