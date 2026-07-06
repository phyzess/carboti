import { confirmCsvAdvisory } from "./worker-integration-import-review-csv-happy-advisory.mjs";
import { approveAndCommitCsvRecord } from "./worker-integration-import-review-csv-happy-commit.mjs";
import { processCsvUploadForReview } from "./worker-integration-import-review-csv-happy-review.mjs";
import { uploadCsvHappyPathFixture } from "./worker-integration-import-review-csv-happy-upload.mjs";

export async function testCsvHappyPathReviewCommit({ client, env, worker }) {
  const upload = await uploadCsvHappyPathFixture({ client, env });
  const review = await processCsvUploadForReview({ client, env, upload, worker });

  await confirmCsvAdvisory({ client, importJobId: upload.importJobId });
  await approveAndCommitCsvRecord({ client, importJobId: upload.importJobId, review });

  return { upload };
}
