export type InboundEmailMessageInsertInput = {
  attachmentCount: number;
  from: string;
  inboundEmailId: string;
  rawObjectKey: string;
  rawSize: number;
  receivedAt: string;
  status: string;
  subject: string | undefined;
  to: string;
};

export function prepareInboundEmailMessageInsert(
  env: Env,
  input: InboundEmailMessageInsertInput,
): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT INTO inbound_email_messages (
        id,
        from_email,
        to_email,
        subject,
        raw_object_key,
        raw_size,
        attachment_count,
        status,
        metadata_json,
        received_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).bind(
    input.inboundEmailId,
    input.from,
    input.to,
    input.subject ?? null,
    input.rawObjectKey,
    input.rawSize,
    input.attachmentCount,
    input.status,
    JSON.stringify({ parser: "qitu-recursive-mime" }),
    input.receivedAt,
  );
}
