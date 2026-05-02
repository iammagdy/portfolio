import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setPhase(5), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const name = 'MAGDY SABER';

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 1, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, #0D1A2E 0%, #050810 70%)' }} />

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, rgba(59,130,246,0.03), rgba(245,158,11,0.05), rgba(16,185,129,0.03), rgba(59,130,246,0.03))',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${20 + i * 12}px`,
            height: `${20 + i * 12}px`,
            border: `1px solid rgba(59,130,246,${0.15 - i * 0.02})`,
            left: `${15 + i * 12}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{ rotate: i % 2 === 0 ? [0, 360] : [360, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <div className="relative z-10 text-center" style={{ perspective: '1200px' }}>
        <motion.p
          className="text-xs tracking-[0.6em] uppercase mb-6"
          style={{ color: 'rgba(59,130,246,0.7)', fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Thank You for Watching
        </motion.p>

        <h2
          className="font-bold leading-none tracking-tighter mb-4"
          style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', fontFamily: 'var(--font-display)' }}
        >
          {name.split('').map((char, i) => (
            <motion.span
              key={i}
              style={{ display: 'inline-block', whiteSpace: 'pre', color: 'white' }}
              initial={{ opacity: 0, y: -40, scale: 1.2 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -40, scale: 1.2 }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 24,
                delay: phase >= 2 ? i * 0.04 : 0,
              }}
            >
              {char}
            </motion.span>
          ))}
        </h2>

        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={phase >= 3 ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-[1px] w-16" style={{ background: 'linear-gradient(90deg, transparent, #3B82F6)' }} />
          <span
            className="text-sm tracking-[0.3em] uppercase font-medium"
            style={{ color: '#F59E0B', fontFamily: 'var(--font-display)' }}
          >
            AI Product Engineer
          </span>
          <div className="h-[1px] w-16" style={{ background: 'linear-gradient(270deg, transparent, #3B82F6)' }} />
        </motion.div>

        <motion.p
          className="text-sm"
          style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}
          initial={{ opacity: 0, y: 12 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Building AI-first products that make a difference
        </motion.p>

        <motion.div
          className="mt-10 flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {['Wise Resume', 'Wise Hire', 'The Wise Cloud'].map((name, i) => (
            <motion.div
              key={name}
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={phase >= 5 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ delay: i * 0.12 + 0.1, duration: 0.4 }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: ['#3B82F6', '#F59E0B', '#10B981'][i] }} />
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-display)' }}>{name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
