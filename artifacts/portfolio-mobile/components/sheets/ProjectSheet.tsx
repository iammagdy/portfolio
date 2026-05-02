import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import type { Project } from "@/constants/data";

const { height: H } = Dimensions.get("window");

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectSheet({ project, onClose }: Props) {
  const colors = useColors();
  const open = useSharedValue(0);

  useEffect(() => {
    open.value = withTiming(project ? 1 : 0, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [project, open]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - open.value) * H }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: open.value * 0.6,
  }));

  const close = () => {
    Haptics.selectionAsync().catch(() => {});
    open.value = withTiming(0, { duration: 240 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  const visible = project != null;

  return (
    <View
      pointerEvents={visible ? "auto" : "none"}
      style={StyleSheet.absoluteFill}
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: colors.background, borderColor: colors.foreground + "33" },
          sheetStyle,
        ]}
      >
        <View style={styles.handle} />
        {project ? (
          <View style={styles.body}>
            <View
              style={[
                styles.cover,
                { backgroundColor: project.color ?? "#0690d4" },
              ]}
            />
            <Text style={[styles.title, { color: colors.foreground, fontFamily: "Soria" }]}>
              {project.title}
            </Text>
            <Text style={[styles.date, { color: colors.foreground, opacity: 0.55 }]}>
              {project.date}
            </Text>
            <Text style={[styles.desc, { color: colors.foreground, opacity: 0.85 }]}>
              {project.subtext}
            </Text>
            <View style={styles.links}>
              {project.urls.map((u) => (
                <Pressable
                  key={u.text}
                  disabled={u.disabled || !u.url}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    if (u.url) WebBrowser.openBrowserAsync(u.url).catch(() => {});
                  }}
                  style={({ pressed }) => [
                    styles.linkBtn,
                    {
                      borderColor: colors.foreground,
                      opacity: u.disabled || !u.url ? 0.4 : pressed ? 0.7 : 1,
                      backgroundColor: pressed ? colors.foreground : "transparent",
                    },
                  ]}
                >
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.linkText,
                        {
                          color: pressed ? colors.background : colors.foreground,
                          fontFamily: "Vercetti",
                        },
                      ]}
                    >
                      {u.text}
                      {u.disabled || !u.url ? "  ·  soon" : "  ↗"}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>

            <Pressable onPress={close} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: colors.foreground, opacity: 0.7 }]}>
                close
              </Text>
            </Pressable>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: "#000" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: H * 0.55,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginBottom: 18,
  },
  body: { gap: 10 },
  cover: { height: 140, borderRadius: 18, marginBottom: 8, opacity: 0.85 },
  title: { fontSize: 32, lineHeight: 36 },
  date: { fontSize: 12, letterSpacing: 2 },
  desc: { fontSize: 14, lineHeight: 21, marginTop: 6 },
  links: { flexDirection: "row", gap: 10, marginTop: 18, flexWrap: "wrap" },
  linkBtn: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  linkText: { fontSize: 12, letterSpacing: 1.8 },
  closeBtn: { alignSelf: "center", marginTop: 22, padding: 8 },
  closeText: { fontSize: 11, letterSpacing: 3 },
});
