import type { Hono } from "hono";
import { readCurrentUser } from "./auth-session";

export function registerAuthCurrentUserRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/auth/me", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return context.json({
        user: null,
      });
    }

    return context.json({
      user: current.user,
      session: {
        id: current.sessionId,
        expiresAt: current.expiresAt,
      },
    });
  });
}
