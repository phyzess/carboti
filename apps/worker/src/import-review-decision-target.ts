import type { CurrentUser } from "./auth-types";
import { authError, type AppContext } from "./http-utils";
import type { WorkerImportAdapter } from "./import-adapters";
import type { ImportJobReviewRow } from "./import-review-row-types";
import type { StoredStagedRecordRow } from "./import-review-store";
import {
  readImportReviewAuthorizedUser,
  readImportReviewJobAdapter,
} from "./import-review-target-support";

type ReviewDecisionTargetResult =
  | {
      ok: true;
      adapter: WorkerImportAdapter;
      current: CurrentUser;
      job: ImportJobReviewRow;
      jobId: string;
      record: StoredStagedRecordRow;
      recordId: string;
    }
  | {
      ok: false;
      response: Response;
    };

export async function readReviewDecisionTarget(
  context: AppContext,
): Promise<ReviewDecisionTargetResult> {
  const reviewer = await readImportReviewAuthorizedUser(context, "review:decide");
  if (!reviewer.ok) {
    return reviewer;
  }

  const jobId = context.req.param("jobId");
  const recordId = context.req.param("recordId");
  if (!jobId || !recordId) {
    return {
      ok: false,
      response: authError(context, "staged_record_not_found", "Staged record was not found.", 404),
    };
  }

  const target = await readImportReviewJobAdapter(context, jobId);
  if (!target.ok) {
    return target;
  }

  const record = await target.adapter.reviewStore.readStagedRecord(context.env, {
    id: recordId,
    importJobId: jobId,
  });
  if (!record) {
    return {
      ok: false,
      response: authError(context, "staged_record_not_found", "Staged record was not found.", 404),
    };
  }

  if (record.review_status === "committed") {
    return {
      ok: false,
      response: authError(
        context,
        "staged_record_committed",
        "Committed records cannot be reviewed again.",
        409,
      ),
    };
  }

  return {
    ok: true,
    adapter: target.adapter,
    current: reviewer.current,
    job: target.job,
    jobId,
    record,
    recordId,
  };
}
