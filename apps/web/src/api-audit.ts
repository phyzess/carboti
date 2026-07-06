import { apiJson, withSearch } from "./api-client";
import type { AuditEvent } from "./types";

export type AuditEventsResponse = {
  auditEvents: AuditEvent[];
};

export async function listAuditEvents(
  input: {
    action?: string;
    subjectId?: string;
    subjectKind?: string;
    actorId?: string;
    occurredAfter?: string;
    occurredBefore?: string;
    limit?: number;
  } = {},
): Promise<AuditEventsResponse> {
  const search = new URLSearchParams();
  if (input.action) search.set("action", input.action);
  if (input.subjectId) search.set("subjectId", input.subjectId);
  if (input.subjectKind) search.set("subjectKind", input.subjectKind);
  if (input.actorId) search.set("actorId", input.actorId);
  if (input.occurredAfter) search.set("occurredAfter", input.occurredAfter);
  if (input.occurredBefore) search.set("occurredBefore", input.occurredBefore);
  if (input.limit) search.set("limit", String(input.limit));
  return apiJson<AuditEventsResponse>(withSearch("/api/audit-events", search));
}
