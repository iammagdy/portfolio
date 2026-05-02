import React from "react";
import { View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  inset?: number;
  marginVertical?: number;
}

export default function Divider({ inset = 0, marginVertical = 0 }: Props) {
  const colors = useColors();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.border,
        marginLeft: inset,
        marginRight: inset,
        marginVertical,
      }}
    />
  );
}
