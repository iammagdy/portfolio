import * as Haptics from "expo-haptics";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Pill from "@/components/ui/Pill";
import Txt from "@/components/ui/Text";
import { space } from "@/constants/typography";
import type { Project } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const { height: H } = Dimensions.get("window");
const SHEET_HEIGHT = Math.min(H * 0.78, 720);

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectSheet({ project, onClose }: Props) {
  const colors = useColors();
  const open = project != null;
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<Project | null>(null);

  const ty = useSharedValue(SHEET_HEIGHT);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (open && project) {
      setContent(project);
      setMounted(true);
    }
  }, [open, project]);

  useEffect(() => {
    if (!mounted) return;
    if (open) {
      ty.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) });
      backdrop.value = withTiming(1, { duration: 220 });
    }
  }, [mounted, open, ty, backdrop]);

  const finishClose = () => {
    setMounted(false);
    setContent(null);
  };

  const animateClose = () => {
    backdrop.value = withTiming(0, { duration: 200 });
    ty.value = withTiming(
      SHEET_HEIGHT,
      { duration: 240, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(finishClose)();
      },
    );
  };

  const close = () => {
    Haptics.selectionAsync().catch(() => {});
    animateClose();
    onClose();
  };

  const dismiss = Gesture.Pan()
    .onChange((e) => {
      if (e.translationY > 0) ty.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 110 || e.velocityY > 700) {
        backdrop.value = withTiming(0, { duration: 200 });
        ty.value = withTiming(SHEET_HEIGHT, { duration: 200 }, (finished) => {
          if (finished) {
            runOnJS(onClose)();
            runOnJS(finishClose)();
          }
        });
      } else {
        ty.value = withTiming(0, { duration: 220 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value * 0.6,
  }));

  const gradient = useMemo<[string, string]>(() => {
    const c = content?.color ?? colors.accent;
    return [c, shade(c, -40)];
  }, [content, colors.accent]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={close}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} />
        </Pressable>

        <GestureDetector gesture={dismiss}>
          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                height: SHEET_HEIGHT,
              },
              sheetStyle,
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.muted }]} />
            {content ? (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
              >
                {content.image ? (
                  <ExpoImage
                    source={{ uri: content.image }}
                    style={styles.cover}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cover}
                  />
                )}
                <Txt variant="eyebrow" color="muted" style={{ marginTop: space.lg }}>
                  {content.date} · {content.role}
                </Txt>
                <Txt variant="headline" style={{ marginTop: space.xs }}>
                  {content.title}
                </Txt>

                <View style={styles.tags}>
                  {content.tags.map((t) => (
                    <View
                      key={t}
                      style={[
                        styles.tag,
                        {
                          borderColor: colors.border,
                          backgroundColor: colors.surface,
                        },
                      ]}
                    >
                      <Txt
                        variant="meta"
                        style={{ color: colors.foreground, letterSpacing: 1 }}
                      >
                        {t}
                      </Txt>
                    </View>
                  ))}
                </View>

                <Txt variant="bodyLg" color="muted" style={{ marginTop: space.md }}>
                  {content.subtext}
                </Txt>

                <View style={styles.actions}>
                  {content.urls.map((u, i) => (
                    <Pill
                      key={u.text + i}
                      label={u.text}
                      trailing="↗"
                      variant={i === 0 ? "primary" : "outline"}
                      disabled={!!u.disabled || !u.url}
                      onPress={() => {
                        if (u.url) WebBrowser.openBrowserAsync(u.url).catch(() => {});
                      }}
                    />
                  ))}
                </View>
              </ScrollView>
            ) : null}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

function shade(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0xff) + amount;
  let b = (num & 0xff) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: "#000" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    overflow: "hidden",
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    opacity: 0.4,
  },
  body: { paddingHorizontal: 28, paddingBottom: 56 },
  cover: { width: "100%", aspectRatio: 16 / 10, borderRadius: 14, marginTop: space.lg },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: space.md,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  actions: { gap: 10, marginTop: space.xl },
});
