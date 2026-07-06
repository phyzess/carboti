import { assert } from "./worker-integration-http.mjs";

export async function testJsonPendingConfirmationFinalCommit({ client, jsonUpload }) {
  const jsonConfirmPending = await client.json(
    `/api/import-jobs/${jsonUpload.importJobId}/review/confirm-pending`,
    {
      method: "POST",
      body: JSON.stringify({
        note: "Finish JSON adapter path.",
      }),
      headers: {
        "content-type": "application/json",
      },
    },
  );
  assert(jsonConfirmPending.confirmedCount === 1, "batch confirm approves pending json record");
  assert(
    jsonConfirmPending.records.every((record) => record.reviewStatus === "approved"),
    "batch confirm returns approved staged records",
  );
  const jsonReviewAfterFinalApprove = await client.json(
    `/api/import-jobs/${jsonUpload.importJobId}/review`,
  );
  assert(
    jsonReviewAfterFinalApprove.job.status === "approved",
    "approving the remaining json record exposes approved rows for commit",
  );
  const finalJsonCommit = await client.json(`/api/import-jobs/${jsonUpload.importJobId}/commit`, {
    method: "POST",
  });
  assert(finalJsonCommit.status === "committed", "json job is committed after all rows finish");
  assert(finalJsonCommit.committedRecords.length === 1, "final json commit writes remaining row");
}
