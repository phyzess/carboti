import { assert } from "./worker-integration-http.mjs";

export async function uploadJsonPartialFixtureForReview({ client, env, worker }) {
  const jsonUpload = await client.json("/api/source-files", {
    method: "POST",
    body: JSON.stringify({
      alpha: 1,
      beta: {
        enabled: true,
      },
    }),
    headers: {
      "content-type": "application/json",
      "x-filename": "fixture-json-records.json",
      "x-workspace-id": "default",
    },
  });
  const jsonMessage = env.IMPORT_JOBS.messages.at(-1);
  assert(jsonMessage?.jobId === jsonUpload.importJobId, "json fixture is queued");

  await worker.queue(
    {
      messages: [{ body: jsonMessage }],
    },
    env,
  );

  const jsonReview = await client.json(`/api/import-jobs/${jsonUpload.importJobId}/review`);
  assert(jsonReview.job.adapterId === "starter.json-records", "json job uses JSON adapter");
  assert(jsonReview.job.jobKind === "starter.json-records", "json job stores JSON job kind");
  assert(jsonReview.job.status === "needs_review", "json job reaches review");
  assert(jsonReview.records.length === 2, "json adapter creates staged records");

  return { jsonReview, jsonUpload };
}
