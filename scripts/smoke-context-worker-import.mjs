export function createSmokeWorkerImportContext({ text }) {
  const workerImportAdapters = text("apps/worker/src/import-adapters.ts");
  const workerImportJobRunner = [
    text("apps/worker/src/import-job-runner.ts"),
    text("apps/worker/src/import-job-processing-read.ts"),
    text("apps/worker/src/import-job-processing-start.ts"),
  ].join("\n");
  const workerImportJobRoutes = [
    text("apps/worker/src/import-job-routes.ts"),
    text("apps/worker/src/import-job-list-route.ts"),
    text("apps/worker/src/import-job-list-query.ts"),
    text("apps/worker/src/import-job-list-presenters.ts"),
    text("apps/worker/src/import-job-events-route.ts"),
    text("apps/worker/src/import-job-retry-route.ts"),
    text("apps/worker/src/import-job-retry-target.ts"),
    text("apps/worker/src/import-job-retry-dispatch.ts"),
    text("apps/worker/src/import-job-retry-record.ts"),
  ].join("\n");
  const workerImportJobStaging = [
    text("apps/worker/src/import-job-staging.ts"),
    text("apps/worker/src/import-job-staging-persistence.ts"),
    text("apps/worker/src/import-job-staging-row-statements.ts"),
    text("apps/worker/src/import-job-staging-completion-statements.ts"),
  ].join("\n");
  const workerImportReviewRoutes = [
    text("apps/worker/src/import-review-routes.ts"),
    text("apps/worker/src/import-review-detail-route.ts"),
    text("apps/worker/src/import-review-issue-queries.ts"),
    text("apps/worker/src/import-review-decision-routes.ts"),
    text("apps/worker/src/import-review-confirm-pending-route.ts"),
    text("apps/worker/src/import-review-commit-route.ts"),
  ].join("\n");
  const workerStarterReviewStore = text("apps/worker/src/features/starter-review-store.ts");
  const workerStarterReviewQueries = text("apps/worker/src/features/starter-review-queries.ts");
  const workerStarterReviewStagedQueries = text(
    "apps/worker/src/features/starter-review-staged-queries.ts",
  );
  const workerStarterReviewStagedRowSelect = text(
    "apps/worker/src/features/starter-review-staged-row-select.ts",
  );
  const workerStarterReviewCommittedQueries = text(
    "apps/worker/src/features/starter-review-committed-queries.ts",
  );
  const workerStarterReviewStatusQueries = text(
    "apps/worker/src/features/starter-review-status-queries.ts",
  );
  const workerStarterReviewStatements = text(
    "apps/worker/src/features/starter-review-statements.ts",
  );
  const workerStarterReviewSources = [
    workerStarterReviewStore,
    workerStarterReviewQueries,
    workerStarterReviewStagedQueries,
    workerStarterReviewStagedRowSelect,
    workerStarterReviewCommittedQueries,
    workerStarterReviewStatusQueries,
    workerStarterReviewStatements,
  ].join("\n");

  return {
    workerImportAdapters,
    workerImportJobRoutes,
    workerImportJobRunner,
    workerImportJobStaging,
    workerImportReviewRoutes,
    workerStarterReviewCommittedQueries,
    workerStarterReviewQueries,
    workerStarterReviewSources,
    workerStarterReviewStatements,
    workerStarterReviewStatusQueries,
    workerStarterReviewStagedRowSelect,
    workerStarterReviewStagedQueries,
    workerStarterReviewStore,
  };
}
