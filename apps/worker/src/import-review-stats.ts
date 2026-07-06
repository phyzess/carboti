import type { WorkerReviewStore } from "./import-review-store";

export type ImportReviewStats = {
  approved: number;
  committed: number;
  issueCount: number;
  pending: number;
  recordCount: number;
  rejected: number;
};

export async function readImportReviewStats(
  env: Env,
  reviewStore: WorkerReviewStore,
  jobId: string,
): Promise<ImportReviewStats> {
  const [counts, issuesCount] = await Promise.all([
    reviewStore.readReviewStatusSummary(env, jobId),
    env.DB.prepare(
      `
        SELECT COUNT(*) AS issue_count
        FROM import_review_issues
        WHERE import_job_id = ?
          AND status = 'open'
      `,
    )
      .bind(jobId)
      .first<{ issue_count: number }>(),
  ]);

  return {
    recordCount: counts.pending + counts.approved + counts.rejected + counts.committed,
    issueCount: Number(issuesCount?.issue_count ?? 0),
    ...counts,
  };
}
