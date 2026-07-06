import {
  RequestPasswordResetInputSchema,
  createPasswordResetToken,
  normalizeEmail,
} from "@carboti/auth";
import type { Hono } from "hono";
import { buildPasswordResetUrl, publicEmailDelivery, sendPasswordResetEmail } from "./auth-email";
import { isLocalRuntime } from "./auth-local-runtime";
import {
  preparePasswordResetRequestStatements,
  writeUnknownPasswordResetRequestAudit,
} from "./auth-password-reset-request-record";
import { readPasswordResetRequestUser } from "./auth-password-reset-request-target";
import { parseRequestJson } from "./http-utils";
import { localeFromRequest } from "./locale";

export function registerAuthPasswordResetRequestRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/auth/password-reset/request", async (context) => {
    const input = await parseRequestJson(context, RequestPasswordResetInputSchema);
    if (!input.ok) return input.response;
    const locale = localeFromRequest(context, input.body);

    const email = normalizeEmail(input.value.email);
    const user = await readPasswordResetRequestUser(context.env, email);

    if (!user) {
      await writeUnknownPasswordResetRequestAudit(context.env, email);

      return context.json({
        ok: true,
      });
    }

    const { passwordResetToken, token } = await createPasswordResetToken({
      userId: user.id,
      email,
    });
    const resetUrlResult = buildPasswordResetUrl(context, token);
    if (!resetUrlResult.ok) return resetUrlResult.response;

    await context.env.DB.batch(
      preparePasswordResetRequestStatements(context.env, {
        passwordResetToken,
        userId: user.id,
      }),
    );

    const delivery = await sendPasswordResetEmail(context, {
      email,
      locale,
      tokenId: passwordResetToken.id,
      url: resetUrlResult.url,
      userId: user.id,
    });

    return context.json({
      ok: true,
      delivery: delivery.status,
      emailDelivery: publicEmailDelivery(delivery),
      ...(isLocalRuntime(context)
        ? {
            resetToken: token,
            resetUrl: resetUrlResult.url,
          }
        : {}),
    });
  });
}
