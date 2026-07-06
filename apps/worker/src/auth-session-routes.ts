import type { Hono } from "hono";
import { registerAuthCurrentUserRoute } from "./auth-current-user-route";
import { registerAuthLoginRoute } from "./auth-login-route";
import { registerAuthLogoutRoute } from "./auth-logout-route";

export function registerAuthSessionRoutes(app: Hono<{ Bindings: Env }>): void {
  registerAuthLoginRoute(app);
  registerAuthLogoutRoute(app);
  registerAuthCurrentUserRoute(app);
}
