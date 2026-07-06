import { assert, expectStatus } from "./worker-integration-http.mjs";

export async function testCsvInvalidNumberReview({ client, env, worker }) {
  const invalidUpload = await client.json("/api/source-files", {
    method: "POST",
    body: "label,value\nBad Amount,not-a-number\n",
    headers: {
      "content-type": "text/plain",
      "x-filename": "fixture-invalid-number.txt",
      "x-workspace-id": "default",
    },
  });
  const invalidMessage = env.IMPORT_JOBS.messages.at(-1);
  assert(invalidMessage?.jobId === invalidUpload.importJobId, "invalid fixture is queued");

  await worker.queue(
    {
      messages: [{ body: invalidMessage }],
    },
    env,
  );

  const invalidReview = await client.json(`/api/import-jobs/${invalidUpload.importJobId}/review`);
  const invalidIssueCodes = new Set(invalidReview.issues.map((issue) => issue.code));
  assert(invalidReview.job.status === "needs_review", "invalid number stays in review");
  assert(invalidReview.records.length === 1, "invalid fixture stages one record");
  assert(
    invalidReview.records[0]?.payload?.normalizedLabel === "bad amount",
    "invalid fixture still normalizes staged payload for review",
  );
  assert(
    invalidIssueCodes.has("manual_review_required") && invalidIssueCodes.has("invalid_number"),
    "invalid fixture records both confirmation and adapter validation issues",
  );
  await expectStatus(
    await client.request(`/api/import-jobs/${invalidUpload.importJobId}/commit`, {
      method: "POST",
    }),
    409,
  );
}
