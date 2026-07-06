import { authError, type AppContext } from "./http-utils";
import type { WorkerImportAdapter } from "./import-adapters";
import type { ImportJobReviewRow } from "./import-review-row-types";
import type { StoredStagedRecordRow } from "./import-review-store";
import {
  type ImportReviewAuthorizedUserResult,
  readImportReviewAuthorizedUser,
  readImportReviewJobAdapter,
} from "./import-review-target-support";

type ConfirmPendingReviewerResult = ImportReviewAuthorizedUserResult;

type ConfirmPendingTargetResult =
  | {
      ok: true;
      adapter: WorkerImportAdapter;
      job: ImportJobReviewRow;
      jobId: string;
      pendingRecords: StoredStagedRecordRow[];
    }
  | {
      ok: false;
      response: Response;
    };

export async function readConfirmPendingReviewer(
  context: AppContext,
): Promise<ConfirmPendingReviewerResult> {
  return readImportReviewAuthorizedUser(context, "review:decide");
}

export async function readConfirmPendingTarget(
  context: AppContext,
): Promise<ConfirmPendingTargetResult> {
  const jobId = context.req.param("jobId");
  if (!jobId) {
    return {
      ok: false,
      response: authError(context, "import_job_not_found", "Import job was not found.", 404),
    };
  }

  const target = await readImportReviewJobAdapter(context, jobId);
  if (!target.ok) {
    return target;
  }

  return {
    ok: true,
    adapter: target.adapter,
    job: target.job,
    jobId,
    pendingRecords: await target.adapter.reviewStore.readPendingStagedRecords(context.env, jobId),
  };
}
