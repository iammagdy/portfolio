import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import Pill from "@/components/ui/Pill";
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

        <View style={styles.monogram}>
          <Txt
            style={[
              type.displayLg,
              { color: colors.foreground, marginTop: space.sm },
            ]}
          >
            Magdy
          </Txt>
          <Txt
            style={[
              type.displayLg,
              { color: colors.foreground, marginTop: -10 },
            ]}
          >
            Saber.
          </Txt>
        </View>

        <Txt
          variant="bodyLg"
          color="muted"
          style={{ marginTop: space.lg, maxWidth: 380 }}
        >
          Open to interesting product, design, and AI engineering work.
          The fastest reply is by email.
        </Txt>

        <View style={styles.pills}>
          {CONTACT_LINKS.map((link, i) => (
            <Pill
              key={link.name}
              label={shortLabel(link.name)}
              trailing="↗"
              variant={i === 0 ? "primary" : "outline"}
              onPress={() => open(link.url)}
              fullWidth
            />
          ))}
        </View>
      </Screen>
    </View>
  );
}

function shortLabel(name: string): string {
  if (name.startsWith("Website")) return "magdysaber.com";
  return name;
}

const styles = StyleSheet.create({
  monogram: { marginTop: space.lg },
  pills: { marginTop: space.xxl, gap: 12 },
});
