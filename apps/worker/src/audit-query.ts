export type AuditEventRow = {
  id: string;
  action: string;
  actor_id: string;
  actor_kind: string;
  subject_id: string;
  subject_kind: string;
  metadata_json: string | null;
  occurred_at: string;
};

export type AuditEventQuery = {
  action: string | null;
  actorId: string | null;
  limit: number;
  occurredAfter: string | null;
  occurredBefore: string | null;
  subjectId: string | null;
  subjectKind: string | null;
};

export async function readAuditEvents(env: Env, query: AuditEventQuery): Promise<AuditEventRow[]> {
  const result = await env.DB.prepare(
    `
      SELECT
        id,
        action,
        actor_id,
        actor_kind,
        subject_id,
        subject_kind,
        metadata_json,
        occurred_at
      FROM audit_events
      WHERE (? IS NULL OR subject_id = ?)
        AND (? IS NULL OR subject_kind = ?)
        AND (? IS NULL OR actor_id = ?)
        AND (? IS NULL OR action = ?)
        AND (? IS NULL OR occurred_at >= ?)
        AND (? IS NULL OR occurred_at < ?)
      ORDER BY occurred_at DESC
      LIMIT ?
    `,
  )
    .bind(
      query.subjectId,
      query.subjectId,
      query.subjectKind,
      query.subjectKind,
      query.actorId,
      query.actorId,
      query.action,
      query.action,
      query.occurredAfter,
      query.occurredAfter,
      query.occurredBefore,
      query.occurredBefore,
      query.limit,
    )
    .all<AuditEventRow>();

  return result.results;
}
