import type { Hono } from "hono";
import { requireInvitationManager } from "./auth-invitation-access";
import { listInvitations } from "./auth-invitation-store";
import { publicInvitationListItem } from "./auth-presenters";
import { parseQueryLimit } from "./http-utils";

export function registerAuthInvitationListRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/invitations", async (context) => {
    const manager = await requireInvitationManager(context);
    if (!manager.ok) return manager.response;

    const limit = parseQueryLimit(context.req.query("limit"), 50);
    const invitations = await listInvitations(context, limit);

    return context.json({
      invitations: invitations.map(publicInvitationListItem),
    });
  });
}
