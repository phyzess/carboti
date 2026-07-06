import type { ImportFeatureAdapter, ReviewIssue } from "@carboti/import-pipeline";
import { readSourceText } from "./source-text";

export type StarterParsedRecord = {
  label: string;
  value: number;
};

export type StarterStagedRecord = StarterParsedRecord & {
  normalizedLabel: string;
};

export type StarterCommittedRecord = StarterStagedRecord & {
  committedAt: string;
};

export function parseStarterStagedRecord(value: unknown): StarterStagedRecord {
  if (!value || typeof value !== "object") {
    throw new Error("Starter staged record must be an object.");
  }

  const record = value as Record<string, unknown>;
  if (
    typeof record.label !== "string" ||
    typeof record.value !== "number" ||
    typeof record.normalizedLabel !== "string"
  ) {
    throw new Error("Starter staged record has an invalid shape.");
  }

  return {
    label: record.label,
    value: record.value,
    normalizedLabel: record.normalizedLabel,
  };
}

export const starterImportReviewAdapter: ImportFeatureAdapter<
  StarterParsedRecord,
  StarterStagedRecord,
  StarterCommittedRecord
> = {
  id: "starter.import-review",
  canHandle(source) {
    return source.filename.endsWith(".txt") || source.contentType.startsWith("text/");
  },
  async parse(source) {
    const text = await readSourceText(source);
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line, index) => index !== 0 || line.toLowerCase() !== "label,value")
      .map((line) => {
        const [label = "", value = "0"] = line.split(",");
        return { label, value: Number(value) };
      });
  },
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
