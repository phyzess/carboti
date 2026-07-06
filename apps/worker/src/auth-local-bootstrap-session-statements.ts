import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import { prepareSessionInsert } from "./auth-session";
import type { LocalUserBootstrapStatementInput } from "./auth-local-bootstrap-statement-types";
import { prepareLoginAttemptInsert, prepareSecurityEventInsert } from "./event-store";

export function prepareLocalUserBootstrapSessionStatements(
  env: Env,
  input: LocalUserBootstrapStatementInput,
): D1PreparedStatement[] {
  return [
    prepareSessionInsert(env, input.session),
    prepareLoginAttemptInsert(env, {
      ...input.fingerprint,
      emailHash: input.emailHash,
      userId: input.user.id,
      outcome: "succeeded",
      createdAt: input.now,
    }),
    prepareSecurityEventInsert(env, {
      ...input.fingerprint,
      eventType: input.options.eventType,
      severity: "info",
      actorUserId: input.user.id,
      targetUserId: input.user.id,
      action: input.options.action,
      outcome: "succeeded",
      sessionId: input.session.id,
      createdAt: input.now,
      metadata: {
        created: input.created,
        role: input.user.role,
      },
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: input.options.eventType,
        actor: {
          id: "system",
          kind: "system",
        },
        subject: {
          id: input.user.id,
          kind: "user",
        },
        metadata: {
          created: input.created,
          email: input.user.email,
          role: input.user.role,
        },
      }),
    ),
  ];
}
