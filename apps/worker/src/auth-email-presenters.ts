import type { EmailDeliveryRecord } from "./auth-email-delivery";

export function publicEmailDelivery(
  delivery: EmailDeliveryRecord,
): Record<string, string | undefined> {
  return {
    emailMessageId: delivery.id,
    errorMessage: delivery.errorMessage,
    mode: delivery.mode,
    provider: delivery.provider,
    providerMessageId: delivery.providerMessageId,
    sentAt: delivery.sentAt,
    status: delivery.status,
  };
}
