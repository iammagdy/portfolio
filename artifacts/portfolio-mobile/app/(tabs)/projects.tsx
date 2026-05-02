import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Divider from "@/components/ui/Divider";
import Txt from "@/components/ui/Text";
import TopBar from "@/components/TopBar";
import ProjectSheet from "@/components/sheets/ProjectSheet";
import { space } from "@/constants/typography";
import { PROJECTS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function ProjectsRoute() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const listOpacity = useSharedValue(1);

  const open = (i: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setActive(i);
  };

  const onRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setRefreshing(true);
    listOpacity.value = withTiming(0.4, { duration: 200 });
    setTimeout(() => {
      listOpacity.value = withTiming(1, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      });
      setRefreshing(false);
    }, 700);
  }, [listOpacity]);

  useEffect(() => {
    listOpacity.value = 1;
  }, [listOpacity]);

  const listStyle = useAnimatedStyle(() => ({ opacity: listOpacity.value }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar label="PROJECTS · 2024 — 2026" />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingHorizontal: 28,
          paddingTop: space.xl,
          paddingBottom: insets.bottom + 96,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.muted}
            colors={[colors.accent]}
          />
        }
      >
        <Txt variant="eyebrow" color="muted">
          Selected work · {PROJECTS.length}
        </Txt>
        <Txt variant="headline" style={{ marginTop: space.sm }}>
          Things I have built.
        </Txt>
        <Txt variant="body" color="muted" style={{ marginTop: space.md }}>
          Pull down to refresh. Tap any row to open.
        </Txt>

        <Animated.View style={[{ marginTop: space.xl }, listStyle]}>
          {PROJECTS.map((p, i) => (
            <View key={p.title}>
              <Pressable
                onPress={() => open(i)}
                style={({ pressed }) => [
                  styles.row,
                  { opacity: pressed ? 0.55 : 1 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Txt
                    style={[
                      styles.title,
                      { color: colors.foreground },
                    ]}
                  >
                    {p.title}
                  </Txt>
                  <View style={styles.metaRow}>
                    <View
                      style={[
                        styles.swatch,
                        { backgroundColor: p.color },
                      ]}
                    />
                    <Txt variant="meta" color="muted" style={styles.meta}>
                      {p.date} · {p.role}
                    </Txt>
                  </View>
                </View>
                <Txt
                  variant="body"
                  color="muted"
                  style={{ marginLeft: space.md }}
                >
                  ↗
                </Txt>
              </Pressable>
              {i < PROJECTS.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <ProjectSheet
        project={active != null ? PROJECTS[active] : null}
        onClose={() => setActive(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: space.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Soria",
    fontSize: 30,
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  swatch: { width: 6, height: 6, borderRadius: 3 },
  meta: { letterSpacing: 1.5 },
});
