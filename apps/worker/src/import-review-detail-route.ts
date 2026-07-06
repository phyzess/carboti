import type { Hono } from "hono";
import { readCurrentUser } from "./auth-routes";
import { authError } from "./http-utils";
import { getImportAdapter } from "./import-adapters";
import { readImportJobReview } from "./import-review-job-read";
import {
  publicImportJobReview,
  publicImportReviewIssue,
  publicStagedRecord,
} from "./import-review-presenters";
import { readImportReviewIssues } from "./import-review-issue-queries";

export function registerImportReviewDetailRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/import-jobs/:jobId/review", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }

    const jobId = context.req.param("jobId");
    const job = await readImportJobReview(context.env, jobId);
    if (!job) {
      return authError(context, "import_job_not_found", "Import job was not found.", 404);
    }

    const adapter = getImportAdapter(job.adapter_id);
    if (!adapter) {
      return authError(
        context,
        "import_adapter_not_found",
        "Import adapter is not registered for this job.",
        409,
      );
    }

    const [records, issues] = await Promise.all([
      adapter.reviewStore.readStagedRecords(context.env, jobId),
      readImportReviewIssues(context.env, jobId),
    ]);

    return context.json({
      job: publicImportJobReview(job),
      records: records.map(publicStagedRecord),
      issues: issues.map(publicImportReviewIssue),
    });
  });
}
