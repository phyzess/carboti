export function createSmokeWorkerAdvisoryContext({ text }) {
  const workerAiAdvisoryStore = [
    text("apps/worker/src/ai-advisory-store.ts"),
    text("apps/worker/src/ai-advisory-queries.ts"),
    text("apps/worker/src/ai-advisory-inserts.ts"),
    text("apps/worker/src/ai-advisory-presenters.ts"),
  ].join("\n");
  const workerAiAdvisoryRoutes = [
    text("apps/worker/src/ai-advisory-routes.ts"),
    text("apps/worker/src/ai-advisory-list-route.ts"),
    text("apps/worker/src/ai-advisory-generate-route.ts"),
    text("apps/worker/src/ai-advisory-generate-target.ts"),
    text("apps/worker/src/ai-advisory-generate-record.ts"),
    text("apps/worker/src/ai-advisory-decision-route.ts"),
    text("apps/worker/src/ai-advisory-decision-target.ts"),
    text("apps/worker/src/ai-advisory-decision-record.ts"),
  ].join("\n");

  return {
    workerAiAdvisoryRoutes,
    workerAiAdvisoryStore,
  };
}
