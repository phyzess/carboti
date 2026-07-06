import type { AuditEvent } from "./types";

export function filterAuditEvents(events: AuditEvent[], url: URL): AuditEvent[] {
  const action = url.searchParams.get("action");
  const actorId = url.searchParams.get("actorId");
  const subjectId = url.searchParams.get("subjectId");
  const subjectKind = url.searchParams.get("subjectKind");
  const occurredAfter = url.searchParams.get("occurredAfter");
  const occurredBefore = url.searchParams.get("occurredBefore");
  return events.filter((event) => {
    if (action && event.action !== action) return false;
    if (actorId && event.actor.id !== actorId) return false;
    if (subjectId && event.subject.id !== subjectId) return false;
    if (subjectKind && event.subject.kind !== subjectKind) return false;
    if (occurredAfter && event.occurredAt < occurredAfter) return false;
    if (occurredBefore && event.occurredAt >= occurredBefore) return false;
    return true;
  });
}
