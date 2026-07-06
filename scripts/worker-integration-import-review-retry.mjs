import { assert } from "./worker-integration-http.mjs";

export async function testImportRetryScenario({ client, env, worker }) {
  const retryUploadBody = "label,value\nRetry Record,2.001\n";
  const retryUpload = await client.json("/api/source-files", {
    method: "POST",
    body: retryUploadBody,
    headers: {
      "content-type": "text/plain",
      "x-filename": "fixture-retry.txt",
      "x-workspace-id": "default",
    },
  });
  const firstRetryMessage = env.IMPORT_JOBS.messages.at(-1);
  assert(firstRetryMessage?.jobId === retryUpload.importJobId, "retry fixture is queued");

  await env.SOURCE_FILES.delete(retryUpload.objectKey);
  await worker.queue(
    {
      messages: [{ body: firstRetryMessage }],
    },
    env,
  );

  const failedJobs = await client.json("/api/import-jobs?limit=20");
  const failedJob = failedJobs.importJobs.find((job) => job.id === retryUpload.importJobId);
  assert(failedJob?.status === "failed", "missing source object marks import job failed");
  assert(failedJob.failureClass === "source_missing", "failed job stores failure class");

  await env.SOURCE_FILES.put(retryUpload.objectKey, retryUploadBody, {
    httpMetadata: {
      contentType: "text/plain",
    },
  });

  const retry = await client.json(`/api/import-jobs/${retryUpload.importJobId}/retry`, {
    method: "POST",
  });
  assert(retry.status === "queued", "retry route requeues a failed job");

  const secondRetryMessage = env.IMPORT_JOBS.messages.at(-1);
  assert(secondRetryMessage?.jobId === retryUpload.importJobId, "retry dispatches queue message");
  await worker.queue(
    {
      messages: [{ body: secondRetryMessage }],
    },
    env,
  );

  const retryReview = await client.json(`/api/import-jobs/${retryUpload.importJobId}/review`);
  assert(retryReview.job.status === "needs_review", "retried job reaches review");
  assert(retryReview.records.length === 1, "retried job stages records through adapter");
}
