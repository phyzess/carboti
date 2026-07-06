import { createInviteExpiry, generateToken, hashSecret } from "@carboti/auth";
import type { Hono } from "hono";
import { buildInvitationUrl, publicEmailDelivery, sendInvitationEmail } from "./auth-email";
import { requireInvitationManager } from "./auth-invitation-access";
import { prepareInvitationResendStatements } from "./auth-invitation-resend-record";
import { readInvitationById } from "./auth-invitation-store";
import { publicInvitationListItem } from "./auth-presenters";
import { isLocalRuntime } from "./auth-route-support";
import type { InvitationRow } from "./auth-types";
import { authError } from "./http-utils";
import { localeFromRequest } from "./locale";

export function registerAuthInvitationResendRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/invitations/:invitationId/resend", async (context) => {
    const manager = await requireInvitationManager(context);
    if (!manager.ok) return manager.response;

    const invitationId = context.req.param("invitationId");
    const invitation = await readInvitationById(context, invitationId);

    if (!invitation) {
      return authError(context, "invitation_not_found", "Invitation was not found.", 404);
    }

    if (invitation.status !== "pending" && invitation.status !== "expired") {
      return authError(
        context,
        "invitation_not_resendable",
        "Only pending or expired invitations can be resent.",
        409,
      );
    }

    const token = generateToken();
    const tokenHash = await hashSecret(token);
    const now = new Date().toISOString();
    const expiresAt = createInviteExpiry(new Date(now));
    const inviteUrlResult = buildInvitationUrl(context, token);
    if (!inviteUrlResult.ok) return inviteUrlResult.response;

    await context.env.DB.batch(
      prepareInvitationResendStatements(context.env, {
        actorUserId: manager.current.user.id,
        expiresAt,
        invitation,
        tokenHash,
      }),
    );

    const delivery = await sendInvitationEmail(context, {
      invitationId: invitation.id,
      email: invitation.email,
      locale: localeFromRequest(context, undefined),
      role: invitation.role,
      url: inviteUrlResult.url,
      resent: true,
    });

    const updatedInvitation: InvitationRow = {
      ...invitation,
      expires_at: expiresAt,
      latest_email_error_message: delivery.errorMessage ?? null,
      latest_email_message_id: delivery.id,
      latest_email_provider_message_id: delivery.providerMessageId ?? null,
      latest_email_status: delivery.status,
      revoked_at: null,
      status: "pending",
      token_hash: tokenHash,
    };

    return context.json({
      delivery: delivery.status,
      emailDelivery: publicEmailDelivery(delivery),
      invitation: publicInvitationListItem(updatedInvitation),
      ...(isLocalRuntime(context)
        ? {
            inviteToken: token,
            inviteUrl: inviteUrlResult.url,
          }
        : {}),
    });
  });
}
