import colors from "@/constants/colors";
import { useTheme } from "@/hooks/useAutoTheme";

export function useColors() {
  const { theme } = useTheme();
  const palette = theme === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
