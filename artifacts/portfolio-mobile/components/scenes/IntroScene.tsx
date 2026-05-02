import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import SafeCanvas from "@/three/SafeCanvas";
import WindowModel from "@/three/WindowModel";
import Clouds from "@/three/Clouds";
import Stars from "@/three/Stars";
import SceneLights from "@/three/SceneLights";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/hooks/useAutoTheme";
import { ROLES, WEBSITE_URL } from "@/constants/data";

export default function IntroScene() {
  const colors = useColors();
  const { theme } = useTheme();
  const [roleIdx, setRoleIdx] = useState(0);
  const accent = theme === "dark" ? "#0690d4" : "#0a0a0a";

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, []);

  const titleY = useSharedValue(20);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    titleY.value = withTiming(0, { duration: 900, easing: Easing.out(Easing.cubic) });
    titleOpacity.value = withTiming(1, { duration: 900 });
  }, [titleY, titleOpacity]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [pulse]);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.04 }],
    opacity: 0.85 + pulse.value * 0.15,
  }));

  const openSite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    WebBrowser.openBrowserAsync(WEBSITE_URL).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <SafeCanvas
        style={styles.canvas}
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 2]}
      >
        <SceneLights />
        {theme === "dark" && <Stars count={500} radius={50} />}
        <Clouds count={6} color={theme === "dark" ? "#9ec5e8" : "#ffffff"} />
        <WindowModel accent={accent} base={theme === "dark" ? "#ededed" : "#0a0a0a"} />
      </SafeCanvas>

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.top}>
          <Text style={[styles.kicker, { color: colors.foreground, opacity: 0.6 }]}>
            HI, I AM
          </Text>
          <Animated.Text
            style={[
              styles.title,
              { color: colors.foreground, fontFamily: "Soria" },
              titleStyle,
            ]}
          >
            Magdy Saber
          </Animated.Text>
          <Text style={[styles.role, { color: colors.foreground, fontFamily: "Vercetti" }]}>
            {ROLES[roleIdx]}
          </Text>
        </View>

        <View style={styles.bottom}>
          <Animated.View style={pulseStyle}>
            <Pressable
              onPress={openSite}
              style={[
                styles.cta,
                {
                  backgroundColor: colors.foreground,
                  borderColor: colors.foreground,
                },
              ]}
              testID="intro-open-site"
            >
              <Text
                style={[
                  styles.ctaText,
                  { color: colors.background, fontFamily: "Vercetti" },
                ]}
              >
                OPEN MAGDYSABER.COM ↗
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { ...StyleSheet.absoluteFillObject },
  overlay: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 96,
    paddingBottom: 80,
    justifyContent: "space-between",
  },
  top: { gap: 8 },
  kicker: { fontSize: 11, letterSpacing: 3 },
  title: { fontSize: 64, lineHeight: 64, marginTop: 4 },
  role: { fontSize: 13, letterSpacing: 2.5, marginTop: 10, textTransform: "uppercase" },
  bottom: { alignItems: "flex-start", gap: 14 },
  cta: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 1,
  },
  ctaText: { fontSize: 12, letterSpacing: 2 },
});
