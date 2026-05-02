import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import {
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colorTokens from "@/constants/colors";
import { WEBSITE_URL } from "@/constants/data";
import { useTheme } from "@/hooks/useAutoTheme";
import { useColors } from "@/hooks/useColors";
import { useScrollCtx } from "@/hooks/useScrollContext";
import StarField from "./StarField";

export default function HeroSection() {
  const colors = useColors();
  const { theme, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const { scrollY } = useScrollCtx();

  const intro = useSharedValue(0);
  const intro2 = useSharedValue(0);

  useEffect(() => {
    intro.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    intro2.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [intro, intro2]);

  const introStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ translateY: (1 - intro.value) * 30 - scrollY.value * 0.4 }],
  }));

  const intro2Style = useAnimatedStyle(() => ({
    opacity: intro2.value * interpolate(scrollY.value, [0, 300], [1, 0], "clamp"),
    transform: [{ translateY: (1 - intro2.value) * 30 - scrollY.value * 0.25 }],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 200, 350], [1, 0.6, 0], "clamp"),
    transform: [{ translateY: -scrollY.value * 0.15 }],
  }));

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleOpenSite = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await WebBrowser.openBrowserAsync(WEBSITE_URL);
    } catch {}
  };

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({ message: `Magdy Saber — ${WEBSITE_URL}`, url: WEBSITE_URL });
    } catch {}
  };

  const handleToggleTheme = async () => {
    await Haptics.selectionAsync();
    toggle();
  };

  const starColor = theme === "dark" ? "#ffffff" : "rgba(255,255,255,0.85)";

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 40 }]}>
      <StarField count={36} height={620} color={starColor} />

      <TouchableOpacity
        onPress={handleToggleTheme}
        style={[styles.themeBtn, { borderColor: colors.border, backgroundColor: colors.card, top: topPad + 12 }]}
        accessibilityLabel="Toggle theme"
        testID="theme-toggle"
      >
        <Feather name={theme === "dark" ? "sun" : "moon"} size={16} color={colors.foreground} />
      </TouchableOpacity>

      <View style={styles.inner}>
        <Animated.View style={introStyle}>
          <Text style={[styles.greeting, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>Hi, I am</Text>
          <Text style={[styles.name, { color: colors.foreground, fontFamily: "Soria" }]}>Magdy{"\n"}Saber</Text>
        </Animated.View>

        <Animated.View style={[styles.taglineContainer, intro2Style]}>
          <Text style={[styles.tagline, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>FRONTEND ENGINEER</Text>
          <Text style={[styles.divider, { color: colors.border }]}>·</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>DESIGNER</Text>
          <Text style={[styles.divider, { color: colors.border }]}>·</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>DEVELOPER</Text>
        </Animated.View>

        <Animated.View style={pillStyle}>
          <View style={[styles.pill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.dot, { backgroundColor: colorTokens.online }]} />
            <Text style={[styles.pillText, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>
              AI Product Engineer — 2026
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.ctaRow, pillStyle]}>
          <TouchableOpacity
            onPress={handleOpenSite}
            activeOpacity={0.8}
            style={[styles.ctaPrimary, { backgroundColor: colors.foreground }]}
            testID="hero-open-site"
          >
            <Text style={[styles.ctaPrimaryText, { color: colors.background, fontFamily: "Vercetti" }]}>
              OPEN MAGDYSABER.COM ↗
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.7}
            style={[styles.ctaIcon, { borderColor: colors.border, backgroundColor: colors.card }]}
            accessibilityLabel="Share website"
            testID="hero-share"
          >
            <Feather name="share-2" size={16} color={colors.foreground} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={[styles.scrollHint, { borderTopColor: colors.border }]}>
        <Text style={[styles.scrollText, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>SCROLL TO EXPLORE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 620,
    justifyContent: "space-between",
    paddingBottom: 40,
    paddingHorizontal: 28,
    overflow: "hidden",
  },
  inner: {
    gap: 20,
  },
  themeBtn: {
    position: "absolute",
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  greeting: {
    fontSize: 15,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  name: {
    fontSize: 62,
    lineHeight: 66,
    letterSpacing: -2,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 2,
  },
  divider: {
    fontSize: 11,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  ctaPrimary: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 100,
  },
  ctaPrimaryText: {
    fontSize: 11,
    letterSpacing: 2,
  },
  ctaIcon: {
    width: 42,
    height: 42,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollHint: {
    borderTopWidth: 1,
    paddingTop: 16,
    alignSelf: "stretch",
    marginTop: 24,
  },
  scrollText: {
    fontSize: 10,
    letterSpacing: 3,
  },
});
