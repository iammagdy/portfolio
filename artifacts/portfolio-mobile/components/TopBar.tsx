import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Txt from "@/components/ui/Text";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/hooks/useAutoTheme";

interface Props {
  label?: string;
}

export default function TopBar({ label = "MS" }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { theme, toggle } = useTheme();

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
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          toggle();
        }}
        hitSlop={12}
        style={[styles.themeBtn, { borderColor: colors.border }]}
        testID="theme-toggle"
      >
        <Feather
          name={theme === "dark" ? "moon" : "sun"}
          size={14}
          color={colors.foreground}
        />
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
