import React, { createContext, useContext, useMemo } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";

interface ScrollContextValue {
  scrollY: SharedValue<number>;
  contentHeight: SharedValue<number>;
  viewportHeight: SharedValue<number>;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

export function ScrollProvider({ children }: ProviderProps) {
  const scrollY = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const viewportHeight = useSharedValue(1);

  const value = useMemo(
    () => ({ scrollY, contentHeight, viewportHeight }),
    [scrollY, contentHeight, viewportHeight],
  );

  return React.createElement(ScrollContext.Provider, { value }, children);
}

export function useScrollCtx(): ScrollContextValue {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollCtx must be used inside ScrollProvider");
  return ctx;
}
