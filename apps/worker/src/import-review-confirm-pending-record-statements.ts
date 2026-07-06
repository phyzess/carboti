import { createAuditEvent } from "@carboti/audit";
import type { ReviewRecordDecisionAction } from "@carboti/import-pipeline";
import { prepareAuditInsert } from "./audit-store";
import type { WorkerImportAdapter } from "./import-adapters";
import type { StoredStagedRecordRow } from "./import-review-store";

export function prepareConfirmPendingRecordStatements(
  env: Env,
  input: {
    action: ReviewRecordDecisionAction;
    adapter: WorkerImportAdapter;
    confirmedAt: string;
    currentUserId: string;
    decisionId: string;
    jobId: string;
    note: string | null;
    record: StoredStagedRecordRow;
    targetStatus: string;
  },
): D1PreparedStatement[] {
  const recordDecisionId = crypto.randomUUID();

  return [
    env.DB.prepare(
      `
        INSERT INTO import_review_record_decisions (
          id, decision_id, import_job_id, staged_record_key, action, note, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      recordDecisionId,
      input.decisionId,
      input.jobId,
      input.record.staged_record_key,
      input.action,
      input.note,
      input.confirmedAt,
    ),
    input.adapter.reviewStore.prepareUpdateStagedRecordStatus(env, {
      id: input.record.id,
      reviewStatus: input.targetStatus,
      updatedAt: input.confirmedAt,
      onlyPending: true,
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: `import_review.record_${input.targetStatus}`,
        actor: {
          id: input.currentUserId,
          kind: "user",
        },
        subject: {
          id: input.record.id,
          kind: input.adapter.reviewStore.stagedRecordSubjectKind,
        },
        metadata: {
          importJobId: input.jobId,
          stagedRecordKey: input.record.staged_record_key,
          decisionId: input.decisionId,
          recordDecisionId,
          batch: true,
        },
      }),
    ),
  ];
}
