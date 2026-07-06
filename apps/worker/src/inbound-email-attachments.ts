import { hashSourceContent } from "@carboti/files";
import type { ParsedAttachment } from "./mime-parser";
import { createSourceFileImportJob } from "./source-intake";
import type { SourceIntakeResult } from "./source-intake-types";

export type InboundEmailAttachmentResult = {
  attachment: ParsedAttachment;
  contentHash: string;
  intake: SourceIntakeResult;
  rawObjectKey: string;
};

export async function intakeInboundEmailAttachments(
  env: Env,
  input: {
    attachments: ParsedAttachment[];
    inboundEmailId: string;
    rawObjectKey: string;
    receivedAt: string;
  },
): Promise<InboundEmailAttachmentResult[]> {
  const attachmentResults: InboundEmailAttachmentResult[] = [];

  for (const [index, attachment] of input.attachments.entries()) {
    const contentHash = await hashSourceContent(attachment.content);
    const rawObjectKey = buildRawAttachmentObjectKey({
      filename: attachment.filename,
      inboundEmailId: input.inboundEmailId,
      index,
      receivedAt: input.receivedAt,
    });

    await env.SOURCE_FILES.put(rawObjectKey, attachment.content, {
      customMetadata: {
        contentHash,
        inboundEmailId: input.inboundEmailId,
        rawEmailObjectKey: input.rawObjectKey,
      },
      httpMetadata: {
        contentType: attachment.contentType,
      },
    });

    const intake = await createSourceFileImportJob(env, {
      actor: {
        id: "system:inbound-email",
        kind: "system",
      },
      content: attachment.content,
      contentType: attachment.contentType,
      filename: attachment.filename,
      metadata: {
        inboundEmailId: input.inboundEmailId,
        rawObjectKey: input.rawObjectKey,
        source: "inbound_email",
      },
      workspaceId: "default",
    });

    attachmentResults.push({
      attachment,
      contentHash,
      intake,
      rawObjectKey,
    });
  }

  return attachmentResults;
}

function buildRawAttachmentObjectKey(input: {
  filename: string;
  inboundEmailId: string;
  index: number;
  receivedAt: string;
}): string {
  const safeFilename = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `raw-emails/${input.receivedAt.slice(0, 10)}/${input.inboundEmailId}/attachments/${String(
    input.index + 1,
  ).padStart(3, "0")}-${safeFilename}`;
}
