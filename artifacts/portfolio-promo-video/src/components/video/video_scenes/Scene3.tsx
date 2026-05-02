import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const projects = [
  {
    title: 'Wise Resume',
    category: 'AI Career Platform',
    desc: 'Resume builder · Interview coaching · ATS scoring · 30+ templates',
    color: '#3B82F6',
    delay: 0,
  },
  {
    title: 'Wise Hire',
    category: 'AI HR SaaS',
    desc: 'AI job descriptions · Bulk CV screening · Kanban pipeline',
    color: '#F59E0B',
    delay: 0.15,
  },
  {
    title: 'The Wise Cloud',
    category: 'Dual-Product Platform',
    desc: 'Connecting job seekers & HR teams in one ecosystem',
    color: '#10B981',
    delay: 0.3,
  },
];

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1300),
      setTimeout(() => setPhase(4), 6200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.15 }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #050810 0%, #0A1020 100%)' }} />

      <motion.div
        className="absolute top-0 right-[10%] w-[300px] h-[300px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-[5%] w-[200px] h-[200px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative z-10 px-[7%]">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-8 h-[2px] bg-blue-500" />
          <span
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: 'rgba(59,130,246,0.9)', fontFamily: 'var(--font-display)' }}
          >
            Featured Projects
          </span>
        </motion.div>

        <motion.h2
          className="font-bold mb-10 leading-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontFamily: 'var(--font-display)',
            color: 'white',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          The{' '}
          <span style={{ background: 'linear-gradient(135deg, #34D399, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            AI Ecosystem
          </span>
        </motion.h2>

        <div className="grid gap-4 max-w-[900px]">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              className="relative overflow-hidden rounded-xl p-5 flex items-center gap-6"
              style={{
                background: `rgba(${p.color === '#3B82F6' ? '59,130,246' : p.color === '#F59E0B' ? '245,158,11' : '16,185,129'},0.06)`,
                border: `1px solid rgba(${p.color === '#3B82F6' ? '59,130,246' : p.color === '#F59E0B' ? '245,158,11' : '16,185,129'},0.2)`,
              }}
              initial={{ opacity: 0, x: -40, scale: 0.97 }}
              animate={phase >= 3 ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -40, scale: 0.97 }}
              transition={{ duration: 0.6, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="w-1 self-stretch rounded-full shrink-0"
                style={{ background: p.color }}
                animate={{ scaleY: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                  <h3
                    className="font-bold"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontFamily: 'var(--font-display)', color: 'white' }}
                  >
                    {p.title}
                  </h3>
                  <span
                    className="text-xs tracking-wide uppercase shrink-0"
                    style={{ color: p.color, opacity: 0.9 }}
                  >
                    {p.category}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}
                >
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
