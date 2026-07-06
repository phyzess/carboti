import { commitOneJsonRecord } from "./worker-integration-import-review-json-partial-commit.mjs";
import { uploadJsonPartialFixtureForReview } from "./worker-integration-import-review-json-partial-upload.mjs";

export async function testJsonPartialCommitReview({ client, env, worker }) {
  const { jsonReview, jsonUpload } = await uploadJsonPartialFixtureForReview({
    client,
    env,
    worker,
  });

  await commitOneJsonRecord({ client, jsonReview, jsonUpload });

  return { jsonUpload };
}
