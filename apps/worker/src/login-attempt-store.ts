import type { RequestFingerprint } from "./event-fingerprint";

export type LoginAttemptInput = RequestFingerprint & {
  emailHash: string;
  userId?: string | null | undefined;
  outcome: "succeeded" | "failed";
  failureReason?: string | null | undefined;
  createdAt?: string | undefined;
};

export function prepareLoginAttemptInsert(env: Env, input: LoginAttemptInput): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT INTO login_attempts (
        id, email_hash, user_id, outcome, failure_reason, ip_hash, user_agent_hash, request_id, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).bind(
    crypto.randomUUID(),
    input.emailHash,
    input.userId ?? null,
    input.outcome,
    input.failureReason ?? null,
    input.ipHash,
    input.userAgentHash,
    input.requestId,
    input.createdAt ?? new Date().toISOString(),
  );
}
