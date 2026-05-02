import { useEffect, useState } from "react";

import { WORK_TIMELINE } from "@constants";
import { usePortalStore } from "@stores";

const MobileWorkOverlay = () => {
  const [isMobile, setIsMobile] = useState(false);
  const isActive = usePortalStore((s) => s.activePortalId === "work");

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!isMobile || !isActive) return null;

  return (
    <div className="fixed inset-0 z-[5] flex flex-col pointer-events-none">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] pointer-events-auto" />
      <div className="relative flex-1 overflow-y-auto px-4 pt-20 pb-10 pointer-events-auto">
        <h2 className="font-soria text-white text-2xl text-center mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          Work &amp; Education
        </h2>
        <p className="font-vercetti text-white/70 text-[11px] text-center mb-6 tracking-wider">
          {WORK_TIMELINE.length} ROLES · 2008 — 2026
        </p>

        <div className="relative max-w-md mx-auto">
          {/* Vertical timeline rail */}
          <div
            aria-hidden
            className="absolute left-4 top-2 bottom-2 w-px bg-white/40"
          />

          <ol className="flex flex-col gap-3">
            {WORK_TIMELINE.map((entry, i) => (
              <li
                key={`${entry.year}-${i}`}
                className="relative pl-10"
              >
                {/* Dot on the rail */}
                <span
                  aria-hidden
                  className="absolute left-[11px] top-4 w-[10px] h-[10px] border border-white bg-black"
                />
                <div className="bg-white/95 border border-black/80 rounded-sm p-3 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                  <span className="inline-block font-vercetti text-[10px] tracking-wider border border-black/70 px-2 py-0.5 text-black">
                    {entry.year}
                  </span>
                  <h3 className="font-soria text-black text-base leading-tight mt-2">
                    {entry.title}
                  </h3>
                  {entry.subtitle && (
                    <p className="font-vercetti text-black/70 text-[11px] mt-1 tracking-wide">
                      {entry.subtitle}
                    </p>
                  )}
                  {entry.description && (
                    <p className="font-vercetti text-black/80 text-[11px] leading-snug mt-2">
                      {entry.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="font-vercetti text-white/60 text-[11px] text-center mt-6 drop-shadow">
          Tap × to close
        </p>
      </div>
    </div>
  );
};

export default MobileWorkOverlay;
