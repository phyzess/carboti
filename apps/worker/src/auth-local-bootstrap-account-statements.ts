import type { LocalUserBootstrapStatementInput } from "./auth-local-bootstrap-statement-types";

export function prepareLocalUserBootstrapAccountStatements(
  env: Env,
  input: LocalUserBootstrapStatementInput,
): D1PreparedStatement[] {
  return [
    input.created
      ? env.DB.prepare(
          "INSERT INTO users (id, email, role, display_name, created_at) VALUES (?, ?, ?, ?, ?)",
        ).bind(
          input.user.id,
          input.user.email,
          input.user.role,
          input.user.displayName ?? null,
          input.user.createdAt,
        )
      : env.DB.prepare("UPDATE users SET role = ?, display_name = ? WHERE id = ?").bind(
          input.user.role,
          input.user.displayName ?? null,
          input.user.id,
        ),
    env.DB.prepare(
      `
        INSERT INTO password_credentials (user_id, password_hash, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          password_hash = excluded.password_hash,
          updated_at = excluded.updated_at
      `,
    ).bind(input.user.id, input.passwordHash, input.now),
    env.DB.prepare(
      "UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL",
    ).bind(input.now, input.user.id),
  ];
}
