import type { InboundEmailAttachmentResult } from "./inbound-email-attachments";

export type InboundEmailAttachmentInsertsInput = {
  attachmentResults: InboundEmailAttachmentResult[];
  inboundEmailId: string;
  receivedAt: string;
};

export function prepareInboundEmailAttachmentInserts(
  env: Env,
  input: InboundEmailAttachmentInsertsInput,
): D1PreparedStatement[] {
  return input.attachmentResults.map((result) =>
    env.DB.prepare(
      `
        INSERT INTO inbound_email_attachments (
          id,
          inbound_email_id,
          filename,
          content_type,
          size,
          source_file_id,
          import_job_id,
          object_key,
          status,
          error_message,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      crypto.randomUUID(),
      input.inboundEmailId,
      result.attachment.filename,
      result.attachment.contentType,
      result.attachment.size,
      result.intake.ok ? result.intake.sourceFileId : (result.intake.sourceFileId ?? null),
      result.intake.ok ? result.intake.importJobId : (result.intake.importJobId ?? null),
      result.intake.ok ? result.intake.objectKey : (result.intake.objectKey ?? null),
      result.intake.ok ? (result.intake.duplicate ? "duplicate" : "queued") : "failed",
      result.intake.ok ? null : result.intake.message,
      input.receivedAt,
    ),
  );
}
