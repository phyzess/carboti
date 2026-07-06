import type { AuditEvent, ImportJobEvent, ImportJobListItem } from "./types";
import { shortId } from "./mock-api-identifiers";
import { nowIso } from "./mock-api-time";

export function jobEvent(
  job: ImportJobListItem,
  eventType: string,
  statusFrom: string | null,
  statusTo: string | null,
  message: string,
  createdAt: string,
): ImportJobEvent {
  return {
    actorUserId: null,
    createdAt,
    eventType,
    id: `event-${shortId()}`,
    importJobId: job.id,
    message,
    metadata: {},
    requestId: null,
    sourceFileId: job.sourceFileId,
    statusFrom,
    statusTo,
  };
}

export function auditEvent(
  id: string,
  action: string,
  actorId: string,
  subjectKind: string,
  subjectId: string,
  metadata: unknown,
): AuditEvent {
  return {
    action,
    actor: {
      id: actorId,
      kind: "user",
    },
    id,
    metadata,
    occurredAt: nowIso(),
    subject: {
      id: subjectId,
      kind: subjectKind,
    },
  };
}
