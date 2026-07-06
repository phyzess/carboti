import type { ExampleStagedRecord } from "./types";

export function parseExampleStagedRecord(value: unknown): ExampleStagedRecord {
  if (!value || typeof value !== "object") {
    throw new Error("Example staged record must be an object.");
  }

  const record = value as Record<string, unknown>;
  if (
    typeof record.label !== "string" ||
    typeof record.value !== "number" ||
    typeof record.normalizedLabel !== "string"
  ) {
    throw new Error("Example staged record has an invalid shape.");
  }

  return {
    label: record.label,
    value: record.value,
    normalizedLabel: record.normalizedLabel,
  };
}
