import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Theme {
  type: string;
  color: string;
}

const AvailableThemes: Theme[] = [{
  type: 'light',
  color: '#0690d4'
}, {
  type: 'dark',
  color: '#111'
}];

const getInitialTheme = (): Theme => {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    const found = AvailableThemes.find((t) => t.type === attr);
    if (found) return found;
  }
  return AvailableThemes[0];
};

const syncDocumentTheme = (theme: Theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme.type);
  }
};

interface ThemeStore {
  themes: Theme[];
  theme: Theme;
  userOverride: boolean;
  nextTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themes: [...AvailableThemes],
      theme: getInitialTheme(),
      userOverride: false,
      nextTheme: () => {
        const themes = get().themes;
        const activeThemeIndex = themes.findIndex((theme) => theme.type === get().theme.type);
        const nextThemeIndex = (activeThemeIndex + 1) % themes.length;
        const next = themes[nextThemeIndex];
        syncDocumentTheme(next);
        set(() => ({ theme: next, userOverride: true }));
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ theme: state.theme, userOverride: state.userOverride }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) syncDocumentTheme(state.theme);
      },
    }
  )
);
