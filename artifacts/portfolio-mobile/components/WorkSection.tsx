import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { useScrollCtx } from "@/hooks/useScrollContext";
import { WORK_TIMELINE } from "@/constants/data";

function fireSectionHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export default function WorkSection() {
  const colors = useColors();
  const [layoutY, setLayoutY] = useState(0);
  const reveal = useSharedValue(0);
  const lineDraw = useSharedValue(0);
  const { scrollY, viewportHeight } = useScrollCtx();

  const onLayout = (e: LayoutChangeEvent) => setLayoutY(e.nativeEvent.layout.y);

  useAnimatedReaction(
    () => scrollY.value + viewportHeight.value * 0.75 > layoutY,
    (entered, prev) => {
      if (entered && !prev) {
        reveal.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
        lineDraw.value = withTiming(1, { duration: 1400, easing: Easing.out(Easing.cubic) });
        runOnJS(fireSectionHaptic)();
      }
    },
    [layoutY],
  );

  const labelStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateX: (1 - reveal.value) * -40 }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: (1 - reveal.value) * 30 }],
  }));

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]} onLayout={onLayout}>
      <Animated.Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Vercetti" }, labelStyle]}>
        WORK & EDUCATION
      </Animated.Text>

      <Animated.Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Soria" }, titleStyle]}>
        Experience{"\n"}Timeline
      </Animated.Text>

      <View style={styles.timeline}>
        {WORK_TIMELINE.map((entry, index) => (
          <TimelineItem
            key={index}
            entry={entry}
            index={index}
            isLast={index === WORK_TIMELINE.length - 1}
            isMostRecent={index === WORK_TIMELINE.length - 1}
            reveal={reveal}
            lineDraw={lineDraw}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
}

interface TimelineItemProps {
  entry: { year: string; title: string; subtitle?: string; description?: string };
  index: number;
  isLast: boolean;
  isMostRecent: boolean;
  reveal: ReturnType<typeof useSharedValue<number>>;
  lineDraw: ReturnType<typeof useSharedValue<number>>;
  colors: ReturnType<typeof useColors>;
}

function TimelineItem({ entry, index, isLast, isMostRecent, reveal, lineDraw, colors }: TimelineItemProps) {
  const dotScale = useSharedValue(0);
  const glow = useSharedValue(1);

  useAnimatedReaction(
    () => reveal.value,
    (val, prev) => {
      if (val > 0.05 && (prev ?? 0) <= 0.05) {
        dotScale.value = withDelay(index * 80, withSpring(1, { damping: 12, stiffness: 180 }));
      }
    },
  );

  useEffect(() => {
    if (isMostRecent) {
      glow.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      );
    }
  }, [glow, isMostRecent]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: isMostRecent ? glow.value : 1,
  }));

  const rowStyle = useAnimatedStyle(() => ({
    opacity: dotScale.value,
    transform: [{ translateY: (1 - dotScale.value) * 8 }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: lineDraw.value }],
  }));

  return (
    <View style={styles.itemRow}>
      <View style={styles.leftCol}>
        <Animated.Text style={[styles.year, { color: colors.mutedForeground, fontFamily: "Vercetti" }, rowStyle]}>
          {entry.year}
        </Animated.Text>
      </View>

      <View style={styles.lineCol}>
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: isLast ? colors.foreground : colors.border, borderColor: colors.foreground },
            dotStyle,
          ]}
        />
        {!isLast && (
          <Animated.View style={[styles.line, { backgroundColor: colors.border }, lineStyle]} />
        )}
      </View>

      <Animated.View style={[styles.rightCol, rowStyle]}>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: "Vercetti" }]}>{entry.title}</Text>
        {entry.subtitle ? (
          <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>{entry.subtitle}</Text>
        ) : null}
        {entry.description ? (
          <Text style={[styles.description, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>{entry.description}</Text>
        ) : null}
        {!isLast && <View style={{ height: 24 }} />}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 28,
    gap: 16,
  },
  label: {
    fontSize: 11,
    letterSpacing: 3,
  },
  sectionTitle: {
    fontSize: 40,
    lineHeight: 44,
  },
  timeline: {
    marginTop: 12,
  },
  itemRow: {
    flexDirection: "row",
  },
  leftCol: {
    width: 80,
    paddingTop: 2,
  },
  year: {
    fontSize: 11,
    letterSpacing: 1,
    textAlign: "right",
    paddingRight: 12,
  },
  lineCol: {
    width: 20,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    marginTop: 4,
  },
  line: {
    width: 1,
    flex: 1,
    marginTop: 4,
    transformOrigin: "top",
  },
  rightCol: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
});
