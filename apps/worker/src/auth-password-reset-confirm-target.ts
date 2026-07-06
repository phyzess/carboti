import type { PasswordResetTokenRow } from "./auth-types";

export async function readPasswordResetConfirmToken(
  env: Env,
  tokenHash: string,
): Promise<PasswordResetTokenRow | null> {
  return env.DB.prepare(
    `
      SELECT
        id, user_id, email, token_hash, status, expires_at, created_at, used_at, revoked_at
      FROM password_reset_tokens
      WHERE token_hash = ?
      LIMIT 1
    `,
  )
    .bind(tokenHash)
    .first<PasswordResetTokenRow>();
}
