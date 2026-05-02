import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";
type Override = ThemeMode | null;

const STORAGE_KEY = "theme-override";

function autoFromHour(): ThemeMode {
  const h = new Date().getHours();
  return h >= 18 || h < 6 ? "dark" : "light";
}

interface ThemeContextValue {
  theme: ThemeMode;
  override: Override;
  setOverride: (next: Override) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ProviderProps) {
  const [override, setOverrideState] = useState<Override>(null);
  const [auto, setAuto] = useState<ThemeMode>(autoFromHour());

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (cancelled) return;
        if (val === "light" || val === "dark") setOverrideState(val);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setAuto(autoFromHour()), 60_000);
    return () => clearInterval(id);
  }, []);

  const setOverride = useCallback((next: Override) => {
    setOverrideState(next);
    if (next == null) AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    else AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const theme: ThemeMode = override ?? auto;

  const toggle = useCallback(() => {
    setOverride(theme === "dark" ? "light" : "dark");
  }, [theme, setOverride]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, override, setOverride, toggle }),
    [theme, override, setOverride, toggle],
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: autoFromHour(),
      override: null,
      setOverride: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}
