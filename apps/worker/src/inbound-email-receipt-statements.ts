import { prepareInboundEmailAttachmentInserts } from "./inbound-email-attachment-statements";
import type { InboundEmailAttachmentResult } from "./inbound-email-attachments";
import { prepareInboundEmailReceivedAuditInsert } from "./inbound-email-audit-statements";
import { prepareInboundEmailMessageInsert } from "./inbound-email-message-statements";

export type InboundEmailReceiptInput = {
  attachmentCount: number;
  attachmentResults: InboundEmailAttachmentResult[];
  from: string;
  inboundEmailId: string;
  rawObjectKey: string;
  rawSize: number;
  receivedAt: string;
  status: string;
  subject: string | undefined;
  to: string;
};

export function prepareInboundEmailReceiptStatements(
  env: Env,
  input: InboundEmailReceiptInput,
): D1PreparedStatement[] {
  return [
    prepareInboundEmailMessageInsert(env, input),
    ...prepareInboundEmailAttachmentInserts(env, input),
    prepareInboundEmailReceivedAuditInsert(env, input),
  ];
}

export async function writeInboundEmailReceipt(
  env: Env,
  input: InboundEmailReceiptInput,
): Promise<void> {
  await env.DB.batch(prepareInboundEmailReceiptStatements(env, input));
}
