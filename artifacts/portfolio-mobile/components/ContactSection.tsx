import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { CONTACT_LINKS } from '@/constants/data';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const ICON_MAP: Record<string, FeatherIconName> = {
  linkedin: 'linkedin',
  github: 'github',
  mail: 'mail',
};

interface LinkButtonProps {
  item: typeof CONTACT_LINKS[number];
}

function LinkButton({ item }: LinkButtonProps) {
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const nativeDriver = Platform.OS !== 'web';

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: nativeDriver }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: nativeDriver }).start();
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Linking.openURL(item.url);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      testID={`contact-link-${item.name}`}
    >
      <Animated.View
        style={[
          styles.linkCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Feather name={ICON_MAP[item.icon] ?? 'link'} size={20} color={colors.foreground} />
        <Text style={[styles.linkName, { color: colors.foreground, fontFamily: 'Vercetti' }]}>{item.name}</Text>
        <Feather name="arrow-up-right" size={14} color={colors.mutedForeground} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ContactSection() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { borderTopColor: colors.border, paddingBottom: bottomPad + 40 }]}>
      <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>CONTACT</Text>

      <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Soria' }]}>
        Let's{'\n'}Connect
      </Text>

      <Text style={[styles.sub, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>
        Open to opportunities, collaborations, and good conversations.
      </Text>

      <View style={styles.links}>
        {CONTACT_LINKS.map((item) => (
          <LinkButton key={item.name} item={item} />
        ))}
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>
          © 2026 Magdy Saber
        </Text>
        <Text style={[styles.footerText, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>
          Made with AI
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 40,
    paddingHorizontal: 28,
    gap: 20,
  },
  label: {
    fontSize: 11,
    letterSpacing: 3,
  },
  sectionTitle: {
    fontSize: 40,
    lineHeight: 44,
  },
  sub: {
    fontSize: 14,
    lineHeight: 22,
  },
  links: {
    gap: 10,
    marginTop: 8,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  linkName: {
    flex: 1,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    letterSpacing: 1,
  },
});
