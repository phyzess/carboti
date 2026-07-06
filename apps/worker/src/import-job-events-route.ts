import type { Hono } from "hono";
import { readCurrentUser } from "./auth-routes";
import { authError, parseQueryLimit } from "./http-utils";
import { publicImportJobEvent, readImportJobEvents } from "./import-job-event-store";
import { readImportJobReview } from "./import-review-job-read";

export function registerImportJobEventsRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/import-jobs/:jobId/events", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }

    const jobId = context.req.param("jobId");
    const job = await readImportJobReview(context.env, jobId);
    if (!job) {
      return authError(context, "import_job_not_found", "Import job was not found.", 404);
    }

    const limit = parseQueryLimit(context.req.query("limit"), 50);
    const events = await readImportJobEvents(context.env, {
      importJobId: jobId,
      limit,
    });

    return context.json({
      events: events.map(publicImportJobEvent),
    });
  });
}
