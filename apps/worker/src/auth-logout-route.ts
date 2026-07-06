import { hashSecret } from "@carboti/auth";
import type { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import { sessionCookieName } from "./auth-session";

export function registerAuthLogoutRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/auth/logout", async (context) => {
    const token = getCookie(context, sessionCookieName);
    if (token) {
      const tokenHash = await hashSecret(token);
      const now = new Date().toISOString();

      await context.env.DB.prepare(
        "UPDATE sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL",
      )
        .bind(now, tokenHash)
        .run();
    }

    deleteCookie(context, sessionCookieName, {
      path: "/",
    });

    return context.json({
      ok: true,
    });
  });
}
