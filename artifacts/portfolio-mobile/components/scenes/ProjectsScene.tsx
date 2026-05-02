import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SafeCanvas from "@/three/SafeCanvas";
import OrbitingCards from "@/three/OrbitingCards";
import Stars from "@/three/Stars";
import SceneLights from "@/three/SceneLights";
import ProjectSheet from "@/components/sheets/ProjectSheet";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/hooks/useAutoTheme";
import { PROJECTS } from "@/constants/data";

export default function ProjectsScene() {
  const colors = useColors();
  const { theme } = useTheme();
  const [active, setActive] = useState<number | null>(null);

  const onSelect = (i: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setActive(i);
  };

  return (
    <View style={styles.container}>
      <SafeCanvas
        style={styles.canvas}
        camera={{ position: [0, 1.5, 7], fov: 60 }}
        dpr={[1, 2]}
      >
        <SceneLights />
        {theme === "dark" && <Stars count={400} radius={40} />}
        <OrbitingCards projects={PROJECTS} onSelect={onSelect} />
      </SafeCanvas>

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.top}>
          <Text style={[styles.kicker, { color: colors.foreground, opacity: 0.6 }]}>
            SIDE PROJECTS · {PROJECTS.length}
          </Text>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: "Soria" }]}>
            things i've built
          </Text>
          <Text style={[styles.hint, { color: colors.foreground, opacity: 0.5 }]}>
            tap any card to open
          </Text>
        </View>
      </View>

      <ProjectSheet
        project={active != null ? PROJECTS[active] : null}
        onClose={() => setActive(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { ...StyleSheet.absoluteFillObject },
  overlay: { flex: 1, paddingHorizontal: 28, paddingTop: 96 },
  top: { gap: 6 },
  kicker: { fontSize: 11, letterSpacing: 3 },
  title: { fontSize: 36, lineHeight: 40 },
  hint: { fontSize: 11, letterSpacing: 2, marginTop: 6 },
});
