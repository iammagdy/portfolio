import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import Divider from "@/components/ui/Divider";
import Screen from "@/components/ui/Screen";
import Txt from "@/components/ui/Text";
import TopBar from "@/components/TopBar";
import { space, type } from "@/constants/typography";
import { CONTACT_LINKS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function ContactRoute() {
  const colors = useColors();

  const open = (url: string) => {
    Haptics.selectionAsync().catch(() => {});
    if (url.startsWith("mailto:")) {
      Linking.openURL(url).catch(() => {});
    } else {
      WebBrowser.openBrowserAsync(url).catch(() => {});
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar label="CONTACT" />
      <Screen>
        <Txt variant="eyebrow" color="muted">
          Let us talk
        </Txt>
        <Txt
          style={[
            type.displayLg,
            { color: colors.foreground, marginTop: space.sm },
          ]}
        >
          Get in
        </Txt>
        <Txt
          style={[
            type.displayLg,
            { color: colors.foreground, marginTop: -10 },
          ]}
        >
          touch.
        </Txt>

        <Txt variant="bodyLg" color="muted" style={{ marginTop: space.lg, maxWidth: 380 }}>
          Open to interesting product, design, and AI engineering work.
          The fastest reply is by email.
        </Txt>

        <View style={{ marginTop: space.xxl }}>
          {CONTACT_LINKS.map((link, i) => (
            <View key={link.name}>
              <Pressable
                onPress={() => open(link.url)}
                style={({ pressed }) => [
                  styles.row,
                  { opacity: pressed ? 0.55 : 1 },
                ]}
              >
                <Feather
                  name={iconFor(link.icon)}
                  size={18}
                  color={colors.foreground}
                  style={{ width: 26 }}
                />
                <Txt
                  variant="bodyLg"
                  style={{ flex: 1, color: colors.foreground }}
                >
                  {link.name}
                </Txt>
                <Txt variant="meta" color="muted">
                  ↗
                </Txt>
              </Pressable>
              {i < CONTACT_LINKS.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </View>
      </Screen>
    </View>
  );
}

function iconFor(name: string): React.ComponentProps<typeof Feather>["name"] {
  switch (name) {
    case "globe":
      return "globe";
    case "linkedin":
      return "linkedin";
    case "github":
      return "github";
    case "mail":
      return "mail";
    default:
      return "external-link";
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: space.lg,
  },
});
