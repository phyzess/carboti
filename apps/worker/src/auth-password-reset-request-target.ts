import type { UserRow } from "./auth-types";

export async function readPasswordResetRequestUser(
  env: Env,
  email: string,
): Promise<UserRow | null> {
  return env.DB.prepare(
    `
      SELECT id, email, role, display_name, created_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
  )
    .bind(email)
    .first<UserRow>();
}
