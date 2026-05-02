import colors from "@/constants/colors";
import { useTheme } from "@/hooks/useAutoTheme";

export type Palette = (typeof colors)["light"] & { radius: number };

export function useColors(): Palette {
  const { theme } = useTheme();
  const palette = theme === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
