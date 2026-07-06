export const spacing = {
  xs: "var(--qitu-space-s-1)",
  sm: "var(--qitu-space-s0)",
  md: "var(--qitu-space-s1)",
  lg: "var(--qitu-space-s2)",
  xl: "var(--qitu-space-s3)",
} as const;

export const radii = {
  sm: "var(--qitu-radius-sm)",
  md: "var(--qitu-radius-md)",
  lg: "var(--qitu-radius-lg)",
} as const;

export const typography = {
  sans: "var(--qitu-font-sans)",
  mono: "var(--qitu-font-mono)",
  number: "var(--qitu-font-number)",
} as const;

export const colorTokens = {
  background: "var(--qitu-bg)",
  surface: "var(--qitu-surface)",
  surfaceRaised: "var(--qitu-surface-2)",
  line: "var(--qitu-line)",
  text: "var(--qitu-text)",
  muted: "var(--qitu-muted)",
  dim: "var(--qitu-dim)",
  positive: "var(--qitu-green)",
  negative: "var(--qitu-red)",
  warning: "var(--qitu-amber)",
  info: "var(--qitu-blue)",
} as const;
