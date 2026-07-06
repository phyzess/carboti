import type { ReviewRecordDecisionAction, StagedRecordStatus } from "@carboti/import-pipeline";
import type { CurrentUser } from "./auth-types";
import type { AppContext } from "./http-utils";
import type { WorkerImportAdapter } from "./import-adapters";
import { prepareReviewDecisionLedgerStatements } from "./import-review-decision-ledger-statements";
import { prepareReviewRecordDecisionOutcomeStatements } from "./import-review-decision-outcome-statements";
import { readImportJobStatusAfterRecordDecision } from "./import-review-status";
import type { StoredStagedRecordRow } from "./import-review-store";

export async function writeReviewRecordDecision(input: {
  action: ReviewRecordDecisionAction;
  adapter: WorkerImportAdapter;
  context: AppContext;
  current: CurrentUser;
  jobId: string;
  note: string | null;
  record: StoredStagedRecordRow;
  targetStatus: Extract<StagedRecordStatus, "approved" | "rejected">;
}): Promise<{ decidedAt: string; record: StoredStagedRecordRow }> {
  const { action, adapter, context, current, jobId, note, record, targetStatus } = input;
  const decidedAt = new Date().toISOString();
  const decisionId = crypto.randomUUID();
  const recordDecisionId = crypto.randomUUID();
  const jobStatus = await readImportJobStatusAfterRecordDecision(context.env, {
    importJobId: jobId,
    reviewStore: adapter.reviewStore,
    currentStatus: record.review_status,
    targetStatus,
  });

  await context.env.DB.batch([
    ...prepareReviewDecisionLedgerStatements(context.env, {
      action,
      decidedAt,
      decisionId,
      importJobId: jobId,
      note,
      recordDecisionId,
      reviewerUserId: current.user.id,
      stagedRecordKey: record.staged_record_key,
    }),
    ...prepareReviewRecordDecisionOutcomeStatements(context.env, {
      adapter,
      actorUserId: current.user.id,
      decidedAt,
      decisionId,
      importJobId: jobId,
      jobStatus,
      record,
      recordDecisionId,
      targetStatus,
    }),
  ]);

  return {
    decidedAt,
    record: {
      ...record,
      review_status: targetStatus,
      updated_at: decidedAt,
    },
  };
}
