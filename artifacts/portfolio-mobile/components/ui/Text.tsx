import React from "react";
import { Text, type TextProps, type TextStyle } from "react-native";
import { type } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";

type Variant =
  | "display"
  | "displayLg"
  | "headline"
  | "title"
  | "body"
  | "bodyLg"
  | "meta"
  | "eyebrow"
  | "tab";

interface Props extends TextProps {
  variant?: Variant;
  color?: "foreground" | "muted" | "accent";
  style?: TextStyle | TextStyle[];
}

export default function Txt({
  variant = "body",
  color = "foreground",
  style,
  children,
  ...rest
}: Props) {
  const colors = useColors();
  const tone =
    color === "muted"
      ? colors.muted
      : color === "accent"
        ? colors.accent
        : colors.foreground;
  return (
    <Text style={[type[variant], { color: tone }, style]} {...rest}>
      {children}
    </Text>
  );
}
