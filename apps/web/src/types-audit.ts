export type AuditEvent = {
  id: string;
  action: string;
  actor: {
    id: string;
    kind: string;
  };
  subject: {
    id: string;
    kind: string;
  };
  metadata: unknown;
  occurredAt: string;
};
