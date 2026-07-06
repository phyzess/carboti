import type { Hono } from "hono";
import { requireInvitationManager } from "./auth-invitation-access";
import { prepareInvitationRevokeStatements } from "./auth-invitation-state-record";
import { readInvitationById } from "./auth-invitation-store";
import { publicInvitationListItem } from "./auth-presenters";
import { authError } from "./http-utils";

export function registerAuthInvitationRevokeRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/invitations/:invitationId/revoke", async (context) => {
    const manager = await requireInvitationManager(context);
    if (!manager.ok) return manager.response;

    const invitationId = context.req.param("invitationId");
    const invitation = await readInvitationById(context, invitationId);

    if (!invitation) {
      return authError(context, "invitation_not_found", "Invitation was not found.", 404);
    }

    if (invitation.status !== "pending") {
      return authError(context, "invitation_not_pending", "Invitation is no longer pending.", 409);
    }

    const now = new Date().toISOString();
    await context.env.DB.batch(
      prepareInvitationRevokeStatements(context.env, {
        actorUserId: manager.current.user.id,
        invitation,
        revokedAt: now,
      }),
    );

    return context.json({
      invitation: publicInvitationListItem({
        ...invitation,
        revoked_at: now,
        status: "revoked",
      }),
    });
  });
}
