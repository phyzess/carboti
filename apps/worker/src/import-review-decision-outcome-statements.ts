import { createAuditEvent } from "@carboti/audit";
import type { StagedRecordStatus } from "@carboti/import-pipeline";
import { prepareAuditInsert } from "./audit-store";
import type { WorkerImportAdapter } from "./import-adapters";
import { prepareImportJobEventInsert } from "./import-job-event-store";
import type { StoredStagedRecordRow } from "./import-review-store";

export function prepareReviewRecordDecisionOutcomeStatements(
  env: Env,
  input: {
    adapter: WorkerImportAdapter;
    actorUserId: string;
    decidedAt: string;
    decisionId: string;
    importJobId: string;
    jobStatus: string;
    record: StoredStagedRecordRow;
    recordDecisionId: string;
    targetStatus: Extract<StagedRecordStatus, "approved" | "rejected">;
  },
): D1PreparedStatement[] {
  return [
    input.adapter.reviewStore.prepareUpdateStagedRecordStatus(env, {
      id: input.record.id,
      reviewStatus: input.targetStatus,
      updatedAt: input.decidedAt,
    }),
    env.DB.prepare(
      `
        UPDATE import_jobs
        SET status = ?, updated_at = ?
        WHERE id = ?
      `,
    ).bind(input.jobStatus, input.decidedAt, input.importJobId),
    prepareImportJobEventInsert(env, {
      importJobId: input.importJobId,
      sourceFileId: input.record.source_file_id,
      eventType: `import_review.record_${input.targetStatus}`,
      statusFrom: input.record.review_status,
      statusTo: input.jobStatus,
      actorUserId: input.actorUserId,
      message: `Staged record ${input.targetStatus}.`,
      createdAt: input.decidedAt,
      metadata: {
        stagedRecordKey: input.record.staged_record_key,
        decisionId: input.decisionId,
        recordDecisionId: input.recordDecisionId,
        targetReviewStatus: input.targetStatus,
      },
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: `import_review.record_${input.targetStatus}`,
        actor: {
          id: input.actorUserId,
          kind: "user",
        },
        subject: {
          id: input.record.id,
          kind: input.adapter.reviewStore.stagedRecordSubjectKind,
        },
        metadata: {
          importJobId: input.importJobId,
          stagedRecordKey: input.record.staged_record_key,
          decisionId: input.decisionId,
        },
      }),
    ),
  ];
}
