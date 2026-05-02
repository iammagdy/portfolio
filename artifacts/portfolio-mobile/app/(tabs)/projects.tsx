import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Divider from "@/components/ui/Divider";
import Screen from "@/components/ui/Screen";
import Txt from "@/components/ui/Text";
import TopBar from "@/components/TopBar";
import ProjectSheet from "@/components/sheets/ProjectSheet";
import { space } from "@/constants/typography";
import { PROJECTS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function ProjectsRoute() {
  const colors = useColors();
  const [active, setActive] = useState<number | null>(null);

  const open = (i: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setActive(i);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar label="WORK · 2024 — 2026" />
      <Screen>
        <Txt variant="eyebrow" color="muted">
          Selected projects
        </Txt>
        <Txt variant="headline" style={{ marginTop: space.sm }}>
          Things I have built.
        </Txt>
        <Txt variant="body" color="muted" style={{ marginTop: space.md }}>
          Tap any project for the full story.
        </Txt>

        <View style={{ marginTop: space.xl }}>
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
                      {p.date}
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
        </View>
      </Screen>

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
