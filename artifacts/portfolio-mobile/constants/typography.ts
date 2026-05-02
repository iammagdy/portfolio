export const fonts = {
  display: "Soria",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodyBold: "Inter_700Bold",
};

export const type = {
  display: { fontFamily: fonts.display, fontSize: 64, lineHeight: 64 },
  displayLg: { fontFamily: fonts.display, fontSize: 96, lineHeight: 92 },
  headline: { fontFamily: fonts.display, fontSize: 40, lineHeight: 44 },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 32 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyLg: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26 },
  meta: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 16 },
  eyebrow: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2.5,
    textTransform: "uppercase" as const,
  },
  tab: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2.2,
    textTransform: "uppercase" as const,
  },
};

export const space = { xs: 6, sm: 10, md: 16, lg: 24, xl: 36, xxl: 56 };
