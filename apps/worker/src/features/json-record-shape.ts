import type { StarterJsonStagedRecord } from "./json-record-types";

export function parseStarterJsonStagedRecord(value: unknown): StarterJsonStagedRecord {
  if (!isRecord(value)) {
    throw new Error("Starter JSON staged record must be an object.");
  }

  if (
    typeof value.key !== "string" ||
    typeof value.sourcePath !== "string" ||
    typeof value.normalizedKey !== "string" ||
    typeof value.valueType !== "string"
  ) {
    throw new Error("Starter JSON staged record has an invalid shape.");
  }

  return {
    key: value.key,
    value: value.value,
    sourcePath: value.sourcePath,
    normalizedKey: value.normalizedKey,
    valueType: value.valueType,
  };
}

export function starterJsonValueType(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  return typeof value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
