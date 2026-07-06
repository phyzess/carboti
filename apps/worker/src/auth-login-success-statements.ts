import { createAuditEvent } from "@carboti/audit";
import type { Session, User } from "@carboti/auth";
import { prepareAuditInsert } from "./audit-store";
import { prepareSessionInsert } from "./auth-session";
import {
  prepareLoginAttemptInsert,
  prepareSecurityEventInsert,
  type RequestFingerprint,
} from "./event-store";

export function prepareSuccessfulLoginStatements(
  env: Env,
  input: {
    emailHash: string;
    fingerprint: RequestFingerprint;
    session: Session;
    user: User;
  },
): D1PreparedStatement[] {
  return [
    prepareSessionInsert(env, input.session),
    prepareLoginAttemptInsert(env, {
      ...input.fingerprint,
      emailHash: input.emailHash,
      userId: input.user.id,
      outcome: "succeeded",
      createdAt: input.session.createdAt,
    }),
    prepareSecurityEventInsert(env, {
      ...input.fingerprint,
      eventType: "auth.login_succeeded",
      severity: "info",
      actorUserId: input.user.id,
      targetUserId: input.user.id,
      action: "auth.login",
      outcome: "succeeded",
      sessionId: input.session.id,
      createdAt: input.session.createdAt,
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "auth.login_succeeded",
        actor: {
          id: input.user.id,
          kind: "user",
        },
        subject: {
          id: input.session.id,
          kind: "session",
        },
      }),
    ),
  ];
}
