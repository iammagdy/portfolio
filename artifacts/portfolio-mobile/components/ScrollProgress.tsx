import React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useScrollCtx } from "@/hooks/useScrollContext";

export default function ScrollProgress() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { scrollY, contentHeight, viewportHeight } = useScrollCtx();

  const style = useAnimatedStyle(() => {
    const max = Math.max(1, contentHeight.value - viewportHeight.value);
    const ratio = Math.min(1, Math.max(0, scrollY.value / max));
    return { width: `${ratio * 100}%` };
  });

  const top = Platform.OS === "web" ? 0 : insets.top;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bar,
        { top, backgroundColor: colors.foreground },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    height: 2,
    zIndex: 100,
  },
});
