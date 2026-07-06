import type { Hono } from "hono";
import { registerAuthInvitationAcceptRoute } from "./auth-invitation-accept-route";
import { registerAuthInvitationCreateRoute } from "./auth-invitation-create-route";
import { registerAuthInvitationDeleteRoute } from "./auth-invitation-delete-route";
import { registerAuthInvitationListRoute } from "./auth-invitation-list-route";
import { registerAuthInvitationResendRoute } from "./auth-invitation-resend-route";
import { registerAuthInvitationRevokeRoute } from "./auth-invitation-revoke-route";

export function registerAuthInvitationRoutes(app: Hono<{ Bindings: Env }>): void {
  registerAuthInvitationAcceptRoute(app);
  registerAuthInvitationListRoute(app);
  registerAuthInvitationCreateRoute(app);
  registerAuthInvitationRevokeRoute(app);
  registerAuthInvitationResendRoute(app);
  registerAuthInvitationDeleteRoute(app);
}
