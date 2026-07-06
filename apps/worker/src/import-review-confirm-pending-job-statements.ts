import { prepareImportJobEventInsert } from "./import-job-event-store";
import type { ImportJobReviewRow } from "./import-review-row-types";
import type { StoredStagedRecordRow } from "./import-review-store";

export function prepareConfirmPendingJobStatements(
  env: Env,
  input: {
    confirmedAt: string;
    currentUserId: string;
    decisionId: string;
    job: ImportJobReviewRow;
    jobId: string;
    jobStatus: string;
    pendingRecords: StoredStagedRecordRow[];
    targetStatus: string;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        UPDATE import_jobs
        SET status = ?, updated_at = ?
        WHERE id = ?
      `,
    ).bind(input.jobStatus, input.confirmedAt, input.jobId),
    prepareImportJobEventInsert(env, {
      importJobId: input.jobId,
      sourceFileId: input.job.source_file_id,
      eventType: "import_review.records_approved",
      statusTo: input.jobStatus,
      actorUserId: input.currentUserId,
      message: "Pending staged records approved.",
      createdAt: input.confirmedAt,
      metadata: {
        decisionId: input.decisionId,
        confirmedCount: input.pendingRecords.length,
        stagedRecordKeys: input.pendingRecords.map((record) => record.staged_record_key),
        targetReviewStatus: input.targetStatus,
      },
    }),
  ];
}
