import { createAuditEvent } from "@carboti/audit";
import type { Session, User } from "@carboti/auth";
import { prepareAuditInsert } from "./audit-store";
import { prepareSessionInsert } from "./auth-session";
import type { InvitationRow } from "./auth-types";

export async function markInvitationExpired(env: Env, invitationId: string): Promise<void> {
  await env.DB.prepare(
    "UPDATE invitations SET status = 'expired' WHERE id = ? AND status = 'pending'",
  )
    .bind(invitationId)
    .run();
}

export function prepareInvitationAcceptStatements(
  env: Env,
  input: {
    invitation: InvitationRow;
    now: string;
    passwordHash: string;
    session: Session;
    user: User;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      "INSERT INTO users (id, email, role, display_name, created_at) VALUES (?, ?, ?, ?, ?)",
    ).bind(
      input.user.id,
      input.user.email,
      input.user.role,
      input.user.displayName ?? null,
      input.user.createdAt,
    ),
    env.DB.prepare(
      "INSERT INTO password_credentials (user_id, password_hash, updated_at) VALUES (?, ?, ?)",
    ).bind(input.user.id, input.passwordHash, input.now),
    env.DB.prepare("UPDATE invitations SET status = 'accepted', accepted_at = ? WHERE id = ?").bind(
      input.now,
      input.invitation.id,
    ),
    prepareSessionInsert(env, input.session),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "invitation.accepted",
        actor: {
          id: input.user.id,
          kind: "user",
        },
        subject: {
          id: input.invitation.id,
          kind: "invitation",
        },
        metadata: {
          email: input.user.email,
          role: input.invitation.role,
        },
      }),
    ),
  ];
}
