import type { Hono } from "hono";
import { registerAuthPasswordResetConfirmRoute } from "./auth-password-reset-confirm-route";
import { registerAuthPasswordResetRequestRoute } from "./auth-password-reset-request-route";

export function registerAuthPasswordRoutes(app: Hono<{ Bindings: Env }>): void {
  registerAuthPasswordResetRequestRoute(app);
  registerAuthPasswordResetConfirmRoute(app);
}
