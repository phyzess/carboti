import type { ImportFeatureAdapter, ReviewIssue } from "@carboti/import-pipeline";
import { parseStarterJsonSource } from "./json-record-source";
import { starterJsonValueType } from "./json-record-shape";
import type {
  StarterJsonCommittedRecord,
  StarterJsonParsedRecord,
  StarterJsonStagedRecord,
} from "./json-record-types";
import { readSourceText } from "./source-text";

export { parseStarterJsonStagedRecord } from "./json-record-shape";
export type {
  StarterJsonCommittedRecord,
  StarterJsonParsedRecord,
  StarterJsonStagedRecord,
} from "./json-record-types";

export const starterJsonRecordsAdapter: ImportFeatureAdapter<
  StarterJsonParsedRecord,
  StarterJsonStagedRecord,
  StarterJsonCommittedRecord
> = {
  id: "starter.json-records",
  canHandle(source) {
    return source.filename.endsWith(".json") || source.contentType.includes("application/json");
  },
  async parse(source) {
    return parseStarterJsonSource(JSON.parse(await readSourceText(source)) as unknown);
  },
  async stage(parsed) {
    return parsed.map((record) => ({
      ...record,
      normalizedKey: record.key.trim().toLowerCase(),
      valueType: starterJsonValueType(record.value),
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
