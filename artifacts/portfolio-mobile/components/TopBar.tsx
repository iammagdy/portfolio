import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Txt from "@/components/ui/Text";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/hooks/useAutoTheme";

const AnimatedFeather = Animated.createAnimatedComponent(Feather);

interface Props {
  label?: string;
}

export default function TopBar({ label = "MS" }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { theme, toggle } = useTheme();

  const iconRotate = useSharedValue(theme === "dark" ? 0 : 180);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    iconRotate.value = withTiming(theme === "dark" ? 0 : 180, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [theme, iconRotate]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${iconRotate.value}deg` },
      { scale: iconScale.value },
    ],
  }));

  const handlePress = () => {
    Haptics.selectionAsync().catch(() => {});
    iconScale.value = withTiming(0.7, { duration: 120 }, () => {
      iconScale.value = withTiming(1, { duration: 180 });
    });
    toggle();
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 12,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Txt variant="eyebrow" color="muted">
        {label}
      </Txt>
      <Pressable
        onPress={handlePress}
        hitSlop={12}
        style={[styles.themeBtn, { borderColor: colors.border }]}
        testID="theme-toggle"
      >
        <Animated.View style={iconStyle}>
          <AnimatedFeather
            name={theme === "dark" ? "moon" : "sun"}
            size={14}
            color={colors.foreground}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 28,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
