import type { AuditEvent, ImportJobEvent } from "./types";
import { shortId } from "./mock-api-identifiers";
import { auditEvent } from "./mock-api-model";
import { nowIso } from "./mock-api-time";
import { requireJob } from "./mock-api-selectors";
import type { MockState } from "./mock-api-state";

export function pushJobEvent(
  state: MockState,
  jobId: string,
  eventType: string,
  message: string,
  actorUserId: string | null,
  options: {
    statusFrom?: string | null;
    statusTo?: string | null;
  } = {},
): void {
  const job = requireJob(state, jobId);
  const event: ImportJobEvent = {
    actorUserId,
    createdAt: nowIso(),
    eventType,
    id: `event-${shortId()}`,
    importJobId: job.id,
    message,
    metadata: { demo: true },
    requestId: null,
    sourceFileId: job.sourceFileId,
    statusFrom: options.statusFrom ?? null,
    statusTo: options.statusTo ?? null,
  };
  state.importJobEventsByJobId[jobId] = [event, ...(state.importJobEventsByJobId[jobId] ?? [])];
}

export function pushAudit(
  state: MockState,
  action: string,
  subject: AuditEvent["subject"],
  metadata: unknown,
  actorId = state.currentUserId ?? "demo-system",
): void {
  state.auditEvents = [
    auditEvent(`audit-${shortId()}`, action, actorId, subject.kind, subject.id, metadata),
    ...state.auditEvents,
  ];
}
