import { type EmailDeliveryStatus, type EmailMessage } from "@carboti/email";
import { sendEmailMessage } from "./email-delivery-send";
import { recordEmailDelivery } from "./email-delivery-store";
import { appName, emailDeliveryMode, runtimeConfig } from "./runtime";

export async function deliverEmail(
  env: Env,
  input: {
    kind: "invitation" | "password_reset";
    to: string;
    subject: string;
    html: string;
    text: string;
    metadata?: Record<string, unknown>;
  },
): Promise<{
  errorMessage?: string;
  id: string;
  mode: "store" | "send";
  status: EmailDeliveryStatus;
  provider: string;
  providerMessageId?: string;
  sentAt?: string;
}> {
  const config = runtimeConfig(env);
  const mode = emailDeliveryMode(env);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const provider = mode === "send" ? "cloudflare_email" : "store";
  const message: EmailMessage = {
    to: input.to,
    from: {
      email: config.MAIL_FROM ?? "noreply@example.com",
      name: appName(env),
    },
    subject: input.subject,
    html: input.html,
    text: input.text,
  };

  let status: EmailDeliveryStatus = "stored";
  let providerMessageId: string | undefined;
  let errorMessage: string | null = null;
  let sentAt: string | null = null;

  if (mode === "send") {
    const sendAttempt = await sendEmailMessage(env, {
      mailFrom: config.MAIL_FROM,
      message,
      replyTo: config.MAIL_REPLY_TO,
    });
    status = sendAttempt.status;
    providerMessageId = sendAttempt.providerMessageId;
    errorMessage = sendAttempt.errorMessage;
    sentAt = sendAttempt.sentAt;
  }

  await recordEmailDelivery(env, {
    createdAt: now,
    errorMessage,
    id,
    kind: input.kind,
    metadata: input.metadata,
    provider,
    providerMessageId,
    recipientEmail: input.to,
    sentAt,
    status,
    subject: input.subject,
  });

  return {
    id,
    status,
    provider,
    mode,
    ...(errorMessage ? { errorMessage } : {}),
    ...(providerMessageId ? { providerMessageId } : {}),
    ...(sentAt ? { sentAt } : {}),
  };
}
