import type { ImportFeatureAdapter, ReviewIssue } from "@carboti/import-pipeline";

import { parseExampleSource } from "./source";
import type { ExampleCommittedRecord, ExampleParsedRecord, ExampleStagedRecord } from "./types";

export const exampleImportReviewAdapter: ImportFeatureAdapter<
  ExampleParsedRecord,
  ExampleStagedRecord,
  ExampleCommittedRecord
> = {
  id: "example.import-review",
  canHandle(source) {
    return source.filename.endsWith(".txt") || source.contentType.startsWith("text/");
  },
  parse: parseExampleSource,
  async stage(parsed) {
    return parsed.map((record) => ({
      ...record,
      normalizedLabel: record.label.trim().toLowerCase(),
    }));
  },
  validate(staged): ReviewIssue[] {
    if (Number.isFinite(staged.value)) {
      return [];
    }

    return [
      {
        code: "invalid_number",
        message: "Value must be a finite number.",
        severity: "error",
      },
    ];
  },
  async commitApproved({ records }) {
    const committedAt = new Date().toISOString();
    return records.map((record) => ({ ...record, committedAt }));
  },
};
