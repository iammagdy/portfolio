import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IntroScene from "@/components/scenes/IntroScene";
import ProjectsScene from "@/components/scenes/ProjectsScene";
import WorkScene from "@/components/scenes/WorkScene";
import ContactScene from "@/components/scenes/ContactScene";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/hooks/useAutoTheme";

const { width: W } = Dimensions.get("window");

const SCENES = [
  { key: "intro", label: "intro", Component: IntroScene },
  { key: "projects", label: "projects", Component: ProjectsScene },
  { key: "work", label: "work", Component: WorkScene },
  { key: "contact", label: "contact", Component: ContactScene },
];

export default function SceneSwiper() {
  const colors = useColors();
  const { theme, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const ref = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / W);
    if (i !== page) {
      setPage(i);
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const goTo = (i: number) => {
    ref.current?.scrollTo({ x: i * W, animated: true });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
        testID="scene-swiper"
      >
        {SCENES.map(({ key, Component }, i) => {
          const active = Math.abs(i - page) <= 1;
          return (
            <View key={key} style={[styles.page, { width: W }]}>
              {active ? <Component /> : null}
            </View>
          );
        })}
      </ScrollView>

      {page < SCENES.length - 1 ? (
        <View
          style={[styles.bottomHint, { paddingBottom: insets.bottom + 14 }]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.hintChip,
              {
                borderColor: colors.foreground + "33",
                backgroundColor: colors.background + "cc",
              },
            ]}
          >
            <Text
              style={[
                styles.hintText,
                { color: colors.foreground, opacity: 0.7 },
              ]}
            >
              swipe to explore  →
            </Text>
          </View>
        </View>
      ) : null}

      <View
        style={[styles.topBar, { paddingTop: insets.top + 10 }]}
        pointerEvents="box-none"
      >
        <View style={styles.dots}>
          {SCENES.map((s, i) => (
            <Pressable
              key={s.key}
              onPress={() => goTo(i)}
              hitSlop={10}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === page ? colors.foreground : "transparent",
                  borderColor: colors.foreground,
                  opacity: i === page ? 1 : 0.5,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.topRight}>
          <Text style={[styles.sceneLabel, { color: colors.foreground }]}>
            {String(page + 1).padStart(2, "0")} · {SCENES[page].label}
          </Text>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              toggle();
            }}
            hitSlop={10}
            style={[
              styles.themeBtn,
              { borderColor: colors.foreground + "55" },
            ]}
            testID="theme-toggle"
          >
            <Feather
              name={theme === "dark" ? "moon" : "sun"}
              size={15}
              color={colors.foreground}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  page: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dots: { flexDirection: "row", gap: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, borderWidth: 1 },
  topRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  sceneLabel: { fontSize: 10, letterSpacing: 2.5, opacity: 0.7 },
  themeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomHint: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  hintChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  hintText: { fontSize: 10, letterSpacing: 2.5 },
});
