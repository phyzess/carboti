import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import type { InvitationRow } from "./auth-types";

export function prepareInvitationRevokeStatements(
  env: Env,
  input: {
    actorUserId: string;
    invitation: InvitationRow;
    revokedAt: string;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      "UPDATE invitations SET status = 'revoked', revoked_at = ? WHERE id = ? AND status = 'pending'",
    ).bind(input.revokedAt, input.invitation.id),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "invitation.revoked",
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
          role: input.invitation.role,
        },
      }),
    ),
  ];
}

export function prepareInvitationDeleteStatements(
  env: Env,
  input: {
    actorUserId: string;
    invitation: InvitationRow;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare("DELETE FROM invitations WHERE id = ?").bind(input.invitation.id),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "invitation.deleted",
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
          role: input.invitation.role,
          status: input.invitation.status,
        },
      }),
    ),
  ];
}
