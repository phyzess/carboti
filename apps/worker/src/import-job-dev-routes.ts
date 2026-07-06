import type { ImportJobMessage } from "@carboti/jobs";
import type { Hono } from "hono";
import { readCurrentUser, requirePermission } from "./auth-routes";
import { authError, parseQueryLimit, type AppContext } from "./http-utils";
import { processImportJob } from "./import-job-runner";
import { isLocalAppEnv } from "./runtime";

type PendingImportJobRow = {
  id: string;
  source_file_id: string;
  object_key: string;
  created_by: string;
};

export function registerImportJobDevRoutes(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/dev/import-jobs/drain", async (context) => {
    if (!isLocalRuntime(context)) {
      return authError(context, "dev_route_disabled", "This route is only available locally.", 403);
    }

    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }
    const denied = await requirePermission(context, current, "import_job:process");
    if (denied) return denied;

    const limit = parseQueryLimit(context.req.query("limit"), 10);
    const queuedJobs = await context.env.DB.prepare(
      `
      SELECT
        import_jobs.id,
        import_jobs.source_file_id,
        import_jobs.created_by,
        source_files.object_key
      FROM import_jobs
      INNER JOIN source_files ON source_files.id = import_jobs.source_file_id
      WHERE import_jobs.status = 'queued'
      ORDER BY import_jobs.created_at ASC
      LIMIT ?
    `,
    )
      .bind(limit)
      .all<PendingImportJobRow>();

    const processedJobIds: string[] = [];
    for (const job of queuedJobs.results) {
      const message: ImportJobMessage = {
        kind: "import.source_file",
        jobId: job.id,
        sourceFileId: job.source_file_id,
        objectKey: job.object_key,
        requestedBy: job.created_by,
      };
      await processImportJob(context.env, message);
      processedJobIds.push(job.id);
    }

    return context.json({
      processedCount: processedJobIds.length,
      processedJobIds,
    });
  });
}

function isLocalRuntime(context: AppContext): boolean {
  return isLocalAppEnv(context.env);
}
