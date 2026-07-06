import { createSession, type Session, type User } from "@carboti/auth";
import {
  prepareFailedLoginStatements,
  prepareSuccessfulLoginStatements,
} from "./auth-login-record-statements";
import type { LoginRow } from "./auth-types";
import { hashEventValue, requestFingerprint } from "./event-store";
import type { AppContext } from "./http-utils";

export async function recordFailedLogin(input: {
  context: AppContext;
  email: string;
  row: LoginRow | null;
}): Promise<void> {
  const { context, email, row } = input;
  const now = new Date().toISOString();
  const fingerprint = await requestFingerprint(context);
  const emailHash = (await hashEventValue(email)) ?? email;

  await context.env.DB.batch(
    prepareFailedLoginStatements(context.env, {
      email,
      emailHash,
      fingerprint,
      now,
      userId: row?.id ?? null,
    }),
  );
}

export async function completeSuccessfulLogin(input: {
  context: AppContext;
  email: string;
  user: User;
}): Promise<{
  session: Session;
  token: string;
}> {
  const { context, email, user } = input;
  const fingerprint = await requestFingerprint(context);
  const emailHash = (await hashEventValue(email)) ?? email;
  const { session, token } = await createSession({
    userId: user.id,
  });

  await context.env.DB.batch(
    prepareSuccessfulLoginStatements(context.env, {
      emailHash,
      fingerprint,
      session,
      user,
    }),
  );

  return {
    session,
    token,
  };
}
