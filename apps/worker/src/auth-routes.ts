import type { Hono } from "hono";
import { registerAuthBootstrapRoutes } from "./auth-bootstrap-routes";
import { registerAuthInvitationRoutes } from "./auth-invitation-routes";
import { registerAuthPasswordRoutes } from "./auth-password-routes";
import { registerAuthSessionRoutes } from "./auth-session-routes";
import { registerAuthUserRoutes } from "./auth-user-routes";

export { requirePermission } from "./auth-permissions";
export { readCurrentUser } from "./auth-session";
export type { CurrentUser } from "./auth-types";

export function registerAuthRoutes(app: Hono<{ Bindings: Env }>): void {
  registerAuthBootstrapRoutes(app);
  registerAuthUserRoutes(app);
  registerAuthInvitationRoutes(app);
  registerAuthSessionRoutes(app);
  registerAuthPasswordRoutes(app);
}
