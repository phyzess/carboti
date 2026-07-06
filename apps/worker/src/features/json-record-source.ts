import type { StarterJsonParsedRecord } from "./json-record-types";

export function parseStarterJsonSource(value: unknown): StarterJsonParsedRecord[] {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
