import type { ReviewRecordDecisionAction } from "@carboti/import-pipeline";

export function prepareConfirmPendingDecisionStatement(
  env: Env,
  input: {
    action: ReviewRecordDecisionAction;
    confirmedAt: string;
    currentUserId: string;
    decisionId: string;
    jobId: string;
    note: string | null;
  },
): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT INTO import_review_decisions (
        id, import_job_id, action, reviewer_user_id, note, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
  ).bind(
    input.decisionId,
    input.jobId,
    input.action,
    input.currentUserId,
    input.note,
    input.confirmedAt,
  );
}
