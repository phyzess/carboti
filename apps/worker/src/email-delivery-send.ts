import type { EmailDeliveryStatus, EmailMessage } from "@carboti/email";
import { appName } from "./runtime";

export type EmailSendAttempt = {
  errorMessage: string | null;
  providerMessageId: string | undefined;
  sentAt: string | null;
  status: EmailDeliveryStatus;
};

export async function sendEmailMessage(
  env: Env,
  input: {
    mailFrom: string | undefined;
    replyTo: string | undefined;
    message: EmailMessage;
  },
): Promise<EmailSendAttempt> {
  try {
    const configError = validateSendConfig(input.mailFrom);
    if (configError) {
      throw new Error(configError);
    }

    const result: unknown = await env.EMAIL.send({
      to: input.message.to,
      from: {
        email: input.message.from.email,
        name: input.message.from.name ?? appName(env),
      },
      subject: input.message.subject,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
      ...(input.message.text ? { text: input.message.text } : {}),
      ...(input.message.html ? { html: input.message.html } : {}),
    });

    return {
      errorMessage: null,
      providerMessageId: providerMessageIdFrom(result),
      sentAt: new Date().toISOString(),
      status: "sent",
    };
  } catch (error) {
    return {
      errorMessage: deliveryErrorMessage(error),
      providerMessageId: undefined,
      sentAt: null,
      status: "failed",
    };
  }
}

function providerMessageIdFrom(result: unknown): string | undefined {
  if (!result || typeof result !== "object") {
    return undefined;
  }

  const candidate =
    "messageId" in result ? result.messageId : "id" in result ? result.id : undefined;
  return typeof candidate === "string" ? candidate : undefined;
}

function validateSendConfig(mailFrom: string | undefined): string | null {
  if (!mailFrom) {
    return "MAIL_FROM is required when EMAIL_DELIVERY_MODE=send.";
  }

  const domain = mailFrom.split("@")[1]?.toLowerCase();
  if (!domain) {
    return "MAIL_FROM must include a sending domain.";
  }

  if (domain === "example.com" || domain.endsWith(".example.com")) {
    return "MAIL_FROM must be replaced with a verified Cloudflare Email sender.";
  }

  return null;
}

function deliveryErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Email delivery failed.";
  }

  const maybeCode = (error as { code?: unknown }).code;
  return typeof maybeCode === "string" ? `${maybeCode}: ${error.message}` : error.message;
}
