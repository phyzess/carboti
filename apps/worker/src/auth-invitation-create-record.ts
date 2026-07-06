import { createAuditEvent } from "@carboti/audit";
import type { Invitation } from "@carboti/auth";
import { prepareAuditInsert } from "./audit-store";

export function prepareInvitationCreateStatements(
  env: Env,
  invitation: Invitation,
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        INSERT INTO invitations (
          id, email, role, status, token_hash, expires_at, created_by, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      invitation.id,
      invitation.email,
      invitation.role,
      invitation.status,
      invitation.tokenHash,
      invitation.expiresAt,
      invitation.createdBy,
      invitation.createdAt,
    ),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "invitation.created",
        actor: {
          id: invitation.createdBy,
          kind: invitation.createdBy === "system" ? "system" : "user",
        },
        subject: {
          id: invitation.id,
          kind: "invitation",
        },
        metadata: {
          email: invitation.email,
          role: invitation.role,
        },
      }),
    ),
  ];
}
