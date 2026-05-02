import React, { useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { PROJECTS } from '@/constants/data';
import ProjectCard from './ProjectCard';

export default function ProjectsSection() {
  const colors = useColors();
  const flatListRef = useRef<FlatList>(null);

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>SIDE PROJECTS</Text>
        <Text style={[styles.count, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>{PROJECTS.length}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Soria' }]}>
        Things I've{'\n'}Built
      </Text>

      <FlatList
        ref={flatListRef}
        data={PROJECTS}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <ProjectCard project={item} index={index} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        snapToAlignment="start"
        decelerationRate="fast"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
