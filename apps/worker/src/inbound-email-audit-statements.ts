import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";

export type InboundEmailReceivedAuditInput = {
  attachmentCount: number;
  from: string;
  inboundEmailId: string;
  rawObjectKey: string;
  status: string;
  subject: string | undefined;
  to: string;
};

export function prepareInboundEmailReceivedAuditInsert(
  env: Env,
  input: InboundEmailReceivedAuditInput,
): D1PreparedStatement {
  return prepareAuditInsert(
    env,
    createAuditEvent({
      action: "inbound_email.received",
      actor: {
        id: "system:inbound-email",
        kind: "system",
      },
      metadata: {
        attachmentCount: input.attachmentCount,
        from: input.from,
        rawObjectKey: input.rawObjectKey,
        status: input.status,
        subject: input.subject,
        to: input.to,
      },
      subject: {
        id: input.inboundEmailId,
        kind: "inbound_email",
      },
    }),
  );
}
