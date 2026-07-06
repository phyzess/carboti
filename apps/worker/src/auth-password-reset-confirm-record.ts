import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import type { PasswordResetTokenRow } from "./auth-types";

export async function markPasswordResetTokenExpired(env: Env, tokenId: string): Promise<void> {
  await env.DB.prepare(
    "UPDATE password_reset_tokens SET status = 'expired' WHERE id = ? AND status = 'pending'",
  )
    .bind(tokenId)
    .run();
}

export function preparePasswordResetConfirmStatements(
  env: Env,
  input: {
    now: string;
    passwordHash: string;
    resetToken: PasswordResetTokenRow;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      "UPDATE password_credentials SET password_hash = ?, updated_at = ? WHERE user_id = ?",
    ).bind(input.passwordHash, input.now, input.resetToken.user_id),
    env.DB.prepare(
      "UPDATE password_reset_tokens SET status = 'used', used_at = ? WHERE id = ?",
    ).bind(input.now, input.resetToken.id),
    env.DB.prepare(
      "UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL",
    ).bind(input.now, input.resetToken.user_id),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "auth.password_reset_succeeded",
        actor: {
          id: input.resetToken.user_id,
          kind: "user",
        },
        subject: {
          id: input.resetToken.id,
          kind: "password_reset_token",
        },
      }),
    ),
  ];
}
