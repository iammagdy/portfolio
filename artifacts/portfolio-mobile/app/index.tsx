import React from "react";
import { type LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { useScrollCtx } from "@/hooks/useScrollContext";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import WorkSection from "@/components/WorkSection";
import ContactSection from "@/components/ContactSection";
import ScrollProgress from "@/components/ScrollProgress";

export default function PortfolioScreen() {
  const colors = useColors();
  const { scrollY, contentHeight, viewportHeight } = useScrollCtx();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const onLayout = (e: LayoutChangeEvent) => {
    viewportHeight.value = e.nativeEvent.layout.height;
  };

  const onContentSizeChange = (_w: number, h: number) => {
    contentHeight.value = h;
  };

  return (
    <>
      <Animated.ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
        testID="portfolio-scroll"
      >
        <HeroSection />
        <ProjectsSection />
        <WorkSection />
        <ContactSection />
      </Animated.ScrollView>
      <ScrollProgress />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
