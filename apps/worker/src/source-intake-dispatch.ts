import type { ImportJobMessage } from "@carboti/jobs";
import { markImportJobFailed } from "./import-job-failure";
import type { SourceImportDispatchFailure } from "./source-intake-types";

export async function dispatchSourceImportJob(
  env: Env,
  input: {
    contentHash: string;
    jobId: string;
    message: ImportJobMessage;
    objectKey: string;
    sourceFileId: string;
  },
): Promise<SourceImportDispatchFailure | null> {
  try {
    await env.IMPORT_JOBS.send(input.message);
    return null;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Queue dispatch failed.";
    await markImportJobFailed(env, {
      action: "import_job.dispatch_failed",
      failureClass: "queue_dispatch",
      jobId: input.jobId,
      reason,
      sourceFileId: input.sourceFileId,
    });

    return {
      code: "queue_dispatch_failed",
      contentHash: input.contentHash,
      importJobId: input.jobId,
      message: "Source file was stored, but import job dispatch failed.",
      objectKey: input.objectKey,
      ok: false,
      sourceFileId: input.sourceFileId,
      status: 503,
    };
  }
}
