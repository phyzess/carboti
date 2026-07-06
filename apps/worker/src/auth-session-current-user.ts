import { hashSecret, isExpired } from "@carboti/auth";
import { getCookie } from "hono/cookie";
import { mapUser } from "./auth-presenters";
import { sessionCookieName } from "./auth-session-cookie";
import type { CurrentUser, SessionUserRow } from "./auth-types";
import type { AppContext } from "./http-utils";

export async function readCurrentUser(context: AppContext): Promise<CurrentUser | null> {
  const token = getCookie(context, sessionCookieName);
  if (!token) return null;

  const tokenHash = await hashSecret(token);
  const row = await context.env.DB.prepare(
    `
      SELECT
        users.id,
        users.email,
        users.role,
        users.display_name,
        users.created_at,
        sessions.id AS session_id,
        sessions.expires_at AS session_expires_at,
        sessions.absolute_expires_at AS session_absolute_expires_at
      FROM sessions
      INNER JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ?
        AND sessions.revoked_at IS NULL
      LIMIT 1
    `,
  )
    .bind(tokenHash)
    .first<SessionUserRow>();

  if (!row) return null;

  if (isExpired(row.session_expires_at) || isExpired(row.session_absolute_expires_at)) {
    await context.env.DB.prepare("UPDATE sessions SET revoked_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), row.session_id)
      .run();
    return null;
  }

  await context.env.DB.prepare("UPDATE sessions SET last_seen_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), row.session_id)
    .run();

  return {
    user: mapUser(row),
    sessionId: row.session_id,
    expiresAt: row.session_expires_at,
  };
}
