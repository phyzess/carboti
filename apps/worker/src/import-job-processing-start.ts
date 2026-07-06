import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import { prepareImportJobEventInsert } from "./import-job-event-store";

export async function markImportJobProcessingStarted(
  env: Env,
  input: {
    adapterId: string;
    jobId: string;
    objectKey: string;
    sourceFileId: string;
    startedAt: string;
  },
): Promise<boolean> {
  const processingResult = await env.DB.prepare(
    `
      UPDATE import_jobs
      SET
        status = 'processing',
        processing_started_at = ?,
        completed_at = NULL,
        failure_reason = NULL,
        failure_class = NULL,
        updated_at = ?,
        attempt_count = COALESCE(attempt_count, 0) + 1
      WHERE id = ? AND status = 'queued'
    `,
  )
    .bind(input.startedAt, input.startedAt, input.jobId)
    .run();

  if ((processingResult.meta.changes ?? 0) === 0) {
    return false;
  }

  await env.DB.batch([
    prepareImportJobEventInsert(env, {
      importJobId: input.jobId,
      sourceFileId: input.sourceFileId,
      eventType: "import_job.processing_started",
      statusFrom: "queued",
      statusTo: "processing",
      message: "Import job processing started.",
      createdAt: input.startedAt,
      metadata: {
        objectKey: input.objectKey,
        adapterId: input.adapterId,
      },
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "import_job.processing_started",
        actor: {
          id: "queue",
          kind: "system",
        },
        subject: {
          id: input.jobId,
          kind: "import_job",
        },
        metadata: {
          sourceFileId: input.sourceFileId,
          objectKey: input.objectKey,
          adapterId: input.adapterId,
        },
      }),
    ),
  ]);

  return true;
}
