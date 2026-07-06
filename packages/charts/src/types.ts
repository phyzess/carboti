export type ChartState = "ready" | "loading" | "empty" | "error" | "partial";
export type ChartTone = "neutral" | "positive" | "negative" | "warning" | "info";

export type ChartDatum = {
  x: string | number | Date;
  y: number;
  label?: string | undefined;
  tone?: ChartTone | undefined;
};

export type CategoryDatum = {
  label: string;
  value: number;
  tone?: ChartTone | undefined;
};

export type ScatterDatum = {
  x: number;
  y: number;
  label?: string | undefined;
  tone?: ChartTone | undefined;
};
