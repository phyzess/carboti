import type { StatusBadgeTone, TimelineItem, UploadQueueItem } from "@carboti/ui";
import type { ReviewIssue, StagedRecord, UploadQueueEntry } from "./types";

export function uploadQueueItems(
  queue: UploadQueueEntry[],
  formatBytes: (value: number | null) => string,
): UploadQueueItem[] {
  return queue.map((item) => ({
    error: item.error,
    id: item.id,
    meta: formatBytes(item.file.size),
    name: item.file.name,
    status: item.status,
  }));
}

export function issueForRecord(record: StagedRecord, issues: ReviewIssue[]): ReviewIssue | null {
  return issues.find((issue) => issue.stagedRecordKey === record.stagedRecordKey) ?? null;
}

export function timelineTone(action: string): TimelineItem["tone"] {
  if (action.includes("failed") || action.includes("denied")) return "error";
  if (action.includes("queued") || action.includes("requested")) return "warning";
  if (action.includes("succeeded") || action.includes("committed")) return "success";
  if (action.includes("advisory")) return "info";
  return "neutral";
}

export function payloadSummary(payload: unknown): string {
  if (payload === null || payload === undefined) {
    return "";
  }

  if (typeof payload !== "object") {
    return JSON.stringify(payload) ?? "";
  }

  const entries = Object.entries(payload)
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${String(value)}`);

  return entries.join(", ");
}

export function statusTone(status: string): StatusBadgeTone {
  if (status === "active") {
    return "active";
  }

  if (
    status === "approved" ||
    status === "committed" ||
    status === "confirmed" ||
    status === "done" ||
    status.includes("succeeded")
  ) {
    return "success";
  }

  if (
    status === "pending" ||
    status === "needs_review" ||
    status === "queued" ||
    status === "processing" ||
    status === "suggested"
  ) {
    return "warning";
  }

  if (
    status === "rejected" ||
    status === "dismissed" ||
    status === "failed" ||
    status.includes("failed")
  ) {
    return "danger";
  }

  return "neutral";
}
