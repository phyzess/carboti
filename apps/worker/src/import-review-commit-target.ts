import type { CurrentUser } from "./auth-types";
import { authError, type AppContext } from "./http-utils";
import type { WorkerImportAdapter } from "./import-adapters";
import type { ImportJobReviewRow } from "./import-review-row-types";
import {
  readImportReviewAuthorizedUser,
  readImportReviewJobAdapter,
} from "./import-review-target-support";

type CommitTargetResult =
  | {
      ok: true;
      adapter: WorkerImportAdapter;
      current: CurrentUser;
      job: ImportJobReviewRow;
      jobId: string;
    }
  | {
      ok: false;
      response: Response;
    };

export async function readImportReviewCommitTarget(
  context: AppContext,
): Promise<CommitTargetResult> {
  const reviewer = await readImportReviewAuthorizedUser(context, "import_job:commit");
  if (!reviewer.ok) {
    return reviewer;
  }

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
    current: reviewer.current,
    job: target.job,
    jobId,
  };
}
