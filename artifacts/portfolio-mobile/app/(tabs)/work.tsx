import React from "react";
import { StyleSheet, View } from "react-native";
import Screen from "@/components/ui/Screen";
import Txt from "@/components/ui/Text";
import TopBar from "@/components/TopBar";
import { space } from "@/constants/typography";
import { WORK_TIMELINE } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function JourneyRoute() {
  const colors = useColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar label="JOURNEY · 2008 — 2026" />
      <Screen>
        <Txt variant="eyebrow" color="muted">
          Career path
        </Txt>
        <Txt variant="headline" style={{ marginTop: space.sm }}>
          From support desk to AI product.
        </Txt>

        <View style={{ marginTop: space.xxl }}>
          {WORK_TIMELINE.map((entry, i) => {
            const latest = i === WORK_TIMELINE.length - 1;
            return (
              <View key={entry.year + entry.title} style={styles.row}>
                <View style={styles.left}>
                  <Txt
                    variant="meta"
                    style={{
                      color: latest ? colors.accent : colors.muted,
                      letterSpacing: 1.5,
                    }}
                  >
                    {entry.year}
                  </Txt>
                </View>

                <View style={styles.rail}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: latest ? colors.accent : colors.muted,
                        opacity: latest ? 1 : 0.5,
                      },
                    ]}
                  />
                  {!latest && (
                    <View
                      style={[styles.line, { backgroundColor: colors.border }]}
                    />
                  )}
                </View>

                <View style={styles.right}>
                  <Txt style={[styles.title, { color: colors.foreground }]}>
                    {entry.title}
                  </Txt>
                  {entry.subtitle ? (
                    <Txt variant="meta" color="muted" style={{ marginTop: 4 }}>
                      {entry.subtitle}
                    </Txt>
                  ) : null}
                  {entry.description ? (
                    <Txt
                      variant="body"
                      color="muted"
                      style={{ marginTop: space.sm }}
                    >
                      {entry.description}
                    </Txt>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", paddingBottom: space.xl },
  left: { width: 70 },
  rail: { width: 18, alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  line: { width: 1, flex: 1, marginTop: 4 },
  right: { flex: 1 },
  title: { fontFamily: "Soria", fontSize: 22, lineHeight: 26 },
});
