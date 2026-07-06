import { renderInvitationEmail, renderPasswordResetEmail } from "@carboti/email";
import { deliverEmail } from "./email-delivery";
import type { AppContext } from "./http-utils";
import type { WorkerLocale } from "./locale";
import { appName } from "./runtime";

export type EmailDeliveryRecord = Awaited<ReturnType<typeof deliverEmail>>;

export async function sendInvitationEmail(
  context: AppContext,
  input: {
    email: string;
    invitationId: string;
    locale: WorkerLocale;
    resent?: boolean;
    role: string;
    url: string;
  },
): Promise<EmailDeliveryRecord> {
  const email = renderInvitationEmail({
    appName: appName(context.env),
    email: input.email,
    locale: input.locale,
    url: input.url,
  });

  return deliverEmail(context.env, {
    kind: "invitation",
    to: input.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    metadata: {
      invitationId: input.invitationId,
      resent: input.resent === true,
      role: input.role,
    },
  });
}

export async function sendPasswordResetEmail(
  context: AppContext,
  input: {
    email: string;
    locale: WorkerLocale;
    tokenId: string;
    url: string;
    userId: string;
  },
): Promise<EmailDeliveryRecord> {
  const email = renderPasswordResetEmail({
    appName: appName(context.env),
    email: input.email,
    locale: input.locale,
    url: input.url,
  });

  return deliverEmail(context.env, {
    kind: "password_reset",
    to: input.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    metadata: {
      passwordResetTokenId: input.tokenId,
      userId: input.userId,
    },
  });
}
