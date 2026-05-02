import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { Project } from "@/constants/data";

const CARD_W = 300;
const CARD_GAP = 14;

interface ProjectCardProps {
  project: Project;
  index: number;
  carouselX: SharedValue<number>;
  screenWidth: number;
}

export default function ProjectCard({ project, index, carouselX, screenWidth }: ProjectCardProps) {
  const colors = useColors();
  const press = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => {
    const cardCenter = index * (CARD_W + CARD_GAP) + CARD_W / 2 + 28 - carouselX.value;
    const distance = (cardCenter - screenWidth / 2) / (screenWidth / 2);
    const rotateY = interpolate(distance, [-1.2, 0, 1.2], [6, 0, -6], "clamp");
    const scale = interpolate(Math.abs(distance), [0, 1.2], [1, 0.93], "clamp");
    return {
      transform: [
        { perspective: 800 },
        { scale: scale * press.value },
        { rotateY: `${rotateY}deg` },
      ],
    };
  });

  const handleCardPressIn = () => {
    press.value = withSpring(0.97, { damping: 14 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };
  const handleCardPressOut = () => {
    press.value = withSpring(1, { damping: 14 });
  };

  return (
    <Pressable onPressIn={handleCardPressIn} onPressOut={handleCardPressOut}>
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        cardStyle,
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.indexText, { color: colors.mutedForeground, fontFamily: "Vercetti", opacity: 0.4 }]}>
          {String(index + 1).padStart(2, "0")}
        </Text>
        <Text style={[styles.date, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>{project.date}</Text>
      </View>

      <Text style={[styles.title, { color: colors.foreground, fontFamily: "Soria" }]}>{project.title}</Text>
      <Text style={[styles.subtext, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>{project.subtext}</Text>

      <View style={styles.linksRow}>
        {project.urls.map((link, i) => (
          <LinkButton
            key={i}
            text={link.text}
            url={link.url}
            disabled={link.disabled}
            colors={colors}
            testID={`project-link-${project.title}-${link.text}`}
          />
        ))}
      </View>
    </Animated.View>
    </Pressable>
  );
}

interface LinkButtonProps {
  text: string;
  url?: string;
  disabled?: boolean;
  colors: ReturnType<typeof useColors>;
  testID?: string;
}

function LinkButton({ text, url, disabled, colors, testID }: LinkButtonProps) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.94, { damping: 14 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 14 });
  };
  const onPress = async () => {
    if (disabled || !url) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {}
  };

  return (
    <TouchableOpacity
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.6}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.linkButton,
          {
            borderColor: disabled ? colors.border : colors.foreground,
            opacity: disabled ? 0.3 : 1,
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.linkText,
            { color: disabled ? colors.mutedForeground : colors.foreground, fontFamily: "Vercetti" },
          ]}
        >
          {text} {!disabled && "↗"}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    padding: 22,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginRight: CARD_GAP,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  indexText: {
    fontSize: 11,
    letterSpacing: 2,
  },
  date: {
    fontSize: 11,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 13,
    lineHeight: 20,
  },
  linksRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  linkButton: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  linkText: {
    fontSize: 11,
    letterSpacing: 1.5,
  },
});
