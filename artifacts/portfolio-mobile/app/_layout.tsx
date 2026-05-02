import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import IntroOverlay from "@/components/IntroOverlay";
import { ThemeProvider, useTheme } from "@/hooks/useAutoTheme";
import { useColors } from "@/hooks/useColors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

let introShownThisRuntime = false;

function RootLayoutNav() {
  const { theme } = useTheme();
  const colors = useColors();
  const [introDone, setIntroDone] = useState(introShownThisRuntime);

  const fade = useSharedValue(1);
  const lastTheme = useRef(theme);
  useEffect(() => {
    if (lastTheme.current !== theme) {
      lastTheme.current = theme;
      fade.value = withSequence(
        withTiming(0, { duration: 120, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) }),
      );
    }
  }, [theme, fade]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Animated.View style={[{ flex: 1 }, fadeStyle]}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: "fade",
          }}
        />
      </Animated.View>
      {!introDone ? (
        <IntroOverlay
          onDone={() => {
            introShownThisRuntime = true;
            setIntroDone(true);
          }}
        />
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Soria: require("../assets/fonts/Soria.ttf"),
    Vercetti: require("../assets/fonts/Vercetti.woff"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
              <RootLayoutNav />
            </ThemeProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
