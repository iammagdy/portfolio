import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SafeCanvas from "@/three/SafeCanvas";
import MonogramHalo from "@/three/MonogramHalo";
import Stars from "@/three/Stars";
import SceneLights from "@/three/SceneLights";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/hooks/useAutoTheme";
import { CONTACT_LINKS } from "@/constants/data";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];
const ICON_MAP: Record<string, FeatherIconName> = {
  globe: "globe",
  linkedin: "linkedin",
  github: "github",
  mail: "mail",
};

export default function ContactScene() {
  const colors = useColors();
  const { theme } = useTheme();
  const accent = theme === "dark" ? "#0690d4" : "#0a0a0a";

  const open = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (url.startsWith("mailto:")) Linking.openURL(url).catch(() => {});
    else WebBrowser.openBrowserAsync(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <SafeCanvas
        style={styles.canvas}
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 2]}
      >
        <SceneLights />
        {theme === "dark" && <Stars count={500} radius={50} />}
        <MonogramHalo accent={accent} />
      </SafeCanvas>

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.top}>
          <Text style={[styles.kicker, { color: colors.foreground, opacity: 0.6 }]}>
            CONTACT
          </Text>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: "Soria" }]}>
            let's talk
          </Text>
        </View>

        <View style={styles.bottom}>
          {CONTACT_LINKS.map((link) => (
            <Pressable
              key={link.name}
              onPress={() => open(link.url)}
              style={({ pressed }) => [
                styles.pill,
                {
                  borderColor: colors.foreground,
                  backgroundColor: pressed
                    ? colors.foreground
                    : "rgba(255,255,255,0.06)",
                },
              ]}
              testID={`contact-${link.icon}`}
            >
              {({ pressed }) => (
                <View style={styles.pillInner}>
                  <Feather
                    name={ICON_MAP[link.icon] ?? "link"}
                    size={16}
                    color={pressed ? colors.background : colors.foreground}
                  />
                  <Text
                    style={[
                      styles.pillText,
                      {
                        color: pressed ? colors.background : colors.foreground,
                        fontFamily: "Vercetti",
                      },
                    ]}
                  >
                    {link.name}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { ...StyleSheet.absoluteFillObject },
  overlay: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 96,
    paddingBottom: 100,
    justifyContent: "space-between",
  },
  top: { gap: 6 },
  kicker: { fontSize: 11, letterSpacing: 3 },
  title: { fontSize: 36, lineHeight: 40 },
  bottom: { gap: 10 },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  pillInner: { flexDirection: "row", alignItems: "center", gap: 12 },
  pillText: { fontSize: 13, letterSpacing: 1.5 },
});
