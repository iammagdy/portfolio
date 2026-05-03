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
  nextTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themes: [...AvailableThemes],
      theme: getInitialTheme(),
      nextTheme: () => {
        const themes = get().themes;
        const activeThemeIndex = themes.findIndex((theme) => theme.type === get().theme.type);
        const nextThemeIndex = (activeThemeIndex + 1) % themes.length;
        const next = themes[nextThemeIndex];
        syncDocumentTheme(next);
        set(() => ({ theme: next }));
      },
    }),
    {
      name: "theme-storage",
      // Intentionally persist nothing: every fresh page load must
      // re-evaluate auto-by-time via the inline boot script in
      // index.html. Toggling only affects the current session.
      partialize: () => ({}) as Partial<ThemeStore>,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Mirror whatever the boot script painted onto <html data-theme>
        // so the in-memory store agrees with the rendered theme.
        const current = getInitialTheme();
        state.theme = current;
      },
    }
  )
);
