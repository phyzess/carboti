import { createInvitation } from "@carboti/auth";
import { buildInvitationUrl, publicEmailDelivery, sendInvitationEmail } from "./auth-email";
import { prepareInvitationCreateStatements } from "./auth-invitation-create-record";
import { publicInvitation } from "./auth-presenters";
import { authError, type AppContext } from "./http-utils";
import type { WorkerLocale } from "./locale";
import { isAppRoleName } from "./rbac-policy";

export async function createInvitationResponse(
  context: AppContext,
  input: { email: string; role?: string | undefined },
  options: { createdBy: string; locale: WorkerLocale; returnToken: boolean },
): Promise<Response> {
  const requestedRole = input.role ?? "viewer";
  if (!isAppRoleName(requestedRole)) {
    return authError(context, "invalid_role", "Invitation role is not supported.", 400);
  }

  const invitationWithToken = await createInvitation({
    email: input.email,
    role: requestedRole,
    createdBy: options.createdBy,
  });

  const { invitation, token } = invitationWithToken;
  const inviteUrlResult = buildInvitationUrl(context, token);
  if (!inviteUrlResult.ok) return inviteUrlResult.response;

  await context.env.DB.batch(prepareInvitationCreateStatements(context.env, invitation));

  const delivery = await sendInvitationEmail(context, {
    invitationId: invitation.id,
    email: invitation.email,
    locale: options.locale,
    role: invitation.role,
    url: inviteUrlResult.url,
  });

  return context.json(
    {
      invitation: publicInvitation(invitation),
      delivery: delivery.status,
      emailDelivery: publicEmailDelivery(delivery),
      ...(options.returnToken
        ? {
            inviteToken: token,
            inviteUrl: inviteUrlResult.url,
          }
        : {}),
    },
    201,
  );
}
