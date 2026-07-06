import type { ReviewStatusSummary } from "@carboti/import-pipeline";

type ReviewStatusCountRow = {
  review_status: string;
  count: number;
};

export async function readStarterReviewStatusSummary(
  env: Env,
  importJobId: string,
): Promise<ReviewStatusSummary> {
  const rows = await env.DB.prepare(
    `
      SELECT review_status, COUNT(*) AS count
      FROM example_staged_records
      WHERE import_job_id = ?
      GROUP BY review_status
    `,
  )
    .bind(importJobId)
    .all<ReviewStatusCountRow>();
  const summary: ReviewStatusSummary = {
    pending: 0,
    approved: 0,
    rejected: 0,
    committed: 0,
  };

  for (const row of rows.results) {
    if (isReviewStatus(row.review_status)) {
      summary[row.review_status] = row.count;
    }
  }

  return summary;
}

function isReviewStatus(status: string): status is keyof ReviewStatusSummary {
  return (
    status === "pending" || status === "approved" || status === "rejected" || status === "committed"
  );
}
