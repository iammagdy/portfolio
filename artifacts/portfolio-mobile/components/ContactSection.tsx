import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/hooks/useAutoTheme";
import { useScrollCtx } from "@/hooks/useScrollContext";
import { CONTACT_LINKS } from "@/constants/data";

function fireSectionHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const ICON_MAP: Record<string, FeatherIconName> = {
  globe: "globe",
  linkedin: "linkedin",
  github: "github",
  mail: "mail",
};

interface LinkButtonProps {
  item: typeof CONTACT_LINKS[number];
}

function LinkButton({ item }: LinkButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const ripple = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const rippleStyle = useAnimatedStyle(() => ({
    opacity: ripple.value > 0 ? 1 - ripple.value : 0,
    transform: [{ scale: 0.85 + ripple.value * 0.5 }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 14 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14 });
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ripple.value = 0;
    ripple.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    try {
      if (item.url.startsWith("mailto:")) {
        await Linking.openURL(item.url);
      } else {
        await WebBrowser.openBrowserAsync(item.url);
      }
    } catch {}
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      testID={`contact-link-${item.name}`}
    >
      <Animated.View
        style={[
          styles.linkCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          cardStyle,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.foreground,
            },
            rippleStyle,
          ]}
        />
        <Feather name={ICON_MAP[item.icon] ?? "link"} size={20} color={colors.foreground} />
        <Text style={[styles.linkName, { color: colors.foreground, fontFamily: "Vercetti" }]}>{item.name}</Text>
        <Feather name="arrow-up-right" size={14} color={colors.mutedForeground} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ContactSection() {
  const colors = useColors();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const float = useSharedValue(0);
  const [layoutY, setLayoutY] = useState(0);
  const { scrollY, viewportHeight } = useScrollCtx();

  const onLayout = (e: LayoutChangeEvent) => setLayoutY(e.nativeEvent.layout.y);

  useAnimatedReaction(
    () => scrollY.value + viewportHeight.value * 0.75 > layoutY,
    (entered, prev) => {
      if (entered && !prev) runOnJS(fireSectionHaptic)();
    },
    [layoutY],
  );

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [float]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 + float.value * -6 }],
    opacity: 0.7 + float.value * 0.3,
  }));

  return (
    <View style={[styles.container, { borderTopColor: colors.border, paddingBottom: bottomPad + 40 }]} onLayout={onLayout}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>CONTACT</Text>
        <Animated.View style={floatStyle}>
          <Feather name={theme === "dark" ? "moon" : "sun"} size={18} color={colors.foreground} />
        </Animated.View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Soria" }]}>
        Let's{"\n"}Connect
      </Text>

      <Text style={[styles.sub, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>
        Open to opportunities, collaborations, and good conversations.
      </Text>

      <View style={styles.links}>
        {CONTACT_LINKS.map((item) => (
          <LinkButton key={item.name} item={item} />
        ))}
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>
          © 2026 Magdy Saber
        </Text>
        <Text style={[styles.footerText, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>
          Made with AI
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 40,
    paddingHorizontal: 28,
    gap: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    letterSpacing: 3,
  },
  sectionTitle: {
    fontSize: 40,
    lineHeight: 44,
  },
  sub: {
    fontSize: 14,
    lineHeight: 22,
  },
  links: {
    gap: 10,
    marginTop: 8,
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
    overflow: "hidden",
  },
  linkName: {
    flex: 1,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    letterSpacing: 1,
  },
});
