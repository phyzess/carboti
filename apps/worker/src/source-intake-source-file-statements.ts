import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import { prepareImportJobEventInsert } from "./import-job-event-store";
import type { SourceFileImportJobInsertInput } from "./source-intake-inserts";

export function prepareSourceFileUploadedStatements(
  env: Env,
  input: SourceFileImportJobInsertInput,
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        INSERT INTO source_files (
          id, workspace_id, object_key, filename, content_type, content_hash, size, uploaded_by, uploaded_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      input.sourceFileId,
      input.workspaceId,
      input.objectKey,
      input.filename,
      input.contentType,
      input.contentHash,
      input.size,
      input.actor.id,
      input.uploadedAt,
    ),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "source_file.uploaded",
        actor: input.actor,
        metadata: {
          adapterId: input.adapterId,
          contentHash: input.contentHash,
          contentType: input.contentType,
          filename: input.filename,
          importJobId: input.importJobId,
          objectKey: input.objectKey,
          workspaceId: input.workspaceId,
          ...input.metadata,
        },
        subject: {
          id: input.sourceFileId,
          kind: "source_file",
        },
      }),
    ),
    prepareImportJobEventInsert(env, {
      actorUserId: input.actor.kind === "user" ? input.actor.id : null,
      createdAt: input.uploadedAt,
      eventType: "source_file.uploaded",
      importJobId: input.importJobId,
      message: "Source file stored.",
      metadata: {
        contentHash: input.contentHash,
        contentType: input.contentType,
        filename: input.filename,
        workspaceId: input.workspaceId,
        ...input.metadata,
      },
      requestId: input.requestId ?? null,
      sourceFileId: input.sourceFileId,
      statusTo: "stored",
    }),
  ];
}
