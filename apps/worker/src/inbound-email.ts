import { intakeInboundEmailAttachments } from "./inbound-email-attachments";
import { inboundEmailStatus, writeInboundEmailReceipt } from "./inbound-email-store";
import { parseMimeAttachments } from "./mime-parser";

export async function handleInboundEmail(
  message: ForwardableEmailMessage,
  env: Env,
): Promise<void> {
  const receivedAt = new Date().toISOString();
  const inboundEmailId = crypto.randomUUID();
  const rawObjectKey = `raw-emails/${receivedAt.slice(0, 10)}/${inboundEmailId}.eml`;
  const rawBytes = await new Response(message.raw).arrayBuffer();
  const rawText = new TextDecoder().decode(rawBytes);
  const subject = message.headers.get("subject") ?? undefined;

  await env.SOURCE_FILES.put(rawObjectKey, rawBytes, {
    customMetadata: {
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
  });
  const status = inboundEmailStatus(attachmentResults);

  await writeInboundEmailReceipt(env, {
    attachmentCount: attachments.length,
    attachmentResults,
    from: message.from,
    inboundEmailId,
    rawObjectKey,
    rawSize: message.rawSize,
    receivedAt,
    status,
    subject,
    to: message.to,
  });
}
