
import { useGSAP } from "@gsap/react";
import { usePortalStore, useThemeStore } from "@stores";
import gsap from "gsap";

import { useEffect, useRef } from "react";
import { track } from "../../lib/devkitTracker";

const ThemeSwitcher = () => {
  const themeSwitcherRef = useRef<HTMLDivElement>(null);
  const { nextTheme, theme } = useThemeStore();
  const isActive = usePortalStore((state) => state.activePortalId);
  const toggleTheme = () => {
    track({ kind: "theme_change", target: "theme_switcher", label: theme.color });
    nextTheme();
  };

  useGSAP(() => {
    gsap.to(themeSwitcherRef.current, {
      opacity: isActive ? 0 : 1,
      duration: 1,
      delay: isActive ? 0 : 1,
    });
  }, [isActive]);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme.color);
    }
  }, [theme.color]);

  return (
    <div
      className="fixed top-3 right-3 sm:top-6 sm:right-6"
      ref={themeSwitcherRef}
      style={{ opacity: 0, zIndex: 2 }}
    >
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch theme (current: ${theme.color})`}
          className="hover:cursor-pointer p-2 -m-2 rounded-lg hover:bg-white/10 transition"
        >
          <img
            src="icons/night-mode.svg"
            width={40}
            height={40}
            alt=""
            loading="lazy"
            className="w-9 h-9 sm:w-10 sm:h-10"
          />
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
