// import "react-crud-icons/dist/react-crud-icons.css";

import { useGSAP } from "@gsap/react";
import { usePortalStore, useThemeStore } from "@stores";
import gsap from "gsap";

import { useEffect, useRef } from "react";

const ThemeSwitcher = () => {
  const themeSwitcherRef = useRef<HTMLDivElement>(null);
  const { nextTheme, theme } = useThemeStore();
  const isActive = usePortalStore((state) => state.activePortalId);
  const toggleTheme = () => nextTheme();

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
          className="hover:cursor-pointer p-1 -m-1 rounded-md hover:bg-white/10 transition"
        >
          <img
            src="icons/night-mode.svg"
            width={24}
            height={24}
            alt=""
            loading="lazy"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
