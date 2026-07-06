import type { ReviewRecordDecisionAction } from "@carboti/import-pipeline";
import type { WorkerImportAdapter } from "./import-adapters";
import { prepareConfirmPendingDecisionStatement } from "./import-review-confirm-pending-decision-statements";
import { prepareConfirmPendingJobStatements } from "./import-review-confirm-pending-job-statements";
import { prepareConfirmPendingRecordStatements } from "./import-review-confirm-pending-record-statements";
import type { ImportJobReviewRow } from "./import-review-row-types";
import type { StoredStagedRecordRow } from "./import-review-store";

export function prepareConfirmPendingReviewStatements(
  env: Env,
  input: {
    action: ReviewRecordDecisionAction;
    adapter: WorkerImportAdapter;
    confirmedAt: string;
    currentUserId: string;
    decisionId: string;
    job: ImportJobReviewRow;
    jobId: string;
    jobStatus: string;
    note: string | null;
    pendingRecords: StoredStagedRecordRow[];
    targetStatus: string;
  },
): D1PreparedStatement[] {
  return [
    prepareConfirmPendingDecisionStatement(env, {
      action: input.action,
      confirmedAt: input.confirmedAt,
      currentUserId: input.currentUserId,
      decisionId: input.decisionId,
      jobId: input.jobId,
      note: input.note,
    }),
    ...input.pendingRecords.flatMap((record) =>
      prepareConfirmPendingRecordStatements(env, {
        action: input.action,
        adapter: input.adapter,
        confirmedAt: input.confirmedAt,
        currentUserId: input.currentUserId,
        decisionId: input.decisionId,
        jobId: input.jobId,
        note: input.note,
        record,
        targetStatus: input.targetStatus,
      }),
    ),
    ...prepareConfirmPendingJobStatements(env, {
      confirmedAt: input.confirmedAt,
      currentUserId: input.currentUserId,
      decisionId: input.decisionId,
      job: input.job,
      jobId: input.jobId,
      jobStatus: input.jobStatus,
      pendingRecords: input.pendingRecords,
      targetStatus: input.targetStatus,
    }),
  ];
}
