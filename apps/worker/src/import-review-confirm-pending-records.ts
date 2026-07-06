import {
  stagedStatusForReviewAction,
  type ReviewRecordDecisionAction,
} from "@carboti/import-pipeline";
import type { CurrentUser } from "./auth-types";
import type { AppContext } from "./http-utils";
import type { WorkerImportAdapter } from "./import-adapters";
import { prepareConfirmPendingReviewStatements } from "./import-review-confirm-pending-statements";
import type { ImportJobReviewRow } from "./import-review-row-types";
import {
  adjustReviewStatus,
  jobStatusForReviewSummary,
  readReviewStatusSummary,
} from "./import-review-status";
import type { StoredStagedRecordRow } from "./import-review-store";

export async function writeConfirmPendingReviewRecords(input: {
  adapter: WorkerImportAdapter;
  context: AppContext;
  current: CurrentUser;
  job: ImportJobReviewRow;
  jobId: string;
  note: string | null;
  pendingRecords: StoredStagedRecordRow[];
}): Promise<{
  confirmedCount: number;
  records: StoredStagedRecordRow[];
  status: string;
}> {
  const { adapter, context, current, job, jobId, note, pendingRecords } = input;
  const confirmedAt = new Date().toISOString();
  const action: ReviewRecordDecisionAction = "approve";
  const targetStatus = stagedStatusForReviewAction(action);
  const decisionId = crypto.randomUUID();
  const summary = await readReviewStatusSummary(context.env, adapter.reviewStore, jobId);
  adjustReviewStatus(summary, "pending", -pendingRecords.length);
  adjustReviewStatus(summary, targetStatus, pendingRecords.length);
  const jobStatus = jobStatusForReviewSummary(summary);
  const updatedRecords = pendingRecords.map((record) => ({
    ...record,
    review_status: targetStatus,
    updated_at: confirmedAt,
  }));

  await context.env.DB.batch(
    prepareConfirmPendingReviewStatements(context.env, {
      action,
      adapter,
      confirmedAt,
      currentUserId: current.user.id,
      decisionId,
      job,
      jobId,
      jobStatus,
      note,
      pendingRecords,
      targetStatus,
    }),
  );

  return {
    confirmedCount: pendingRecords.length,
    records: updatedRecords,
    status: jobStatus,
  };
}
