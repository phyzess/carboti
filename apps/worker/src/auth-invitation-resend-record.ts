import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import type { InvitationRow } from "./auth-types";

export function prepareInvitationResendStatements(
  env: Env,
  input: {
    actorUserId: string;
    expiresAt: string;
    invitation: InvitationRow;
    tokenHash: string;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        UPDATE invitations
        SET status = 'pending',
            token_hash = ?,
            expires_at = ?,
            revoked_at = NULL
        WHERE id = ?
      `,
    ).bind(input.tokenHash, input.expiresAt, input.invitation.id),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "invitation.resent",
        actor: {
          id: input.actorUserId,
          kind: "user",
        },
        subject: {
          id: input.invitation.id,
          kind: "invitation",
        },
        metadata: {
          email: input.invitation.email,
          previousStatus: input.invitation.status,
          role: input.invitation.role,
        },
      }),
    ),
  ];
}
