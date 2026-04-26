import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { usePortalStore, useThemeStore } from "@stores";
import { useScrollStore } from "@stores/scrollStore";
import ContactForm from "./ContactForm";

const ContactButton = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isPortalActive = usePortalStore((state) => !!state.activePortalId);
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const color = useThemeStore((state) => state.theme.color);
  const { progress } = useProgress();

  const [loaded, setLoaded] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const check = () => setIsMobileViewport(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setLoaded(progress === 100);
  }, [progress]);

  useEffect(() => {
    if (loaded && wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        duration: 1.5,
        delay: 1.5,
        right: isMobileViewport ? 12 : 24,
        opacity: 1,
        ease: "power2.out",
        onComplete: () => setStartAnimation(true),
      });
    }
  }, [loaded, isMobileViewport]);

  useEffect(() => {
    if (isPortalActive) return;
    if (startAnimation && wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        right: (isMobileViewport ? 12 : 24) - scrollProgress * 600,
        duration: 0,
        ease: "power2.out",
      });
    }

    return () => {
      gsap.killTweensOf(wrapperRef.current);
    };
  }, [startAnimation, scrollProgress, isMobileViewport]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (isPortalActive) {
      gsap.to(wrapperRef.current, { opacity: 0, duration: 0.4 });
    } else if (loaded) {
      gsap.to(wrapperRef.current, {
        opacity: 1,
        duration: 0.6,
        delay: 0.4,
      });
    }
  }, [isPortalActive, loaded]);

  return (
    <>
      <div
        ref={wrapperRef}
        aria-hidden={open ? "true" : "false"}
        style={{
          position: "fixed",
          zIndex: 999,
          top: "50%",
          right: -200,
          opacity: 0,
          transform: "translateY(-50%)",
          pointerEvents: open ? "none" : "auto",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open contact form"
          className="group flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg backdrop-blur-md border border-white/30 bg-black/30 hover:bg-black/50 transition-all hover:scale-105 active:scale-95"
          style={{
            fontFamily: "Vercetti, Arial, sans-serif",
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <span className="text-white text-xs sm:text-sm tracking-widest uppercase font-medium whitespace-nowrap">
            Contact me
          </span>
        </button>
      </div>

      <ContactForm open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ContactButton;
