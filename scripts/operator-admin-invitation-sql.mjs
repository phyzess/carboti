export function insertInvitationSql(invitation) {
  const metadata = JSON.stringify({
    email: invitation.email,
    role: invitation.role,
    operatorCommand: true,
  });

  return `
    INSERT INTO invitations (
      id, email, role, status, token_hash, expires_at, created_by, created_at
    )
    VALUES (
      ${sqlString(invitation.id)},
      ${sqlString(invitation.email)},
      'admin',
      'pending',
      ${sqlString(invitation.tokenHash)},
      ${sqlString(invitation.expiresAt)},
      ${sqlString(invitation.createdBy)},
      ${sqlString(invitation.createdAt)}
    );

    INSERT INTO audit_events (
      id, action, actor_id, actor_kind, subject_id, subject_kind, metadata_json, occurred_at
    )
    VALUES (
      ${sqlString(invitation.auditEventId)},
      'invitation.created',
      ${sqlString(invitation.createdBy)},
      'system',
      ${sqlString(invitation.id)},
      'invitation',
      ${sqlString(metadata)},
      ${sqlString(invitation.createdAt)}
    );
  `;
}

export function compactSql(sql) {
  return sql.trim().replace(/\s+/g, " ");
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}
