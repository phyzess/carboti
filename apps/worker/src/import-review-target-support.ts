import type { CurrentUser } from "./auth-types";
import { readCurrentUser, requirePermission } from "./auth-routes";
import { authError, type AppContext } from "./http-utils";
import { getImportAdapter, type WorkerImportAdapter } from "./import-adapters";
import { readImportJobReview } from "./import-review-job-read";
import type { ImportJobReviewRow } from "./import-review-row-types";

type TargetFailure = {
  ok: false;
  response: Response;
};

export type ImportReviewAuthorizedUserResult =
  | {
      ok: true;
      current: CurrentUser;
    }
  | TargetFailure;

export type ImportReviewJobAdapterResult =
  | {
      ok: true;
      adapter: WorkerImportAdapter;
      job: ImportJobReviewRow;
      jobId: string;
    }
  | TargetFailure;

export async function readImportReviewAuthorizedUser(
  context: AppContext,
  permission: "import_job:commit" | "review:decide",
): Promise<ImportReviewAuthorizedUserResult> {
  const current = await readCurrentUser(context);
  if (!current) {
    return {
      ok: false,
      response: authError(context, "unauthorized", "Login is required.", 401),
    };
  }

  const denied = await requirePermission(context, current, permission);
  if (denied) {
    return {
      ok: false,
      response: denied,
    };
  }

  return {
    ok: true,
    current,
  };
}

export async function readImportReviewJobAdapter(
  context: AppContext,
  jobId: string,
): Promise<ImportReviewJobAdapterResult> {
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
    adapter,
    job,
    jobId,
  };
}
