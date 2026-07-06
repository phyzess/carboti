import type { Hono } from "hono";
import { readCurrentUser } from "./auth-routes";
import { authError, parseQueryLimit } from "./http-utils";
import { publicImportJobListItem } from "./import-job-list-presenters";
import { readImportJobList } from "./import-job-list-query";

export function registerImportJobListRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/import-jobs", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }

    const workspaceId = context.req.query("workspaceId") ?? "default";
    const status = context.req.query("status") ?? null;
    const limit = parseQueryLimit(context.req.query("limit"), 50);
    const importJobs = await readImportJobList(context.env, {
      limit,
      status,
      workspaceId,
    });

    return context.json({
      importJobs: importJobs.map(publicImportJobListItem),
    });
  });
}
