import { LoginInputSchema, normalizeEmail, verifyPassword } from "@carboti/auth";
import type { Hono } from "hono";
import { completeSuccessfulLogin, recordFailedLogin } from "./auth-login-record";
import { readLoginUserByEmail } from "./auth-login-user";
import { mapUser, publicSession } from "./auth-presenters";
import { writeSessionCookie } from "./auth-session";
import { authError, parseRequestJson } from "./http-utils";

export function registerAuthLoginRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/auth/login", async (context) => {
    const input = await parseRequestJson(context, LoginInputSchema);
    if (!input.ok) return input.response;

    const email = normalizeEmail(input.value.email);
    const row = await readLoginUserByEmail(context.env, email);

    const passwordMatches = row
      ? await verifyPassword(input.value.password, row.password_hash)
      : false;

    if (!row || !passwordMatches) {
      await recordFailedLogin({ context, email, row });
      return authError(context, "invalid_credentials", "Invalid email or password.", 401);
    }

    const user = mapUser(row);
    const { session, token } = await completeSuccessfulLogin({
      context,
      email,
      user,
    });

    writeSessionCookie(context, token, session.expiresAt);

    return context.json({
      user,
      session: publicSession(session),
    });
  });
}
