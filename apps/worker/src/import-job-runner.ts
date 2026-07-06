import type { ImportJobMessage } from "@carboti/jobs";
import { getImportAdapter } from "./import-adapters";
import { markImportJobFailed } from "./import-job-failure";
import { readImportProcessingJob } from "./import-job-processing-read";
import { markImportJobProcessingStarted } from "./import-job-processing-start";
import { stageImportJobRecords } from "./import-job-staging";

export async function processImportJob(env: Env, body: ImportJobMessage): Promise<void> {
  const now = new Date().toISOString();

  try {
    const job = await readImportProcessingJob(env, body.jobId);
    if (!job || job.status !== "queued") {
      return;
    }

    const adapter = getImportAdapter(job.adapter_id);
    if (!adapter) {
      await markImportJobFailed(env, {
        jobId: body.jobId,
        sourceFileId: body.sourceFileId,
        reason: `Import adapter is not registered: ${job.adapter_id ?? "none"}.`,
        action: "import_job.adapter_missing",
        failureClass: "adapter_missing",
      });
      return;
    }

    const processingStarted = await markImportJobProcessingStarted(env, {
      adapterId: adapter.id,
      jobId: body.jobId,
      objectKey: body.objectKey,
      sourceFileId: body.sourceFileId,
      startedAt: now,
    });
    if (!processingStarted) return;

    const sourceObject = await env.SOURCE_FILES.get(body.objectKey);
    if (!sourceObject) {
      await markImportJobFailed(env, {
        jobId: body.jobId,
        sourceFileId: body.sourceFileId,
        reason: "Source object was not found in R2.",
        action: "import_job.source_missing",
        failureClass: "source_missing",
      });
      return;
    }

    const stagedAt = new Date().toISOString();
    const stagedRecords = await adapter.parseAndStage(sourceObject.body);
    if (stagedRecords.length === 0) {
      await markImportJobFailed(env, {
        jobId: body.jobId,
        sourceFileId: body.sourceFileId,
        reason: "Import adapter did not produce any staged records.",
        action: "import_job.no_records",
        failureClass: "validation",
      });
      return;
    }

    await stageImportJobRecords(env, {
      adapter,
      importJobId: body.jobId,
      objectKey: body.objectKey,
      sourceFileId: body.sourceFileId,
      stagedAt,
      stagedRecords,
    });
  } catch (error) {
    await markImportJobFailed(env, {
      jobId: body.jobId,
      sourceFileId: body.sourceFileId,
      reason: error instanceof Error ? error.message : "Import job processing failed.",
      action: "import_job.failed",
      failureClass: "processing",
    });
  }
}
