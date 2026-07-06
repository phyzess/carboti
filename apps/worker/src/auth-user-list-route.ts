import type { Hono } from "hono";
import { requirePermission } from "./auth-permissions";
import { mapUser } from "./auth-presenters";
import { readCurrentUser } from "./auth-session";
import type { UserRow } from "./auth-types";
import { authError, parseQueryLimit } from "./http-utils";

export function registerAuthUserListRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/users", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }
    const denied = await requirePermission(context, current, "invitation:create");
    if (denied) return denied;

    const limit = parseQueryLimit(context.req.query("limit"), 50);
    const result = await context.env.DB.prepare(
      `
        SELECT id, email, role, display_name, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT ?
      `,
    )
      .bind(limit)
      .all<UserRow>();

    return context.json({
      users: result.results.map(mapUser),
    });
  });
}
