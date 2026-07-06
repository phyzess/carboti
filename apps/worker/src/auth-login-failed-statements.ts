import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import {
  prepareLoginAttemptInsert,
  prepareSecurityEventInsert,
  type RequestFingerprint,
} from "./event-store";

export function prepareFailedLoginStatements(
  env: Env,
  input: {
    email: string;
    emailHash: string;
    fingerprint: RequestFingerprint;
    now: string;
    userId: string | null;
  },
): D1PreparedStatement[] {
  return [
    prepareLoginAttemptInsert(env, {
      ...input.fingerprint,
      emailHash: input.emailHash,
      userId: input.userId,
      outcome: "failed",
      failureReason: "invalid_credentials",
      createdAt: input.now,
    }),
    prepareSecurityEventInsert(env, {
      ...input.fingerprint,
      eventType: "auth.login_failed",
      severity: "warning",
      actorUserId: input.userId,
      targetUserId: input.userId,
      action: "auth.login",
      outcome: "failed",
      createdAt: input.now,
      metadata: {
        reason: "invalid_credentials",
      },
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "auth.login_failed",
        actor: {
          id: "anonymous",
          kind: "system",
        },
        subject: {
          id: input.email,
          kind: "email",
        },
      }),
    ),
  ];
}
