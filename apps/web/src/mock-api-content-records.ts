import type { ImportJobListItem, StagedRecord } from "./types";
import { shortId } from "./mock-api-identifiers";
import { stagedRecord } from "./mock-api-entity-model";

export function recordsFromContent(job: ImportJobListItem, contentText: string): StagedRecord[] {
  const lines = contentText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.toLowerCase().startsWith("label,"));
  const rows = lines.length > 0 ? lines.slice(0, 6) : ["Sample Record,1.1992"];
  return rows.map((line, index) => {
    const [label = `Record ${index + 1}`, rawValue = String(index + 1)] = line.split(",");
    const value = Number.parseFloat(rawValue);
    return stagedRecord(
      job,
      `demo-record-${shortId()}-${index + 1}`,
      `row:${index + 1}`,
      {
        label,
        value: Number.isFinite(value) ? value : rawValue,
      },
      index === 0 ? "pending" : "approved",
    );
  });
}
