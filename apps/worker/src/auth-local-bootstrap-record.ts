import { createSession, hashPassword, normalizeEmail, type Session, type User } from "@carboti/auth";
import { prepareLocalUserBootstrapStatements } from "./auth-local-bootstrap-statements";
export type { LocalUserBootstrapOptions } from "./auth-local-bootstrap-types";
import type { LocalUserBootstrapOptions } from "./auth-local-bootstrap-types";
import type { UserRow } from "./auth-types";
import { hashEventValue, requestFingerprint } from "./event-store";
import type { AppContext } from "./http-utils";

export async function bootstrapLocalUser(input: {
  context: AppContext;
  displayName: string | undefined;
  email: string;
  options: LocalUserBootstrapOptions;
  password: string;
}): Promise<{
  created: boolean;
  session: Session;
  token: string;
  user: User;
}> {
  const { context, options } = input;
  const email = normalizeEmail(input.email);
  const now = new Date().toISOString();
  const displayName = input.displayName || options.defaultDisplayName;
  const fingerprint = await requestFingerprint(context);
  const emailHash = (await hashEventValue(email)) ?? email;
  const existingUser = await context.env.DB.prepare(
    `
      SELECT id, email, role, display_name, created_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
  )
    .bind(email)
    .first<UserRow>();
  const passwordHash = await hashPassword(input.password);
  const user: User = existingUser
    ? {
        id: existingUser.id,
        email: existingUser.email,
        role: options.role,
        displayName,
        createdAt: existingUser.created_at,
      }
    : {
        id: crypto.randomUUID(),
        email,
        role: options.role,
        displayName,
        createdAt: now,
      };
  const { session, token } = await createSession({
    userId: user.id,
  });
  const created = !existingUser;

  await context.env.DB.batch(
    prepareLocalUserBootstrapStatements(context.env, {
      created,
      emailHash,
      fingerprint,
      now,
      options,
      passwordHash,
      session,
      user,
    }),
  );

  return {
    created,
    session,
    token,
    user,
  };
}
