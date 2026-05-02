import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const timeline = [
  { year: '2008', title: 'Technical Support', company: 'Link-ADSL', color: '#3B82F6' },
  { year: '2012', title: 'IT Support', company: 'TE-Data', color: '#3B82F6' },
  { year: '2014', title: 'IT Administrator', company: 'TE-Data', color: '#60A5FA' },
  { year: '2017', title: 'Supervisor', company: 'e& Emirates', color: '#93C5FD' },
  { year: '2020', title: 'Recruitment', company: 'White Whale', color: '#F59E0B' },
  { year: '2022', title: 'Sales Supervisor', company: 'e& Egypt', color: '#F59E0B' },
  { year: '2024', title: 'Service Coord.', company: 'Teleperformance', color: '#FDE68A' },
  { year: '2025', title: 'Transport Supvr.', company: 'Etihad Airways', color: '#10B981' },
  { year: '2026', title: 'AI Product Engineer', company: 'Self', color: '#34D399' },
];

export function Scene5() {
  const [phase, setPhase] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
    ];
    timeline.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveIdx(i), 1400 + i * 600));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.15 }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #050810 0%, #080F1E 100%)' }} />

      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(59,130,246,0.1) 0px, rgba(59,130,246,0.1) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(180deg, rgba(59,130,246,0.1) 0px, rgba(59,130,246,0.1) 1px, transparent 1px, transparent 80px)',
        }}
      />

      <div className="relative z-10 px-[7%]">
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-8 h-[2px] bg-amber-500" />
          <span
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: 'rgba(245,158,11,0.9)', fontFamily: 'var(--font-display)' }}
          >
            Career Journey
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
          18 Years of{' '}
          <span style={{ background: 'linear-gradient(135deg, #FDE68A, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Growth
          </span>
        </motion.h2>

        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute left-[72px] top-4 bottom-4 w-[2px]"
            style={{ transformOrigin: 'top', background: 'linear-gradient(180deg, #3B82F6, #F59E0B, #10B981)' }}
            initial={{ scaleY: 0 }}
            animate={phase >= 3 ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />

          <div className="flex flex-col gap-3">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className="flex items-center gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={activeIdx >= i ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="text-right shrink-0"
                  style={{ width: '56px', fontSize: '0.65rem', fontFamily: 'var(--font-display)', color: item.color, fontWeight: 600, letterSpacing: '0.05em' }}
                >
                  {item.year}
                </div>

                <motion.div
                  className="w-3 h-3 rounded-full shrink-0 relative z-10"
                  style={{ background: item.color, boxShadow: `0 0 8px ${item.color}60` }}
                  animate={activeIdx >= i ? { scale: [0.5, 1.2, 1] } : { scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                />

                <div>
                  <span
                    className="font-semibold"
                    style={{
                      fontSize: i === timeline.length - 1 ? 'clamp(0.75rem, 1.5vw, 1rem)' : 'clamp(0.65rem, 1.3vw, 0.85rem)',
                      fontFamily: 'var(--font-display)',
                      color: i === timeline.length - 1 ? '#34D399' : 'rgba(255,255,255,0.85)',
                      fontWeight: i === timeline.length - 1 ? 700 : 500,
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="ml-2"
                    style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}
                  >
                    {item.company}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
