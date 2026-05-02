import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Divider from "@/components/ui/Divider";
import Pill from "@/components/ui/Pill";
import Screen from "@/components/ui/Screen";
import Txt from "@/components/ui/Text";
import TopBar from "@/components/TopBar";
import { space, type } from "@/constants/typography";
import { ROLES, WEBSITE_URL } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function Home() {
  const colors = useColors();
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, []);

  const fade = useSharedValue(0);
  useEffect(() => {
    fade.value = withDelay(
      120,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
  }, [fade]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: (1 - fade.value) * 12 }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar />
      <Screen>
        <Animated.View style={fadeStyle}>
          <Txt variant="eyebrow" color="muted">
            Hi, I am
          </Txt>
          <Txt
            style={[type.displayLg, { color: colors.foreground, marginTop: space.sm }]}
          >
            Magdy
          </Txt>
          <Txt
            style={[
              type.displayLg,
              { color: colors.foreground, marginTop: -10 },
            ]}
          >
            Saber
          </Txt>

          <View style={styles.roleRow}>
            <View
              style={[styles.dot, { backgroundColor: colors.accent }]}
            />
            <Txt variant="meta" color="muted" style={{ letterSpacing: 1.5 }}>
              {ROLES[roleIdx]}
            </Txt>
          </View>

          <Txt variant="bodyLg" color="muted" style={styles.bio}>
            I design and build polished interfaces and AI-first products.
            Currently shipping career and HR tools at The Wise Cloud.
          </Txt>

          <View style={{ marginTop: space.xl }}>
            <Pill
              label="Open magdysaber.com"
              trailing="↗"
              onPress={() => {
                WebBrowser.openBrowserAsync(WEBSITE_URL).catch(() => {});
              }}
              fullWidth
            />
          </View>

          <Divider marginVertical={space.xxl} />

          <Txt variant="eyebrow" color="muted">
            Now
          </Txt>
          <Txt variant="title" style={{ marginTop: space.sm }}>
            Building Wise Hire & Magic Sourcing — AI-native HR tools used by
            small recruiting teams.
          </Txt>
        </Animated.View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: space.lg,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  bio: { marginTop: space.lg, maxWidth: 420 },
});
