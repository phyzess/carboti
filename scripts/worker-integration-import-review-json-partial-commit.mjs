import { assert } from "./worker-integration-http.mjs";

export async function commitOneJsonRecord({ client, jsonReview, jsonUpload }) {
  const [jsonRecord] = jsonReview.records;
  const jsonApproved = await client.json(
    `/api/import-jobs/${jsonUpload.importJobId}/staged-records/${jsonRecord.id}/approve`,
    {
      method: "POST",
      body: JSON.stringify({
        note: "JSON adapter path.",
      }),
      headers: {
        "content-type": "application/json",
      },
    },
  );
  assert(jsonApproved.record.reviewStatus === "approved", "json record can be approved");

  const jsonCommit = await client.json(`/api/import-jobs/${jsonUpload.importJobId}/commit`, {
    method: "POST",
  });
  assert(
    jsonCommit.status === "needs_review",
    "partial json commit keeps job in review while pending records remain",
  );
  assert(jsonCommit.committedRecords.length === 1, "json commit writes approved record only");
  assert(
    typeof jsonCommit.committedRecords[0]?.payload?.commitKey === "string",
    "json commit payload comes from JSON adapter commitApproved handler",
  );

  await assertJsonPartialCommitState({ client, jsonUpload });
}

async function assertJsonPartialCommitState({ client, jsonUpload }) {
  const jsonReviewAfterPartialCommit = await client.json(
    `/api/import-jobs/${jsonUpload.importJobId}/review`,
  );
  assert(
    jsonReviewAfterPartialCommit.job.status === "needs_review",
    "partial json commit persists needs_review status",
  );
  assert(
    jsonReviewAfterPartialCommit.records.some((record) => record.reviewStatus === "committed"),
    "partial json commit marks the approved record committed",
  );
  assert(
    jsonReviewAfterPartialCommit.records.some((record) => record.reviewStatus === "pending"),
    "partial json commit leaves undecided records pending",
  );

  const jsonCommitAgainWhilePending = await client.json(
    `/api/import-jobs/${jsonUpload.importJobId}/commit`,
    {
      method: "POST",
    },
  );
  assert(
    jsonCommitAgainWhilePending.duplicate === true &&
      jsonCommitAgainWhilePending.status === "needs_review",
    "duplicate partial json commit preserves derived job status",
  );

  const remainingJsonRecord = jsonReviewAfterPartialCommit.records.find(
    (record) => record.reviewStatus === "pending",
  );
  assert(Boolean(remainingJsonRecord), "json partial commit leaves one record to review");
}
