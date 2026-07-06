import type { Hono } from "hono";
import { registerAuditListRoute } from "./audit-list-route";

export function registerAuditRoutes(app: Hono<{ Bindings: Env }>): void {
  registerAuditListRoute(app);
}
