import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface StarFieldProps {
  count?: number;
  height?: number;
  color?: string;
}

interface StarSpec {
  id: number;
  x: number;
  baseY: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
}

function Star({ spec, color }: { spec: StarSpec; color: string }) {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: spec.duration, easing: Easing.linear }),
      -1,
      false,
    );
  }, [t, spec.duration]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -t.value * spec.drift }],
    opacity: spec.opacity * (0.5 + 0.5 * Math.sin(t.value * Math.PI * 2)),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: spec.x,
          top: spec.baseY,
          width: spec.size,
          height: spec.size,
          borderRadius: spec.size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export default function StarField({ count = 40, height = 700, color = "#ffffff" }: StarFieldProps) {
  const width = Dimensions.get("window").width;

  const stars = useMemo<StarSpec[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      baseY: Math.random() * height,
      size: 1 + Math.random() * 2.2,
      opacity: 0.25 + Math.random() * 0.55,
      duration: 4000 + Math.random() * 5000,
      delay: Math.random() * 2000,
      drift: 30 + Math.random() * 70,
    }));
  }, [count, width, height]);

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}>
      {stars.map((s) => (
        <Star key={s.id} spec={s} color={color} />
      ))}
    </View>
  );
}
