import type { LoginRow } from "./auth-types";

export async function readLoginUserByEmail(env: Env, email: string): Promise<LoginRow | null> {
  return env.DB.prepare(
    `
      SELECT
        users.id,
        users.email,
        users.role,
        users.display_name,
        users.created_at,
        password_credentials.password_hash
      FROM users
      INNER JOIN password_credentials ON password_credentials.user_id = users.id
      WHERE users.email = ?
      LIMIT 1
    `,
  )
    .bind(email)
    .first<LoginRow>();
}
