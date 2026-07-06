import type { ReviewRecordDecisionAction } from "@carboti/import-pipeline";

export function prepareReviewDecisionLedgerStatements(
  env: Env,
  input: {
    action: ReviewRecordDecisionAction;
    decidedAt: string;
    decisionId: string;
    importJobId: string;
    note: string | null;
    recordDecisionId: string;
    reviewerUserId: string;
    stagedRecordKey: string;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        INSERT INTO import_review_decisions (
          id, import_job_id, action, reviewer_user_id, note, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      input.decisionId,
      input.importJobId,
      input.action,
      input.reviewerUserId,
      input.note,
      input.decidedAt,
    ),
    env.DB.prepare(
      `
        INSERT INTO import_review_record_decisions (
          id, decision_id, import_job_id, staged_record_key, action, note, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      input.recordDecisionId,
      input.decisionId,
      input.importJobId,
      input.stagedRecordKey,
      input.action,
      input.note,
      input.decidedAt,
    ),
  ];
}
