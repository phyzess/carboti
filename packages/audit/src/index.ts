import * as v from "valibot";

export const AuditActorSchema = v.object({
  id: v.string(),
  kind: v.picklist(["user", "system", "agent"]),
});

export const AuditSubjectSchema = v.object({
  id: v.string(),
  kind: v.string(),
});

export const AuditEventSchema = v.object({
  id: v.string(),
  action: v.string(),
  actor: AuditActorSchema,
  subject: AuditSubjectSchema,
  occurredAt: v.string(),
  metadata: v.optional(v.record(v.string(), v.unknown())),
});

export type AuditActor = v.InferOutput<typeof AuditActorSchema>;
export type AuditSubject = v.InferOutput<typeof AuditSubjectSchema>;
export type AuditEvent = v.InferOutput<typeof AuditEventSchema>;

export function createAuditEvent(input: Omit<AuditEvent, "id" | "occurredAt">): AuditEvent {
  return {
    ...input,
    id: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
  };
}
