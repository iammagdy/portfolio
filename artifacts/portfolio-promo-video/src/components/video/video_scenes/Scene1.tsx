import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2800),
      setTimeout(() => setPhase(5), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const name = 'MAGDY SABER';
  const chars = name.split('');

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.15, ease: 'easeIn' }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #050810 0%, #0D1526 50%, #050810 100%)' }} />

      <motion.div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full"
        style={{ x: '-50%', y: '-50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #3B82F6, #F59E0B, transparent)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={phase >= 1 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        className="absolute top-[15%] left-[8%] text-xs tracking-[0.5em] uppercase"
        style={{ color: 'rgba(59,130,246,0.7)', fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0, x: -20 }}
        animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Portfolio 2026
      </motion.div>

      <div className="relative z-10 text-center" style={{ perspective: '1200px' }}>
        <div className="overflow-hidden">
          <h1
            className="font-display font-bold leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(3rem, 9vw, 8rem)',
              fontFamily: 'var(--font-display)',
              color: 'white',
            }}
          >
            {chars.map((char, i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
                initial={{ opacity: 0, y: 80, rotateX: -60 }}
                animate={
                  phase >= 2
                    ? { opacity: 1, y: 0, rotateX: 0 }
                    : { opacity: 0, y: 80, rotateX: -60 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 26,
                  delay: phase >= 2 ? i * 0.045 : 0,
                }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.div
          className="mt-6 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <motion.div
            className="h-[1px] bg-gradient-to-r from-transparent to-blue-500"
            initial={{ width: 0 }}
            animate={phase >= 3 ? { width: '80px' } : { width: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <span
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: 'rgba(245,158,11,0.9)', fontFamily: 'var(--font-display)' }}
          >
            AI Product Engineer
          </span>
          <motion.div
            className="h-[1px] bg-gradient-to-l from-transparent to-blue-500"
            initial={{ width: 0 }}
            animate={phase >= 3 ? { width: '80px' } : { width: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-[15%] right-[8%] text-xs tracking-[0.3em] uppercase"
        style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0 }}
        animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        2008 — 2026
      </motion.div>

      <motion.div
        className="absolute top-[8%] right-[8%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
          <circle cx="24" cy="24" r="14" stroke="rgba(59,130,246,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="24" cy="2" r="2" fill="rgba(59,130,246,0.6)" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
