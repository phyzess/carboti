import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import { prepareImportJobEventInsert } from "./import-job-event-store";
import type { ImportJobReviewRow } from "./import-review-row-types";

export function prepareImportJobRetryStatements(
  env: Env,
  input: {
    actorUserId: string;
    job: ImportJobReviewRow;
    jobId: string;
    now: string;
    requestId: string | null;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        UPDATE import_jobs
        SET
          status = 'queued',
          failure_reason = NULL,
          failure_class = NULL,
          processing_started_at = NULL,
          completed_at = NULL,
          updated_at = ?
        WHERE id = ? AND status = 'failed'
      `,
    ).bind(input.now, input.jobId),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "import_job.retry_queued",
        actor: {
          id: input.actorUserId,
          kind: "user",
        },
        subject: {
          id: input.jobId,
          kind: "import_job",
        },
        metadata: {
          sourceFileId: input.job.source_file_id,
          objectKey: input.job.object_key,
          previousFailureClass: input.job.failure_class,
        },
      }),
    ),
    prepareImportJobEventInsert(env, {
      importJobId: input.jobId,
      sourceFileId: input.job.source_file_id,
      eventType: "import_job.retry_queued",
      statusFrom: "failed",
      statusTo: "queued",
      actorUserId: input.actorUserId,
      message: "Import job retry queued.",
      requestId: input.requestId,
      createdAt: input.now,
      metadata: {
        previousFailureClass: input.job.failure_class,
      },
    }),
  ];
}
