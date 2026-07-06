import { testCsvHappyPathReviewCommit } from "./worker-integration-import-review-csv-happy.mjs";
import { testCsvInvalidNumberReview } from "./worker-integration-import-review-csv-invalid.mjs";

export async function testCsvImportReviewScenarios({ client, env, worker }) {
  const { upload } = await testCsvHappyPathReviewCommit({ client, env, worker });

  await testCsvInvalidNumberReview({ client, env, worker });

  return { upload };
}
