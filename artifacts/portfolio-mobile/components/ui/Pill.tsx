import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Txt from "@/components/ui/Text";
import { useColors } from "@/hooks/useColors";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "ghost" | "outline" | "accent";
  trailing?: string;
  style?: ViewStyle;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Pill({
  label,
  onPress,
  variant = "primary",
  trailing,
  style,
  disabled,
  fullWidth,
}: Props) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const press = () => {
    if (disabled) return;
    Haptics.selectionAsync().catch(() => {});
    onPress?.();
  };

  const bg =
    variant === "primary"
      ? colors.foreground
      : variant === "accent"
        ? colors.accent
        : "transparent";
  const fg =
    variant === "primary"
      ? colors.background
      : variant === "accent"
        ? colors.onAccent
        : colors.foreground;
  const borderColor =
    variant === "outline" ? colors.border : "transparent";
  const borderW = variant === "outline" ? 1 : 0;

  return (
    <Animated.View style={[fullWidth ? { alignSelf: "stretch" } : null, animStyle, style]}>
      <Pressable
        onPress={press}
        onPressIn={() => {
          scale.value = withTiming(0.96, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 140 });
        }}
        disabled={disabled}
        style={[
          styles.pill,
          {
            backgroundColor: bg,
            borderColor,
            borderWidth: borderW,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        <View style={styles.row}>
          <Txt
            variant="meta"
            style={[styles.label, { color: fg }]}
            numberOfLines={1}
          >
            {label}
          </Txt>
          {trailing ? (
            <Txt variant="meta" style={[styles.trailing, { color: fg }]}>
              {trailing}
            </Txt>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { letterSpacing: 2 },
  trailing: { letterSpacing: 1.5, opacity: 0.85 },
});
