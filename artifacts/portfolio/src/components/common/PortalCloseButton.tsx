import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePortalStore } from '@stores';

const PortalCloseButton = () => {
  const activeId = usePortalStore((s) => s.activePortalId);
  const setActive = usePortalStore((s) => s.setActivePortal);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeId || !ref.current) return;
    const el = ref.current;
    gsap.fromTo(
      el,
      { scale: 0, rotate: -180, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
    );
    requestAnimationFrame(() => el.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    document.body.addEventListener('keydown', onKey);
    return () => {
      document.body.removeEventListener('keydown', onKey);
    };
  }, [activeId, setActive]);

  if (!activeId) return null;

  return (
    <button
      ref={ref}
      type="button"
      className="close"
      aria-label={`Close ${activeId} portal`}
      onClick={() => setActive(null)}
      style={{ zIndex: 10 }}
    />
  );
};

export default PortalCloseButton;
