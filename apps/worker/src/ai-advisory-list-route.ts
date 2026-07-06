import type { Hono } from "hono";
import { publicAiAdvisoryArtifact, readAiAdvisoryArtifacts } from "./ai-advisory-store";
import { readCurrentUser } from "./auth-routes";
import { authError } from "./http-utils";
import { readImportJobReview } from "./import-review-job-read";

export function registerAiAdvisoryListRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/import-jobs/:jobId/advisories", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }

    const jobId = context.req.param("jobId");
    const job = await readImportJobReview(context.env, jobId);
    if (!job) {
      return authError(context, "import_job_not_found", "Import job was not found.", 404);
    }

    const advisories = await readAiAdvisoryArtifacts(context.env, jobId);
    return context.json({
      advisories: advisories.map(publicAiAdvisoryArtifact),
    });
  });
}
