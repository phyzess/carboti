import type { AuditEventRow } from "./audit-query";

export function publicAuditEvent(row: AuditEventRow): Record<string, unknown> {
  return {
    id: row.id,
    action: row.action,
    actor: {
      id: row.actor_id,
      kind: row.actor_kind,
    },
    subject: {
      id: row.subject_id,
      kind: row.subject_kind,
    },
    metadata: row.metadata_json ? JSON.parse(row.metadata_json) : {},
    occurredAt: row.occurred_at,
  };
}
