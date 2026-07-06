import { carbotiRawEmailObjectKey } from "@carboti/core";
import { hashSourceContent } from "@carboti/files";
import { intakeInboundEmailAttachments } from "./inbound-email-attachments";
import { inboundEmailStatus, writeInboundEmailReceipt } from "./inbound-email-store";
import { parseMimeAttachments, parseMimeTextBody } from "./mime-parser";

export async function handleInboundEmail(
  message: ForwardableEmailMessage,
  env: Env,
): Promise<void> {
  const receivedAt = new Date().toISOString();
  const inboundEmailId = crypto.randomUUID();
  const rawObjectKey = carbotiRawEmailObjectKey({
    messageId: inboundEmailId,
    receivedAt,
  });
  const rawBytes = await new Response(message.raw).arrayBuffer();
  const rawContentHash = await hashSourceContent(rawBytes);
  const rawText = new TextDecoder().decode(rawBytes);
  const subject = message.headers.get("subject") ?? undefined;
  const textBody = parseMimeTextBody(rawText);

  await env.SOURCE_FILES.put(rawObjectKey, rawBytes, {
    customMetadata: {
      contentHash: rawContentHash,
      from: message.from,
      inboundEmailId,
      to: message.to,
    },
    httpMetadata: {
      contentType: "message/rfc822",
    },
  });

  const attachments = parseMimeAttachments(rawText);
  const attachmentResults = await intakeInboundEmailAttachments(env, {
    attachments,
    inboundEmailId,
    rawObjectKey,
    receivedAt,
  });
  const status = inboundEmailStatus(attachmentResults);

  await writeInboundEmailReceipt(env, {
    attachmentCount: attachments.length,
    attachmentResults,
    from: message.from,
    inboundEmailId,
    rawContentHash,
    rawObjectKey,
    rawSize: message.rawSize,
    receivedAt,
    status,
    subject,
    textBody,
    to: message.to,
  });
}
