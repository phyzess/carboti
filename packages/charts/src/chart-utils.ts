import type { ChartDatum } from "./types";

export function normalizeX(value: ChartDatum["x"], fallback: number): number {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function extentOrFallback(values: number[], fallback: [number, number]): [number, number] {
  const finiteValues = values.filter(Number.isFinite);
  if (finiteValues.length === 0) {
    return fallback;
  }

  return [Math.min(...finiteValues), Math.max(...finiteValues)];
}

export function paddedDomain(domain: [number, number]): [number, number] {
  if (domain[0] === domain[1]) {
    const offset = Math.max(Math.abs(domain[0]) * 0.12, 1);
    return [domain[0] - offset, domain[1] + offset];
  }

  const span = domain[1] - domain[0];
  return [domain[0] - span * 0.08, domain[1] + span * 0.08];
}

export function ticksForDomain(domain: [number, number]): number[] {
  const [min, max] = domain;
  const step = (max - min) / 3;
  return [min, min + step, min + step * 2, max];
}

export function formatValue(value: number): string {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function truncateLabel(label: string, maxLength: number): string {
  return label.length <= maxLength ? label : `${label.slice(0, Math.max(maxLength - 1, 1))}.`;
}
