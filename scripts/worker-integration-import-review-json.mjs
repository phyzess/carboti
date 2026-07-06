import { testJsonPendingConfirmationFinalCommit } from "./worker-integration-import-review-json-final.mjs";
import { testJsonPartialCommitReview } from "./worker-integration-import-review-json-partial.mjs";

export async function testJsonImportReviewScenario({ client, env, worker }) {
  const { jsonUpload } = await testJsonPartialCommitReview({ client, env, worker });

  await testJsonPendingConfirmationFinalCommit({ client, jsonUpload });
}
