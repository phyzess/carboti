import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import { prepareImportJobEventInsert } from "./import-job-event-store";
import type { SourceFileImportJobInsertInput } from "./source-intake-inserts";

export function prepareQueuedImportJobStatements(
  env: Env,
  input: SourceFileImportJobInsertInput,
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        INSERT INTO import_jobs (
          id,
          source_file_id,
          status,
          job_kind,
          adapter_id,
          idempotency_key,
          attempt_count,
          created_by,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      input.importJobId,
      input.sourceFileId,
      "queued",
      input.jobKind,
      input.adapterId,
      input.idempotencyKey,
      0,
      input.actor.id,
      input.uploadedAt,
      input.uploadedAt,
    ),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "import_job.queued",
        actor: input.actor,
        metadata: {
          adapterId: input.adapterId,
          jobKind: input.jobKind,
          objectKey: input.objectKey,
          sourceFileId: input.sourceFileId,
          ...input.metadata,
        },
        subject: {
          id: input.importJobId,
          kind: "import_job",
        },
      }),
    ),
    prepareImportJobEventInsert(env, {
      actorUserId: input.actor.kind === "user" ? input.actor.id : null,
      createdAt: input.uploadedAt,
      eventType: "import_job.queued",
      importJobId: input.importJobId,
      message: "Import job queued.",
      metadata: {
        adapterId: input.adapterId,
        jobKind: input.jobKind,
        objectKey: input.objectKey,
        ...input.metadata,
      },
      requestId: input.requestId ?? null,
      sourceFileId: input.sourceFileId,
      statusTo: "queued",
    }),
  ];
}
