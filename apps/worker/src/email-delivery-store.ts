import type { EmailDeliveryStatus } from "@carboti/email";

export async function recordEmailDelivery(
  env: Env,
  input: {
    createdAt: string;
    errorMessage: string | null;
    id: string;
    kind: "invitation" | "password_reset";
    metadata: Record<string, unknown> | undefined;
    provider: string;
    providerMessageId: string | undefined;
    recipientEmail: string;
    sentAt: string | null;
    status: EmailDeliveryStatus;
    subject: string;
  },
): Promise<void> {
  await env.DB.prepare(
    `
      INSERT INTO email_messages (
        id,
        kind,
        recipient_email,
        subject,
        status,
        provider,
        provider_message_id,
        error_message,
        metadata_json,
        created_at,
        sent_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  )
    .bind(
      input.id,
      input.kind,
      input.recipientEmail,
      input.subject,
      input.status,
      input.provider,
      input.providerMessageId ?? null,
      input.errorMessage,
      JSON.stringify(input.metadata ?? {}),
      input.createdAt,
      input.sentAt,
    )
    .run();
}
