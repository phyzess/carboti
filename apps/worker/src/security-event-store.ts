import type { RequestFingerprint } from "./event-fingerprint";

export type SecurityEventInput = RequestFingerprint & {
  eventType: string;
  severity: "info" | "warning" | "critical";
  actorUserId?: string | null | undefined;
  targetUserId?: string | null | undefined;
  action: string;
  outcome: "succeeded" | "failed" | "denied";
  sessionId?: string | null | undefined;
  metadata?: Record<string, unknown> | undefined;
  createdAt?: string | undefined;
};

export function prepareSecurityEventInsert(
  env: Env,
  input: SecurityEventInput,
): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT INTO security_events (
        id,
        event_type,
        severity,
        actor_user_id,
        target_user_id,
        action,
        outcome,
        request_id,
        session_id,
        ip_hash,
        user_agent_hash,
        metadata_json,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).bind(
    crypto.randomUUID(),
    input.eventType,
    input.severity,
    input.actorUserId ?? null,
    input.targetUserId ?? null,
    input.action,
    input.outcome,
    input.requestId,
    input.sessionId ?? null,
    input.ipHash,
    input.userAgentHash,
    JSON.stringify(input.metadata ?? {}),
    input.createdAt ?? new Date().toISOString(),
  );
}

export async function writeSecurityEvent(env: Env, input: SecurityEventInput): Promise<void> {
  await prepareSecurityEventInsert(env, input).run();
}
