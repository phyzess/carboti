import type { ParsedAttachment } from "./mime-parser";
import { createSourceFileImportJob } from "./source-intake";
import type { SourceIntakeResult } from "./source-intake-types";

export type InboundEmailAttachmentResult = {
  attachment: ParsedAttachment;
  intake: SourceIntakeResult;
};

export async function intakeInboundEmailAttachments(
  env: Env,
  input: {
    attachments: ParsedAttachment[];
    inboundEmailId: string;
    rawObjectKey: string;
  },
): Promise<InboundEmailAttachmentResult[]> {
  const attachmentResults: InboundEmailAttachmentResult[] = [];

  for (const attachment of input.attachments) {
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
      intake,
    });
  }

  return attachmentResults;
}
