export function createSmokeWorkerSourceContext({ text }) {
  const workerSourceIntake = [
    text("apps/worker/src/source-intake.ts"),
    text("apps/worker/src/source-intake-types.ts"),
    text("apps/worker/src/source-intake-dispatch.ts"),
    text("apps/worker/src/source-intake-persistence.ts"),
  ].join("\n");
  const workerSourceIntakeStore = [
    text("apps/worker/src/source-intake-store.ts"),
    text("apps/worker/src/source-intake-duplicates.ts"),
    text("apps/worker/src/source-intake-inserts.ts"),
    text("apps/worker/src/source-intake-source-file-statements.ts"),
    text("apps/worker/src/source-intake-import-job-statements.ts"),
  ].join("\n");
  const workerSourceRoutes = [
    text("apps/worker/src/source-routes.ts"),
    text("apps/worker/src/source-list-route.ts"),
    text("apps/worker/src/source-list-query.ts"),
    text("apps/worker/src/source-list-presenters.ts"),
    text("apps/worker/src/source-upload-route.ts"),
    text("apps/worker/src/source-upload-request.ts"),
    text("apps/worker/src/source-upload-presenters.ts"),
  ].join("\n");

  return {
    workerSourceIntake,
    workerSourceIntakeStore,
    workerSourceRoutes,
  };
}
