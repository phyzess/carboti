import { apiJson } from "./api-client";
import type { ReviewResponse } from "./api-imports-types";
import type { StagedRecord } from "./types";

export async function getImportJobReview(jobId: string): Promise<ReviewResponse> {
  return apiJson<ReviewResponse>(`/api/import-jobs/${jobId}/review`);
}

export async function approveStagedRecord(input: {
  jobId: string;
  recordId: string;
  note?: string;
}): Promise<{ record: StagedRecord }> {
  return decideStagedRecord(input, "approve");
}

export async function rejectStagedRecord(input: {
  jobId: string;
  recordId: string;
  note?: string;
}): Promise<{ record: StagedRecord }> {
  return decideStagedRecord(input, "reject");
}

export async function confirmPendingStagedRecords(input: {
  jobId: string;
  note?: string;
}): Promise<{
  confirmedCount: number;
  importJobId: string;
  records: StagedRecord[];
  status: string;
  duplicate?: boolean;
}> {
  return apiJson(`/api/import-jobs/${input.jobId}/review/confirm-pending`, {
    method: "POST",
    body: JSON.stringify({
      note: input.note,
    }),
    headers: {
      "content-type": "application/json",
    },
  });
}

async function decideStagedRecord(
  input: { jobId: string; recordId: string; note?: string },
  action: "approve" | "reject",
): Promise<{ record: StagedRecord }> {
  return apiJson(`/api/import-jobs/${input.jobId}/staged-records/${input.recordId}/${action}`, {
    method: "POST",
    body: JSON.stringify({
      note: input.note,
    }),
    headers: {
      "content-type": "application/json",
    },
  });
}
