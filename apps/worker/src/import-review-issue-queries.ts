import type { ImportReviewIssueRow } from "./import-review-row-types";

export async function readImportReviewIssues(
  env: Env,
  jobId: string,
): Promise<ImportReviewIssueRow[]> {
  const result = await env.DB.prepare(
    `
      SELECT
        id,
        import_job_id,
        staged_record_key,
        code,
        message,
        severity,
        status,
        created_at
      FROM import_review_issues
      WHERE import_job_id = ?
      ORDER BY created_at ASC
    `,
  )
    .bind(jobId)
    .all<ImportReviewIssueRow>();

  return result.results;
}
