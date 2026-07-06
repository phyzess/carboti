import type { ImportJobMessage } from "@carboti/jobs";
import type { CurrentUser } from "./auth-types";
import type { AppContext } from "./http-utils";
import { markImportJobFailed } from "./import-job-failure";
import type { ImportJobReviewRow } from "./import-review-row-types";

export async function dispatchImportJobRetry(
  context: AppContext,
  input: {
    current: CurrentUser;
    job: ImportJobReviewRow;
    jobId: string;
  },
): Promise<Response | null> {
  const { current, job, jobId } = input;
  const message: ImportJobMessage = {
    kind: "import.source_file",
    jobId,
    sourceFileId: job.source_file_id,
    objectKey: job.object_key,
    requestedBy: current.user.id,
  };

  try {
    await context.env.IMPORT_JOBS.send(message);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Queue dispatch failed.";
    await markImportJobFailed(context.env, {
      jobId,
      sourceFileId: job.source_file_id,
      reason,
      action: "import_job.retry_dispatch_failed",
      failureClass: "queue_dispatch",
    });

    return context.json(
      {
        error: {
          code: "queue_dispatch_failed",
          message: "Import job retry was queued in D1, but queue dispatch failed.",
        },
      },
      503,
    );
  }

  return null;
}
