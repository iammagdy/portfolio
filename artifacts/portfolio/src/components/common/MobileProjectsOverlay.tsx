import { useEffect, useMemo, useState } from "react";

import { PROJECTS } from "@constants";
import { usePortalStore } from "@stores";
import { Project, ProjectUrl } from "@types";
import { useIsMobileDOM } from "../../hooks/useBreakpoint";
import { track } from "../../lib/devkitTracker";

const buildButtons = (project: Project): ProjectUrl[] => {
  if (project.urls && project.urls.length > 0) return project.urls;
  if (project.url) return [{ text: "VIEW ↗", url: project.url }];
  return [];
};

const stripArrow = (text: string) => text.replace(/\s*↗\s*$/, "");

const MobileProjectsOverlay = () => {
  const isMobile = useIsMobileDOM();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const isActive = usePortalStore((s) => s.activePortalId === "projects");

  useEffect(() => {
    if (!isActive) setActiveProject(null);
  }, [isActive]);

  // Lock body scroll for the entire time the projects overlay is open so
  // swipes inside the grid don't leak through to the page underneath.
  useEffect(() => {
    if (!isActive) return;
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "contain";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [isActive]);

  // Escape closes the project detail modal (keeps focus on the overlay).
  useEffect(() => {
    if (!activeProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeProject]);

  const projectsNewestFirst = useMemo(() => [...PROJECTS].reverse(), []);

  if (!isMobile || !isActive) return null;

  const modalButtons = activeProject ? buildButtons(activeProject) : [];

  return (
    <>
      <div className="fixed inset-0 z-[5] flex flex-col pointer-events-none">
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] pointer-events-auto" />
        <div className="relative flex-1 overflow-y-auto px-4 pt-20 pb-8 pointer-events-auto">
          <h2 className="font-soria text-white text-2xl text-center mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Side Projects
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {projectsNewestFirst.map((project, i) => (
              <button
                type="button"
                key={`${project.title}-${i}`}
                onClick={() => setActiveProject(project)}
                className="text-left bg-white/95 border border-black/80 rounded-sm p-3 flex flex-col gap-2 active:scale-95 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.15)] min-h-[140px]"
              >
                <span className="inline-block self-start font-vercetti text-[10px] tracking-wider border border-black/70 px-2 py-0.5 text-black">
                  {project.date}
                </span>
                <h3 className="font-soria text-black text-base leading-tight">
                  {project.title}
                </h3>
                <p className="font-vercetti text-black/70 text-[10px] leading-snug line-clamp-3 mt-auto">
                  {project.subtext}
                </p>
              </button>
            ))}
          </div>
          <p className="font-vercetti text-white/70 text-[11px] text-center mt-5 drop-shadow">
            Tap a project for details
          </p>
        </div>
      </div>

      {activeProject && (
        <div
          className="fixed inset-0 z-[20] flex items-end justify-center pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label={activeProject.title}
        >
          <button
            type="button"
            aria-label="Close project details"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setActiveProject(null)}
          />
          <div className="relative bg-white border border-black w-full max-w-md max-h-[85vh] overflow-y-auto m-3 p-5 pt-12 z-10 rounded-sm shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              aria-label="Close"
              className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center text-black/60 hover:text-black text-2xl leading-none"
            >
              ×
            </button>
            <span className="inline-block font-vercetti text-[11px] tracking-wider border border-black/70 px-2 py-0.5 text-black">
              {activeProject.date}
            </span>
            <h3 className="font-soria text-black text-3xl leading-tight mt-3">
              {activeProject.title}
            </h3>
            <p className="font-vercetti text-black/80 text-sm leading-relaxed mt-3 whitespace-pre-line">
              {activeProject.subtext}
            </p>
            {modalButtons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {modalButtons.map((btn, j) => {
                  const disabled = !!btn.disabled || !btn.url;
                  const label = stripArrow(btn.text);
                  if (disabled) {
                    return (
                      <span
                        key={j}
                        className="font-vercetti text-xs tracking-wider px-3 py-2 border border-black/30 text-black/40 bg-black/5 select-none whitespace-nowrap"
                      >
                        {label} • SOON
                      </span>
                    );
                  }
                  return (
                    <a
                      key={j}
                      href={btn.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track({ kind: "click", target: `project:${activeProject.title}`, label: btn.text })}
                      className="font-vercetti text-xs tracking-wider px-3 py-2 bg-black text-white hover:opacity-90 transition active:scale-95 whitespace-nowrap"
                    >
                      {btn.text}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileProjectsOverlay;
