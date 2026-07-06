import * as v from "valibot";

export const EmailAddressSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  name: v.optional(v.string()),
});

export const EmailMessageSchema = v.object({
  to: v.pipe(v.string(), v.email()),
  from: EmailAddressSchema,
  subject: v.string(),
  html: v.optional(v.string()),
  text: v.optional(v.string()),
});

export const EmailDeliveryStatusSchema = v.picklist(["sent", "stored", "failed"]);

export const InboundEmailAttachmentSchema = v.object({
  contentType: v.string(),
  filename: v.string(),
  objectKey: v.string(),
  size: v.number(),
  sourceFileId: v.optional(v.string()),
});

export const InboundEmailReceiptSchema = v.object({
  attachmentCount: v.number(),
  from: v.string(),
  id: v.string(),
  rawObjectKey: v.string(),
  receivedAt: v.string(),
  subject: v.optional(v.string()),
  to: v.string(),
});

export type EmailMessage = v.InferOutput<typeof EmailMessageSchema>;
export type EmailAddress = v.InferOutput<typeof EmailAddressSchema>;
export type EmailDeliveryStatus = v.InferOutput<typeof EmailDeliveryStatusSchema>;
export type InboundEmailAttachment = v.InferOutput<typeof InboundEmailAttachmentSchema>;
export type InboundEmailReceipt = v.InferOutput<typeof InboundEmailReceiptSchema>;

export type EmailDeliveryResult = {
  providerMessageId?: string;
  status: EmailDeliveryStatus;
};

export type EmailSender = {
  send(message: EmailMessage): Promise<EmailDeliveryResult>;
};
