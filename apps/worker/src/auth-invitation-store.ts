import type { InvitationRow } from "./auth-types";
import type { AppContext } from "./http-utils";

const invitationColumns = `
  id, email, role, status, token_hash, expires_at, created_by, created_at, accepted_at, revoked_at
`;

export async function listInvitations(
  context: AppContext,
  limit: number,
): Promise<InvitationRow[]> {
  const result = await context.env.DB.prepare(
    `
      SELECT
        ${invitationColumns},
        (
          SELECT email_messages.id
          FROM email_messages
          WHERE email_messages.kind = 'invitation'
            AND json_extract(email_messages.metadata_json, '$.invitationId') = invitations.id
          ORDER BY email_messages.created_at DESC
          LIMIT 1
        ) AS latest_email_message_id,
        (
          SELECT email_messages.status
          FROM email_messages
          WHERE email_messages.kind = 'invitation'
            AND json_extract(email_messages.metadata_json, '$.invitationId') = invitations.id
          ORDER BY email_messages.created_at DESC
          LIMIT 1
        ) AS latest_email_status,
        (
          SELECT email_messages.provider_message_id
          FROM email_messages
          WHERE email_messages.kind = 'invitation'
            AND json_extract(email_messages.metadata_json, '$.invitationId') = invitations.id
          ORDER BY email_messages.created_at DESC
          LIMIT 1
        ) AS latest_email_provider_message_id,
        (
          SELECT email_messages.error_message
          FROM email_messages
          WHERE email_messages.kind = 'invitation'
            AND json_extract(email_messages.metadata_json, '$.invitationId') = invitations.id
          ORDER BY email_messages.created_at DESC
          LIMIT 1
        ) AS latest_email_error_message
      FROM invitations
      ORDER BY created_at DESC
      LIMIT ?
    `,
  )
    .bind(limit)
    .all<InvitationRow>();

  return result.results;
}

export async function readInvitationById(
  context: AppContext,
  invitationId: string,
): Promise<InvitationRow | null> {
  return context.env.DB.prepare(
    `
      SELECT ${invitationColumns}
      FROM invitations
      WHERE id = ?
      LIMIT 1
    `,
  )
    .bind(invitationId)
    .first<InvitationRow>();
}

export async function readInvitationByTokenHash(
  context: AppContext,
  tokenHash: string,
): Promise<InvitationRow | null> {
  return context.env.DB.prepare(
    `
      SELECT ${invitationColumns}
      FROM invitations
      WHERE token_hash = ?
      LIMIT 1
    `,
  )
    .bind(tokenHash)
    .first<InvitationRow>();
}
