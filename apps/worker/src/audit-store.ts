import type { AuditEvent } from "@carboti/audit";

export function prepareAuditInsert(env: Env, event: AuditEvent): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT INTO audit_events (
        id, action, actor_id, actor_kind, subject_id, subject_kind, metadata_json, occurred_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).bind(
    event.id,
    event.action,
    event.actor.id,
    event.actor.kind,
    event.subject.id,
    event.subject.kind,
    JSON.stringify(event.metadata ?? {}),
    event.occurredAt,
  );
}

export async function writeAudit(env: Env, event: AuditEvent): Promise<void> {
  await prepareAuditInsert(env, event).run();
}
