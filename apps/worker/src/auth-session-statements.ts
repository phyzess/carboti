export function prepareSessionInsert(
  env: Env,
  session: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: string;
    absoluteExpiresAt: string;
    createdAt: string;
    lastSeenAt: string;
  },
): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT INTO sessions (
        id, user_id, token_hash, expires_at, absolute_expires_at, created_at, last_seen_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
  ).bind(
    session.id,
    session.userId,
    session.tokenHash,
    session.expiresAt,
    session.absoluteExpiresAt,
    session.createdAt,
    session.lastSeenAt,
  );
}
