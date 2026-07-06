import { createAuditEvent } from "@carboti/audit";
import type { PasswordResetToken } from "@carboti/auth";
import { prepareAuditInsert, writeAudit } from "./audit-store";

export async function writeUnknownPasswordResetRequestAudit(
  env: Env,
  email: string,
): Promise<void> {
  await writeAudit(
    env,
    createAuditEvent({
      action: "auth.password_reset_requested_unknown",
      actor: {
        id: "anonymous",
        kind: "system",
      },
      subject: {
        id: email,
        kind: "email",
      },
    }),
  );
}

export function preparePasswordResetRequestStatements(
  env: Env,
  input: {
    passwordResetToken: PasswordResetToken;
    userId: string;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        INSERT INTO password_reset_tokens (
          id, user_id, email, token_hash, status, expires_at, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      input.passwordResetToken.id,
      input.passwordResetToken.userId,
      input.passwordResetToken.email,
      input.passwordResetToken.tokenHash,
      input.passwordResetToken.status,
      input.passwordResetToken.expiresAt,
      input.passwordResetToken.createdAt,
    ),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "auth.password_reset_requested",
        actor: {
          id: "anonymous",
          kind: "system",
        },
        subject: {
          id: input.userId,
          kind: "user",
        },
      }),
    ),
  ];
}
