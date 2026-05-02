import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Project } from '@/constants/data';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const colors = useColors();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const nativeDriver = Platform.OS !== 'web';

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: nativeDriver }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: nativeDriver }).start();
  };

  const handleLinkPress = async (url?: string, disabled?: boolean) => {
    if (disabled || !url) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Linking.openURL(url);
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.indexText, { color: colors.mutedForeground, fontFamily: 'Vercetti', opacity: 0.4 }]}>
          {String(index + 1).padStart(2, '0')}
        </Text>
        <Text style={[styles.date, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>{project.date}</Text>
      </View>

      <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Soria' }]}>{project.title}</Text>
      <Text style={[styles.subtext, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>{project.subtext}</Text>

      <View style={styles.linksRow}>
        {project.urls.map((link, i) => (
          <TouchableOpacity
            key={i}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => handleLinkPress(link.url, link.disabled)}
            activeOpacity={link.disabled ? 1 : 0.6}
            testID={`project-link-${project.title}-${link.text}`}
          >
            <View
              style={[
                styles.linkButton,
                {
                  borderColor: link.disabled ? colors.border : colors.foreground,
                  opacity: link.disabled ? 0.3 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.linkText,
                  { color: link.disabled ? colors.mutedForeground : colors.foreground, fontFamily: 'Vercetti' },
                ]}
              >
                {link.text} {!link.disabled && '↗'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    padding: 22,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginRight: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
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
