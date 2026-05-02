import React from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { space } from "@/constants/typography";

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  paddingTop?: number;
  paddingBottom?: number;
}

export default function Screen({
  children,
  scroll = true,
  style,
  paddingTop,
  paddingBottom,
}: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const padTop = paddingTop ?? insets.top + space.xl;
  const padBottom = paddingBottom ?? insets.bottom + 96;

  if (!scroll) {
    return (
      <View
        style={[
          styles.root,
          { backgroundColor: colors.background, paddingTop: padTop, paddingBottom: padBottom },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: padTop, paddingBottom: padBottom },
        style,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 28 },
});
