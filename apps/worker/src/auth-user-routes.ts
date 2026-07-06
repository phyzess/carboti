import type { Hono } from "hono";
import { registerAuthUserDeleteRoute } from "./auth-user-delete-route";
import { registerAuthUserListRoute } from "./auth-user-list-route";

export function registerAuthUserRoutes(app: Hono<{ Bindings: Env }>): void {
  registerAuthUserListRoute(app);
  registerAuthUserDeleteRoute(app);
}
