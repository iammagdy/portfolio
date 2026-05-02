import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { WORK_TIMELINE } from '@/constants/data';

export default function WorkSection() {
  const colors = useColors();

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>WORK & EDUCATION</Text>

      <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Soria' }]}>
        Experience{'\n'}Timeline
      </Text>

      <View style={styles.timeline}>
        {WORK_TIMELINE.map((entry, index) => (
          <TimelineItem
            key={index}
            entry={entry}
            isLast={index === WORK_TIMELINE.length - 1}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
}

interface TimelineItemProps {
  entry: { year: string; title: string; subtitle?: string; description?: string };
  isLast: boolean;
  colors: ReturnType<typeof useColors>;
}

function TimelineItem({ entry, isLast, colors }: TimelineItemProps) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.leftCol}>
        <Text style={[styles.year, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>{entry.year}</Text>
      </View>

      <View style={styles.lineCol}>
        <View style={[styles.dot, { backgroundColor: isLast ? colors.foreground : colors.border, borderColor: colors.foreground }]} />
        {!isLast && <View style={[styles.line, { backgroundColor: colors.border }]} />}
      </View>

      <View style={styles.rightCol}>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Vercetti' }]}>{entry.title}</Text>
        {entry.subtitle ? (
          <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>{entry.subtitle}</Text>
        ) : null}
        {entry.description ? (
          <Text style={[styles.description, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>{entry.description}</Text>
        ) : null}
        {!isLast && <View style={{ height: 24 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 28,
    gap: 16,
  },
  label: {
    fontSize: 11,
    letterSpacing: 3,
  },
  sectionTitle: {
    fontSize: 40,
    lineHeight: 44,
  },
  timeline: {
    marginTop: 12,
  },
  itemRow: {
    flexDirection: 'row',
  },
  leftCol: {
    width: 80,
    paddingTop: 2,
  },
  year: {
    fontSize: 11,
    letterSpacing: 1,
    textAlign: 'right',
    paddingRight: 12,
  },
  lineCol: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    marginTop: 4,
  },
  line: {
    width: 1,
    flex: 1,
    marginTop: 4,
  },
  rightCol: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
});
