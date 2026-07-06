import type { StatusBadgeTone } from "@carboti/ui";
import type { AuditEvent } from "../types";

export function actorLabel(event: AuditEvent): string {
  return `${event.actor.kind}:${event.actor.id}`;
}

export function subjectLabel(event: AuditEvent): string {
  return `${event.subject.kind}:${event.subject.id}`;
}

export function formatMetadata(metadata: unknown): string {
  if (metadata === null || metadata === undefined) {
    return "{}";
  }

  return JSON.stringify(metadata, null, 2);
}

export function auditStatusTone(action: string): StatusBadgeTone {
  if (action.includes("failed") || action.includes("denied")) return "danger";
  if (action.includes("queued") || action.includes("requested")) return "warning";
  if (action.includes("succeeded") || action.includes("committed")) return "success";
  if (action.includes("advisory")) return "info";
  return "neutral";
}
