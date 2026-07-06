import type { JsonParsedRecord, JsonStagedRecord } from "./types";

export function parseJsonStagedRecord(value: unknown): JsonStagedRecord {
  if (!isRecord(value)) {
    throw new Error("JSON staged record must be an object.");
  }

  if (
    typeof value.key !== "string" ||
    typeof value.sourcePath !== "string" ||
    typeof value.normalizedKey !== "string" ||
    typeof value.valueType !== "string"
  ) {
    throw new Error("JSON staged record has an invalid shape.");
  }

  return {
    key: value.key,
    value: value.value,
    sourcePath: value.sourcePath,
    normalizedKey: value.normalizedKey,
    valueType: value.valueType,
  };
}

export function parsedRecordsFromJson(value: unknown): JsonParsedRecord[] {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (isRecord(item) && typeof item.key === "string" && "value" in item) {
        return {
          key: item.key,
          value: item.value,
          sourcePath: `$[${index}]`,
        };
      }

      return {
        key: String(index + 1),
        value: item,
        sourcePath: `$[${index}]`,
      };
    });
  }

  if (isRecord(value)) {
    return Object.entries(value).map(([key, item]) => ({
      key,
      value: item,
      sourcePath: `$.${key}`,
    }));
  }

  throw new Error("JSON source must be an object or an array.");
}

export function valueType(value: unknown): string {
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
