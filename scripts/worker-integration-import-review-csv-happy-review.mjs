import { assert } from "./worker-integration-http.mjs";

export async function processCsvUploadForReview({ client, env, upload, worker }) {
  await worker.queue(
    {
      messages: env.IMPORT_JOBS.messages.map((body) => ({ body })),
    },
    env,
  );

  const review = await client.json(`/api/import-jobs/${upload.importJobId}/review`);
  assert(
    review.job.status === "needs_review",
    `queue moves import job to needs_review, got ${review.job.status}: ${review.job.failureReason}`,
  );
  assert(review.records.length === 1, "queue creates staged review record");
  assert(review.issues.length === 1, "queue creates review issue");

  return review;
}
