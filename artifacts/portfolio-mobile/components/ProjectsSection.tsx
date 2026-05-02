import React, { useRef, useState } from "react";
import {
  Dimensions,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { useScrollCtx } from "@/hooks/useScrollContext";
import { PROJECTS } from "@/constants/data";
import ProjectCard from "./ProjectCard";

const SCREEN_W = Dimensions.get("window").width;

export default function ProjectsSection() {
  const colors = useColors();
  const flatListRef = useRef<Animated.FlatList<(typeof PROJECTS)[number]>>(null);
  const [layoutY, setLayoutY] = useState(0);
  const carouselX = useSharedValue(0);
  const reveal = useSharedValue(0);
  const { scrollY, viewportHeight } = useScrollCtx();

  const onLayout = (e: LayoutChangeEvent) => setLayoutY(e.nativeEvent.layout.y);

  useAnimatedReaction(
    () => scrollY.value + viewportHeight.value * 0.75 > layoutY,
    (entered, prev) => {
      if (entered && !prev) reveal.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    },
    [layoutY],
  );

  const labelStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateX: (1 - reveal.value) * -40 }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: (1 - reveal.value) * 30 }],
  }));

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    carouselX.value = e.nativeEvent.contentOffset.x;
  };

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]} onLayout={onLayout}>
      <Animated.View style={[styles.headerRow, labelStyle]}>
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>SIDE PROJECTS</Text>
        <Text style={[styles.count, { color: colors.mutedForeground, fontFamily: "Vercetti" }]}>{PROJECTS.length}</Text>
      </Animated.View>

      <Animated.Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Soria" }, titleStyle]}>
        Things I've{"\n"}Built
      </Animated.Text>

      <Animated.FlatList
        ref={flatListRef}
        data={PROJECTS}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <ProjectCard project={item} index={index} carouselX={carouselX} screenWidth={SCREEN_W} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={onCarouselScroll}
        scrollEventThrottle={16}
        scrollEnabled={PROJECTS.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  label: {
    fontSize: 11,
    letterSpacing: 3,
  },
  count: {
    fontSize: 11,
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 40,
    lineHeight: 44,
    paddingHorizontal: 28,
  },
  list: {
    paddingLeft: 28,
    paddingRight: 14,
    paddingTop: 8,
  },
});
