import type { ChartTone } from "./types";

export const chartTheme = {
  colors: {
    neutral: "var(--qitu-text)",
    positive: "var(--qitu-green)",
    negative: "var(--qitu-red)",
    warning: "var(--qitu-amber)",
    info: "var(--qitu-blue)",
  },
  grid: "var(--qitu-line)",
  text: "var(--qitu-dim)",
  surface: "var(--qitu-surface-2)",
} as const;

export function toneColor(tone: ChartTone): string {
  return chartTheme.colors[tone];
}

export function chartToneForIndex(index: number): ChartTone {
  return (["positive", "info", "warning", "negative", "neutral"] as const)[index % 5] ?? "info";
}
