import type { User } from "@carboti/auth";
import { isExpired } from "@carboti/auth";
import { normalizeAppRole } from "./rbac-policy";
import type { InvitationRow, UserRow } from "./auth-types";

export function publicInvitation(invitation: {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}): Record<string, string> {
  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
  };
}

export function publicInvitationListItem(invitation: InvitationRow): Record<string, string | null> {
  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    status: publicInvitationStatus(invitation),
    expiresAt: invitation.expires_at,
    createdBy: invitation.created_by,
    createdAt: invitation.created_at,
    acceptedAt: invitation.accepted_at,
    revokedAt: invitation.revoked_at,
    latestEmailErrorMessage: invitation.latest_email_error_message ?? null,
    latestEmailMessageId: invitation.latest_email_message_id ?? null,
    latestEmailProviderMessageId: invitation.latest_email_provider_message_id ?? null,
    latestEmailStatus: invitation.latest_email_status ?? null,
  };
}

function publicInvitationStatus(invitation: InvitationRow): string {
  return invitation.status === "pending" && isExpired(invitation.expires_at)
    ? "expired"
    : invitation.status;
}

export function publicSession(session: { id: string; expiresAt: string }): Record<string, string> {
  return {
    id: session.id,
    expiresAt: session.expiresAt,
  };
}

export function mapUser(row: UserRow): User {
  const user: User = {
    id: row.id,
    email: row.email,
    role: normalizeAppRole(row.role),
    createdAt: row.created_at,
  };

  if (row.display_name) {
    user.displayName = row.display_name;
  }

  return user;
}
