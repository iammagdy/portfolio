import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import colorTokens from '@/constants/colors';

export default function HeroSection() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const nativeDriver = Platform.OS !== 'web';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: nativeDriver, delay: 200 }),
        Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: nativeDriver, delay: 200 }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, { toValue: 1, duration: 700, useNativeDriver: nativeDriver }),
        Animated.timing(slideAnim2, { toValue: 0, duration: 700, useNativeDriver: nativeDriver }),
      ]),
    ]).start();
  }, []);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 40 }]}>
      <View style={styles.inner}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={[styles.greeting, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>Hi, I am</Text>
          <Text style={[styles.name, { color: colors.foreground, fontFamily: 'Soria' }]}>Magdy{'\n'}Saber</Text>
        </Animated.View>

        <Animated.View style={[styles.taglineContainer, { opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}>
          <Text style={[styles.tagline, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>FRONTEND ENGINEER</Text>
          <Text style={[styles.divider, { color: colors.border }]}>·</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>DESIGNER</Text>
          <Text style={[styles.divider, { color: colors.border }]}>·</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>DEVELOPER</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim2 }}>
          <View style={[styles.pill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.dot, { backgroundColor: colorTokens.online }]} />
            <Text style={[styles.pillText, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>
              AI Product Engineer — 2026
            </Text>
          </View>
        </Animated.View>
      </View>

      <View style={[styles.scrollHint, { borderTopColor: colors.border }]}>
        <Text style={[styles.scrollText, { color: colors.mutedForeground, fontFamily: 'Vercetti' }]}>SCROLL TO EXPLORE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 520,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingHorizontal: 28,
  },
  inner: {
    gap: 20,
  },
  greeting: {
    fontSize: 15,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  name: {
    fontSize: 62,
    lineHeight: 66,
    letterSpacing: -2,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 2,
  },
  divider: {
    fontSize: 11,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  scrollHint: {
    borderTopWidth: 1,
    paddingTop: 16,
    alignSelf: 'stretch',
  },
  scrollText: {
    fontSize: 10,
    letterSpacing: 3,
  },
});
