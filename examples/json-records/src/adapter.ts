import type { ImportFeatureAdapter, ReviewIssue } from "@carboti/import-pipeline";

import { valueType } from "./records";
import { parseJsonSource } from "./source";
import type { JsonCommittedRecord, JsonParsedRecord, JsonStagedRecord } from "./types";

export const jsonRecordsAdapter: ImportFeatureAdapter<
  JsonParsedRecord,
  JsonStagedRecord,
  JsonCommittedRecord
> = {
  id: "example.json-records",
  canHandle(source) {
    return source.filename.endsWith(".json") || source.contentType.includes("application/json");
  },
  parse: parseJsonSource,
  async stage(parsed) {
    return parsed.map((record) => ({
      ...record,
      normalizedKey: record.key.trim().toLowerCase(),
      valueType: valueType(record.value),
    }));
  },
  validate(staged): ReviewIssue[] {
    if (staged.normalizedKey) {
      return [];
    }

    return [
      {
        code: "empty_key",
        message: "JSON record key must not be empty.",
        severity: "error",
      },
    ];
  },
  async commitApproved({ records, context }) {
    const committedAt = new Date().toISOString();
    return records.map((record) => ({
      ...record,
      committedAt,
      commitKey: `${context.importJobId}:${record.normalizedKey}`,
    }));
  },
};
