import type {
  CommitApprovedContext,
  ImportFeatureAdapter,
  ReviewIssue,
} from "@carboti/import-pipeline";

export type TemplateParsedRecord = {
  label: string;
  value: string;
};

export type TemplateStagedRecord = TemplateParsedRecord & {
  sourceRowKey: string;
  normalizedLabel: string;
};

export type TemplateCommittedRecord = TemplateStagedRecord & {
  id: string;
  committedBy: string;
  idempotencyKey: string;
};

export const importFeatureAdapter: ImportFeatureAdapter<
  TemplateParsedRecord,
  TemplateStagedRecord,
  TemplateCommittedRecord
> = {
  id: "template.import",
  canHandle(source) {
    return source.filename.endsWith(".csv") || source.contentType.startsWith("text/csv");
  },
  async parse(source) {
    const text = await readAll(source);
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line, index) => index !== 0 || line.toLowerCase() !== "label,value")
      .map((line) => {
        const [label = "", value = ""] = line.split(",");
        return {
          label,
          value,
        };
      });
  },
  async stage(parsed) {
    return parsed.map((record, index) => ({
      ...record,
      sourceRowKey: String(index + 1),
      normalizedLabel: record.label.trim().toLowerCase(),
    }));
  },
  validate(staged) {
    const issues: ReviewIssue[] = [];
    if (!staged.normalizedLabel) {
      issues.push({
        code: "empty_label",
        message: "Label is required before this record can be committed.",
        severity: "error",
      });
    }
    if (!staged.value.trim()) {
      issues.push({
        code: "empty_value",
        message: "Value is required before this record can be committed.",
        severity: "warning",
      });
    }
    return issues;
  },
  async commitApproved({ records, context }) {
    return records.map((record, index) => committedRecord(record, context, index));
  },
};

function committedRecord(
  record: TemplateStagedRecord,
  context: CommitApprovedContext,
  index: number,
): TemplateCommittedRecord {
  return {
    ...record,
    id: `${context.importJobId}:${record.sourceRowKey}:${index + 1}`,
    committedBy: context.reviewerId,
    idempotencyKey: context.idempotencyKey,
  };
}

async function readAll(source: ReadableStream<Uint8Array>): Promise<string> {
  const reader = source.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const result = await reader.read();
    if (result.done) {
      break;
    }
    chunks.push(result.value);
  }

  return new TextDecoder().decode(concat(chunks));
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const size = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const merged = new Uint8Array(size);
  let offset = 0;

  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return merged;
}
