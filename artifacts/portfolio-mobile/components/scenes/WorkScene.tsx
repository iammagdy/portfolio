import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import SafeCanvas from "@/three/SafeCanvas";
import Stars from "@/three/Stars";
import SceneLights from "@/three/SceneLights";
import MonogramHalo from "@/three/MonogramHalo";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/hooks/useAutoTheme";
import { WORK_TIMELINE } from "@/constants/data";

export default function WorkScene() {
  const colors = useColors();
  const { theme } = useTheme();
  const accent = theme === "dark" ? "#0690d4" : "#0a0a0a";

  return (
    <View style={styles.container}>
      <SafeCanvas
        style={styles.canvas}
        camera={{ position: [0, 0, 9], fov: 55 }}
        dpr={[1, 2]}
      >
        <SceneLights />
        {theme === "dark" && <Stars count={300} radius={40} />}
        <group position={[3, 3, -3]} scale={0.5}>
          <MonogramHalo accent={accent} />
        </group>
      </SafeCanvas>

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.top}>
          <Text style={[styles.kicker, { color: colors.foreground, opacity: 0.6 }]}>
            WORK · {WORK_TIMELINE.length}
          </Text>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: "Soria" }]}>
            timeline
          </Text>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {WORK_TIMELINE.map((entry, i) => (
            <TimelineRow
              key={`${entry.year}-${entry.title}`}
              year={entry.year}
              title={entry.title}
              subtitle={entry.subtitle}
              description={entry.description}
              isLatest={i === WORK_TIMELINE.length - 1}
              colors={colors}
              delay={i * 60}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

interface TimelineRowProps {
  year: string;
  title: string;
  subtitle?: string;
  description?: string;
  isLatest: boolean;
  colors: ReturnType<typeof useColors>;
  delay: number;
}

function TimelineRow({ year, title, subtitle, description, isLatest, colors, delay }: TimelineRowProps) {
  const opacity = useSharedValue(0);
  const x = useSharedValue(20);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    x.value = withDelay(delay, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
  }, [delay, opacity, x]);

  const glow = useSharedValue(0);
  React.useEffect(() => {
    if (isLatest) {
      glow.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      );
    }
  }, [isLatest, glow]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isLatest ? 1 + glow.value * 0.3 : 1 }],
    opacity: isLatest ? 0.8 + glow.value * 0.2 : 0.6,
  }));

  return (
    <Animated.View style={[styles.row, style]}>
      <View style={styles.gutter}>
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: isLatest ? "#4ade80" : colors.foreground },
            dotStyle,
          ]}
        />
        <View style={[styles.line, { backgroundColor: colors.foreground, opacity: 0.15 }]} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.year, { color: colors.foreground, opacity: 0.55, fontFamily: "Vercetti" }]}>
          {year}
        </Text>
        <Text style={[styles.rowTitle, { color: colors.foreground, fontFamily: "Vercetti" }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.foreground, opacity: 0.6 }]}>
            {subtitle}
          </Text>
        ) : null}
        {description ? (
          <Text style={[styles.desc, { color: colors.foreground, opacity: 0.7 }]}>
            {description}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { ...StyleSheet.absoluteFillObject },
  overlay: { flex: 1, paddingHorizontal: 28, paddingTop: 96 },
  top: { gap: 6, marginBottom: 18 },
  kicker: { fontSize: 11, letterSpacing: 3 },
  title: { fontSize: 36, lineHeight: 40 },
  list: { flex: 1 },
  listContent: { paddingBottom: 110 },
  row: { flexDirection: "row", paddingVertical: 10 },
  gutter: { width: 22, alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  line: { width: 1, flex: 1, marginTop: 4 },
  body: { flex: 1, paddingLeft: 6, paddingBottom: 6 },
  year: { fontSize: 11, letterSpacing: 2 },
  rowTitle: { fontSize: 15, marginTop: 2 },
  subtitle: { fontSize: 12, marginTop: 1 },
  desc: { fontSize: 12, marginTop: 4, lineHeight: 17 },
});
