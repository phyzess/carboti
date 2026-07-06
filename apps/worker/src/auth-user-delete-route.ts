import type { Hono } from "hono";
import { requirePermission } from "./auth-permissions";
import { deleteUserRecord } from "./auth-user-delete-record";
import { readCurrentUser } from "./auth-session";
import type { UserRow } from "./auth-types";
import { authError } from "./http-utils";
import { normalizeAppRole } from "./rbac-policy";

export function registerAuthUserDeleteRoute(app: Hono<{ Bindings: Env }>): void {
  app.delete("/api/users/:userId", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }
    const denied = await requirePermission(context, current, "invitation:create");
    if (denied) return denied;

    const userId = context.req.param("userId");
    if (userId === current.user.id) {
      return authError(
        context,
        "cannot_delete_self",
        "Administrators cannot delete themselves.",
        409,
      );
    }

    const user = await context.env.DB.prepare(
      `
        SELECT id, email, role, display_name, created_at
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
    )
      .bind(userId)
      .first<UserRow>();

    if (!user) {
      return authError(context, "user_not_found", "User was not found.", 404);
    }

    const role = normalizeAppRole(user.role);
    if (role === "owner" || role === "admin") {
      const remainingAdmin = await context.env.DB.prepare(
        `
          SELECT id
          FROM users
          WHERE id != ?
            AND role IN ('owner', 'admin')
          LIMIT 1
        `,
      )
        .bind(user.id)
        .first<{ id: string }>();

      if (!remainingAdmin) {
        return authError(
          context,
          "last_admin_member",
          "At least one owner or admin must remain.",
          409,
        );
      }
    }

    await deleteUserRecord({
      context,
      current,
      role,
      user,
    });

    return context.json({
      deletedUserId: user.id,
      ok: true,
    });
  });
}
