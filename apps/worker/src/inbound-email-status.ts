import type { InboundEmailAttachmentResult } from "./inbound-email-attachments";

export function inboundEmailStatus(attachmentResults: InboundEmailAttachmentResult[]): string {
  if (attachmentResults.length === 0) {
    return "stored";
  }

  return attachmentResults.some((result) => !result.intake.ok) ? "partial" : "queued";
}
