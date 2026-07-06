import {
  jobStatusForReviewSummary,
  type ImportJobStatus,
  type ReviewStatusSummary,
  type StagedRecordStatus,
} from "@carboti/import-pipeline";
import type { WorkerReviewStore } from "./import-review-store";

export { jobStatusForReviewSummary } from "@carboti/import-pipeline";

export async function readImportJobStatusAfterRecordDecision(
  env: Env,
  input: {
    importJobId: string;
    reviewStore: WorkerReviewStore;
    currentStatus: string;
    targetStatus: Extract<StagedRecordStatus, "approved" | "rejected">;
  },
): Promise<ImportJobStatus> {
  const summary = await readReviewStatusSummary(env, input.reviewStore, input.importJobId);
  adjustReviewStatus(summary, input.currentStatus, -1);
  adjustReviewStatus(summary, input.targetStatus, 1);

  return jobStatusForReviewSummary(summary);
}

export async function readImportJobStatusAfterCommit(
  env: Env,
  reviewStore: WorkerReviewStore,
  importJobId: string,
  committedCount: number,
): Promise<ImportJobStatus> {
  const summary = await readReviewStatusSummary(env, reviewStore, importJobId);
  summary.approved = Math.max(0, summary.approved - committedCount);
  summary.committed += committedCount;

  return jobStatusForReviewSummary(summary);
}

export async function readReviewStatusSummary(
  env: Env,
  reviewStore: WorkerReviewStore,
  importJobId: string,
): Promise<ReviewStatusSummary> {
  return reviewStore.readReviewStatusSummary(env, importJobId);
}

export function adjustReviewStatus(
  summary: ReviewStatusSummary,
  status: string,
  delta: number,
): void {
  if (isReviewStatus(status)) {
    summary[status] = Math.max(0, summary[status] + delta);
  }
}

function isReviewStatus(status: string): status is keyof ReviewStatusSummary {
  return (
    status === "pending" || status === "approved" || status === "rejected" || status === "committed"
  );
}
