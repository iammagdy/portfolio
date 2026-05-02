import React from 'react';
import {
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import WorkSection from '@/components/WorkSection';
import ContactSection from '@/components/ContactSection';

export default function PortfolioScreen() {
  const colors = useColors();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      testID="portfolio-scroll"
    >
      <HeroSection />
      <ProjectsSection />
      <WorkSection />
      <ContactSection />
    </ScrollView>
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
