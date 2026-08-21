import { rgb, type RGB } from "pdf-lib";

export const PRINT_THEMES = ["dark", "light"] as const;
export type PrintTheme = (typeof PRINT_THEMES)[number];
export const DEFAULT_PRINT_THEME: PrintTheme = "dark";

export function resolvePrintTheme(value: string | null | undefined): PrintTheme {
  return value === "light" ? "light" : "dark";
}

export type PrintThemeCss = {
  bg: string;
  fg: string;
  card: string;
  muted: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  pageBg: string;
  navBg: string;
  veil: string;
  tagOpacity: string;
  focusCard: string;
  foot: string;
};

export type PrintThemePdf = {
  bg: RGB;
  card: RGB;
  fg: RGB;
  muted: RGB;
  secondary: RGB;
  primary: RGB;
  accent: RGB;
  white: RGB;
  border: RGB;
  veilBase: RGB;
  veilOpacity: number;
};

const darkCss: PrintThemeCss = {
  bg: "#2c2c2c",
  fg: "#e8e8e8",
  card: "#3a3a3a",
  muted: "#a8a8a8",
  border: "#5c5c5c",
  primary: "#e23d2e",
  secondary: "#7cb342",
  accent: "#6ba3d4",
  pageBg: "#111111",
  navBg: "#1a1a1a",
  veil:
    "linear-gradient(to top,rgba(26,26,26,.97) 0%,rgba(26,26,26,.78) 32%,rgba(26,26,26,.25) 58%,rgba(26,26,26,.15) 100%)",
  tagOpacity: "rgba(232,232,232,.92)",
  focusCard: "#424242",
  foot: "#5c5c5c",
};

const lightCss: PrintThemeCss = {
  bg: "#f3f4f5",
  fg: "#1a1c1e",
  card: "#e8eaec",
  muted: "#5a5f66",
  border: "#c5c9ce",
  primary: "#c6281a",
  secondary: "#4f7c28",
  accent: "#2f6f9e",
  pageBg: "#dde1e5",
  navBg: "#e8eaec",
  veil:
    "linear-gradient(to top,rgba(243,244,245,.96) 0%,rgba(243,244,245,.78) 34%,rgba(243,244,245,.28) 60%,rgba(243,244,245,.12) 100%)",
  tagOpacity: "rgba(26,28,30,.9)",
  focusCard: "#dfe2e5",
  foot: "#8b9198",
};

/** Light palette avoids pure white/black for cleaner print results. */
export const PRINT_THEME_CSS: Record<PrintTheme, PrintThemeCss> = {
  dark: darkCss,
  light: lightCss,
};

export const PRINT_THEME_PDF: Record<PrintTheme, PrintThemePdf> = {
  dark: {
    bg: rgb(0.173, 0.173, 0.173),
    card: rgb(0.227, 0.227, 0.227),
    fg: rgb(0.91, 0.91, 0.91),
    muted: rgb(0.66, 0.66, 0.66),
    secondary: rgb(0.486, 0.702, 0.259),
    primary: rgb(0.886, 0.239, 0.18),
    accent: rgb(0.42, 0.639, 0.831),
    white: rgb(1, 1, 1),
    border: rgb(0.36, 0.36, 0.36),
    veilBase: rgb(0.173, 0.173, 0.173),
    veilOpacity: 0.95,
  },
  light: {
    bg: rgb(0.953, 0.957, 0.961),
    card: rgb(0.91, 0.918, 0.925),
    fg: rgb(0.102, 0.11, 0.118),
    muted: rgb(0.353, 0.373, 0.4),
    secondary: rgb(0.31, 0.486, 0.157),
    primary: rgb(0.776, 0.157, 0.102),
    accent: rgb(0.184, 0.435, 0.62),
    white: rgb(1, 1, 1),
    border: rgb(0.773, 0.788, 0.808),
    veilBase: rgb(0.953, 0.957, 0.961),
    veilOpacity: 0.92,
  },
};

export function printThemeCssVars(theme: PrintTheme): string {
  const t = PRINT_THEME_CSS[theme];
  return [
    `--print-bg:${t.bg}`,
    `--print-fg:${t.fg}`,
    `--print-card:${t.card}`,
    `--print-muted:${t.muted}`,
    `--print-border:${t.border}`,
    `--print-primary:${t.primary}`,
    `--print-secondary:${t.secondary}`,
    `--print-accent:${t.accent}`,
    `--print-page-bg:${t.pageBg}`,
    `--print-nav-bg:${t.navBg}`,
    `--print-veil:${t.veil}`,
    `--print-tag:${t.tagOpacity}`,
    `--print-focus-card:${t.focusCard}`,
    `--print-foot:${t.foot}`,
  ].join(";");
}
