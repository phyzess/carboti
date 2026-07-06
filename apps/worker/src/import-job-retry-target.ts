import { readCurrentUser, requirePermission } from "./auth-routes";
import { authError, type AppContext } from "./http-utils";
import { readImportJobReview } from "./import-review-job-read";
import type { ImportJobReviewRow } from "./import-review-row-types";
import type { CurrentUser } from "./auth-types";

type ImportJobRetryTargetResult =
  | {
      ok: true;
      current: CurrentUser;
      job: ImportJobReviewRow;
      jobId: string;
    }
  | {
      ok: false;
      response: Response;
    };

export async function readImportJobRetryTarget(
  context: AppContext,
): Promise<ImportJobRetryTargetResult> {
  const current = await readCurrentUser(context);
  if (!current) {
    return {
      ok: false,
      response: authError(context, "unauthorized", "Login is required.", 401),
    };
  }

  const denied = await requirePermission(context, current, "import_job:retry");
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

  if (job.status !== "failed") {
    return {
      ok: false,
      response: authError(
        context,
        "import_job_not_failed",
        "Only failed import jobs can be retried.",
        409,
      ),
    };
  }

  return {
    ok: true,
    current,
    job,
    jobId,
  };
}
