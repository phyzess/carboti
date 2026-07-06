import type { Hono } from "hono";
import { updateAiAdvisoryStatusResponse } from "./ai-advisory-decision-route";
import { registerAiAdvisoryGenerateRoute } from "./ai-advisory-generate-route";
import { registerAiAdvisoryListRoute } from "./ai-advisory-list-route";

export function registerAiAdvisoryRoutes(app: Hono<{ Bindings: Env }>): void {
  registerAiAdvisoryListRoute(app);
  registerAiAdvisoryGenerateRoute(app);

  app.post("/api/import-jobs/:jobId/advisories/:advisoryId/confirm", async (context) => {
    return updateAiAdvisoryStatusResponse(context, "confirmed");
  });

  app.post("/api/import-jobs/:jobId/advisories/:advisoryId/dismiss", async (context) => {
    return updateAiAdvisoryStatusResponse(context, "dismissed");
  });
}
