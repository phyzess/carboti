export function assertWorkerAdvisoryGuards(context) {
  const { assert, workerAiAdvisoryRoutes, workerAiAdvisoryStore, workerSources } = context;

  assert(
    workerSources.includes("generateLocalImportReviewAdvisory") &&
      workerAiAdvisoryRoutes.includes("readAiAdvisoryGenerateTarget") &&
      workerAiAdvisoryRoutes.includes("writeGeneratedAiAdvisory") &&
      workerAiAdvisoryStore.includes("INSERT INTO ai_advisory_artifacts") &&
      workerSources.includes('action: "ai_advisory.generated"') &&
      workerSources.includes("`ai_advisory.${targetStatus}`") &&
      workerSources.includes("humanConfirmationRequired") &&
      !workerSources.includes("ai_advisory_artifacts WHERE status = 'confirmed'"),
    "AI advisory routes must persist suggestions, audit human decisions, and stay advisory-only.",
  );
}
