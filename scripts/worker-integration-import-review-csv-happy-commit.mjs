import { assert } from "./worker-integration-http.mjs";

export async function approveAndCommitCsvRecord({ client, importJobId, review }) {
  const [record] = review.records;
  const approved = await client.json(
    `/api/import-jobs/${importJobId}/staged-records/${record.id}/approve`,
    {
      method: "POST",
      body: JSON.stringify({
        note: "Looks good.",
      }),
      headers: {
        "content-type": "application/json",
      },
    },
  );

  assert(approved.record.reviewStatus === "approved", "approve updates staged record");

  const commit = await client.json(`/api/import-jobs/${importJobId}/commit`, {
    method: "POST",
  });

  assert(commit.status === "committed", "commit returns committed status");
  assert(commit.committedRecords.length === 1, "commit writes committed record");
  assert(
    typeof commit.committedRecords[0]?.payload?.committedAt === "string",
    "commit payload comes from the adapter commitApproved handler",
  );

  const commitAgain = await client.json(`/api/import-jobs/${importJobId}/commit`, {
    method: "POST",
  });

  assert(commitAgain.duplicate === true, "second commit is idempotent");
}
