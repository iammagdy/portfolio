import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Txt from "@/components/ui/Text";
import { useColors } from "@/hooks/useColors";

interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  descriptors: Record<
    string,
    { options: { tabBarLabel?: unknown; title?: string } }
  >;
  navigation: {
    emit: (event: {
      type: "tabPress";
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

export default function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          paddingBottom: insets.bottom + 12,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            Haptics.selectionAsync().catch(() => {});
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.item}
            hitSlop={6}
          >
            <Txt
              variant="tab"
              style={{
                color: focused ? colors.foreground : colors.muted,
              }}
            >
              {label}
            </Txt>
            <View
              style={[
                styles.indicator,
                {
                  backgroundColor: focused ? colors.accent : "transparent",
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  indicator: {
    width: 18,
    height: 2,
    borderRadius: 1,
  },
});
