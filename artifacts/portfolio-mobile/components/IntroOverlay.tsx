import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { type } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";

interface Props {
  onDone: () => void;
}

export default function IntroOverlay({ onDone }: Props) {
  const colors = useColors();

  const word1Y = useSharedValue(-260);
  const word1Opacity = useSharedValue(0);
  const word2Y = useSharedValue(-260);
  const word2Opacity = useSharedValue(0);
  const sigOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    const spring = { damping: 14, stiffness: 110, mass: 1 };

    word1Opacity.value = withDelay(80, withTiming(1, { duration: 220 }));
    word1Y.value = withDelay(80, withSpring(0, spring));

    word2Opacity.value = withDelay(320, withTiming(1, { duration: 220 }));
    word2Y.value = withDelay(320, withSpring(0, spring));

    sigOpacity.value = withDelay(
      900,
      withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) }),
    );

    overlayOpacity.value = withDelay(
      1700,
      withSequence(
        withTiming(1, { duration: 1 }),
        withTiming(0, { duration: 360, easing: Easing.out(Easing.cubic) }, (finished) => {
          if (finished) runOnJS(onDone)();
        }),
      ),
    );
  }, [word1Y, word1Opacity, word2Y, word2Opacity, sigOpacity, overlayOpacity, onDone]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  const word1Style = useAnimatedStyle(() => ({
    opacity: word1Opacity.value,
    transform: [{ translateY: word1Y.value }],
  }));
  const word2Style = useAnimatedStyle(() => ({
    opacity: word2Opacity.value,
    transform: [{ translateY: word2Y.value }],
  }));
  const sigStyle = useAnimatedStyle(() => ({
    opacity: sigOpacity.value,
    transform: [{ translateY: (1 - sigOpacity.value) * 12 }],
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.root,
        { backgroundColor: colors.background },
        overlayStyle,
      ]}
      pointerEvents="none"
    >
      <View style={styles.center}>
        <Animated.Text
          style={[
            type.displayLg,
            { color: colors.foreground, textAlign: "center" },
            word1Style,
          ]}
        >
          Magdy
        </Animated.Text>
        <Animated.Text
          style={[
            type.displayLg,
            { color: colors.foreground, textAlign: "center", marginTop: -6 },
            word2Style,
          ]}
        >
          Saber
        </Animated.Text>
        <Animated.Text
          style={[
            type.eyebrow,
            { color: colors.muted, marginTop: 18, textAlign: "center" },
            sigStyle,
          ]}
        >
          Frontend Engineer · Designer
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center", zIndex: 100 },
  center: { alignItems: "center" },
});
