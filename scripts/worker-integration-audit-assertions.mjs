import { assert } from "./worker-integration-http.mjs";

export async function assertAuditEvent(env, { action, message, subjectId }) {
  const event = await env.DB.prepare(
    "SELECT action, subject_id FROM audit_events WHERE action = ? AND subject_id = ? LIMIT 1",
  )
    .bind(action, subjectId)
    .first();

  assert(event?.action === action && event.subject_id === subjectId, message);
  return event;
}
