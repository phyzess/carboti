import { getImportAdapter } from "./import-adapters";
import { readImportJobReview } from "./import-review-job-read";
import type { ImportJobReviewRow } from "./import-review-row-types";
import { readImportReviewStats, type ImportReviewStats } from "./import-review-stats";
import { readCurrentUser, requirePermission } from "./auth-routes";
import type { CurrentUser } from "./auth-types";
import { authError, type AppContext } from "./http-utils";

type AiAdvisoryGenerateTargetResult =
  | {
      ok: true;
      current: CurrentUser;
      job: ImportJobReviewRow;
      jobId: string;
      stats: ImportReviewStats;
    }
  | {
      ok: false;
      response: Response;
    };

export async function readAiAdvisoryGenerateTarget(
  context: AppContext,
): Promise<AiAdvisoryGenerateTargetResult> {
  const current = await readCurrentUser(context);
  if (!current) {
    return {
      ok: false,
      response: authError(context, "unauthorized", "Login is required.", 401),
    };
  }

  const denied = await requirePermission(context, current, "ai_advisory:write");
  if (denied) {
    return {
      ok: false,
      response: denied,
    };
  }

  const jobId = context.req.param("jobId");
  if (!jobId) {
    return {
      ok: false,
      response: authError(context, "import_job_not_found", "Import job was not found.", 404),
    };
  }

  const job = await readImportJobReview(context.env, jobId);
  if (!job) {
    return {
      ok: false,
      response: authError(context, "import_job_not_found", "Import job was not found.", 404),
    };
  }

  const adapter = getImportAdapter(job.adapter_id);
  if (!adapter) {
    return {
      ok: false,
      response: authError(
        context,
        "import_adapter_not_found",
        "Import adapter is not registered for this job.",
        409,
      ),
    };
  }

  return {
    ok: true,
    current,
    job,
    jobId,
    stats: await readImportReviewStats(context.env, adapter.reviewStore, jobId),
  };
}
