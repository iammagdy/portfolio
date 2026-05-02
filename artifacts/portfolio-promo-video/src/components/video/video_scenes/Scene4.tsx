import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const projects = [
  {
    title: 'Magic Sourcing',
    desc: 'Chrome extension · LinkedIn AI sourcing · Gemini · Skill-gap analysis',
    icon: '⚡',
    color: '#8B5CF6',
    tag: 'Chrome Extension',
  },
  {
    title: 'Wise Quran',
    desc: 'Offline-first PWA · Reading · Listening · Daily worship tracking',
    icon: '◆',
    color: '#10B981',
    tag: 'Progressive Web App',
  },
  {
    title: 'Wise Prompt',
    desc: 'All-in-One AI workspace · Prompt engineering · Web scraping · Computer vision',
    icon: '◈',
    color: '#F59E0B',
    tag: 'AI Workspace',
  },
  {
    title: 'megZone',
    desc: 'Centralized AI workspace · Multi-app launcher · AI CV Builder',
    icon: '▣',
    color: '#3B82F6',
    tag: 'AI Platform',
  },
];

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      initial={{ opacity: 1, clipPath: 'inset(0 0 100% 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(155deg, #060912 0%, #0D1526 100%)' }} />

      <motion.div
        className="absolute top-[20%] right-0 w-[250px] h-[250px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 px-[7%]">
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-8 h-[2px]" style={{ background: '#8B5CF6' }} />
          <span
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: 'rgba(139,92,246,0.9)', fontFamily: 'var(--font-display)' }}
          >
            More Projects
          </span>
        </motion.div>

        <motion.h2
          className="font-bold mb-8 leading-tight"
          style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
            fontFamily: 'var(--font-display)',
            color: 'white',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          8 Products.{' '}
          <span style={{ background: 'linear-gradient(135deg, #A78BFA, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            One Engineer.
          </span>
        </motion.h2>

        <div className="grid grid-cols-2 gap-4 max-w-[900px]">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              className="relative rounded-xl p-5"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={phase >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.5, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3
                  className="font-bold"
                  style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)', fontFamily: 'var(--font-display)', color: 'white' }}
                >
                  {p.title}
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full shrink-0 ml-2"
                  style={{ background: `rgba(${p.color === '#8B5CF6' ? '139,92,246' : p.color === '#10B981' ? '16,185,129' : p.color === '#F59E0B' ? '245,158,11' : '59,130,246'},0.15)`, color: p.color, fontSize: '0.6rem', letterSpacing: '0.05em' }}
                >
                  {p.tag}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
              >
                {p.desc}
              </p>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl"
                style={{ background: `linear-gradient(90deg, ${p.color}40, ${p.color}80, ${p.color}40)` }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
