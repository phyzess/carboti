import { assert } from "./worker-integration-http.mjs";
import { testCsvImportReviewScenarios } from "./worker-integration-import-review-csv.mjs";
import { testJsonImportReviewScenario } from "./worker-integration-import-review-json.mjs";
import { testImportRetryScenario } from "./worker-integration-import-review-retry.mjs";

export async function testImportReviewWorkflow({ client, env, worker }) {
  const { upload } = await testCsvImportReviewScenarios({ client, env, worker });

  await testJsonImportReviewScenario({ client, env, worker });
  await testImportRetryScenario({ client, env, worker });

  const sourceFiles = await client.json("/api/source-files");
  assert(sourceFiles.sourceFiles.length === 4, "source file list is visible");

  const importJobs = await client.json("/api/import-jobs");
  assert(
    importJobs.importJobs.some((job) => job.status === "committed"),
    "import job list reflects commit",
  );

  return { upload };
}
