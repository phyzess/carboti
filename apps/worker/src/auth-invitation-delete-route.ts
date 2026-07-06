import type { Hono } from "hono";
import { requireInvitationManager } from "./auth-invitation-access";
import { prepareInvitationDeleteStatements } from "./auth-invitation-state-record";
import { readInvitationById } from "./auth-invitation-store";
import { authError } from "./http-utils";

export function registerAuthInvitationDeleteRoute(app: Hono<{ Bindings: Env }>): void {
  app.delete("/api/invitations/:invitationId", async (context) => {
    const manager = await requireInvitationManager(context);
    if (!manager.ok) return manager.response;

    const invitationId = context.req.param("invitationId");
    const invitation = await readInvitationById(context, invitationId);

    if (!invitation) {
      return authError(context, "invitation_not_found", "Invitation was not found.", 404);
    }

    if (invitation.status !== "revoked") {
      return authError(
        context,
        "invitation_not_revoked",
        "Only revoked invitations can be deleted.",
        409,
      );
    }

    await context.env.DB.batch(
      prepareInvitationDeleteStatements(context.env, {
        actorUserId: manager.current.user.id,
        invitation,
      }),
    );

    return context.json({
      deletedInvitationId: invitation.id,
      ok: true,
    });
  });
}
