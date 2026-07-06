import {
  ConfirmPasswordResetInputSchema,
  hashPassword,
  hashSecret,
  isExpired,
} from "@carboti/auth";
import type { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import {
  markPasswordResetTokenExpired,
  preparePasswordResetConfirmStatements,
} from "./auth-password-reset-confirm-record";
import { readPasswordResetConfirmToken } from "./auth-password-reset-confirm-target";
import { sessionCookieName } from "./auth-session";
import { authError, parseRequestJson } from "./http-utils";

export function registerAuthPasswordResetConfirmRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/auth/password-reset/confirm", async (context) => {
    const input = await parseRequestJson(context, ConfirmPasswordResetInputSchema);
    if (!input.ok) return input.response;

    const tokenHash = await hashSecret(input.value.token);
    const resetToken = await readPasswordResetConfirmToken(context.env, tokenHash);

    if (!resetToken) {
      return authError(
        context,
        "invalid_password_reset_token",
        "Password reset link is invalid.",
        404,
      );
    }

    if (resetToken.status !== "pending") {
      return authError(
        context,
        "password_reset_token_not_pending",
        "Password reset link has already been used.",
        409,
      );
    }

    if (isExpired(resetToken.expires_at)) {
      await markPasswordResetTokenExpired(context.env, resetToken.id);

      return authError(
        context,
        "password_reset_token_expired",
        "Password reset link is expired.",
        410,
      );
    }

    const now = new Date().toISOString();
    const passwordHash = await hashPassword(input.value.password);

    await context.env.DB.batch(
      preparePasswordResetConfirmStatements(context.env, {
        now,
        passwordHash,
        resetToken,
      }),
    );

    deleteCookie(context, sessionCookieName, {
      path: "/",
    });

    return context.json({
      ok: true,
    });
  });
}
