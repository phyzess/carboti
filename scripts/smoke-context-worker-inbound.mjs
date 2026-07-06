export function createSmokeWorkerInboundContext({ text }) {
  const workerInboundEmail = [
    text("apps/worker/src/inbound-email.ts"),
    text("apps/worker/src/inbound-email-attachments.ts"),
    text("apps/worker/src/inbound-email-store.ts"),
    text("apps/worker/src/inbound-email-status.ts"),
    text("apps/worker/src/inbound-email-receipt-statements.ts"),
    text("apps/worker/src/inbound-email-message-statements.ts"),
    text("apps/worker/src/inbound-email-attachment-statements.ts"),
    text("apps/worker/src/inbound-email-audit-statements.ts"),
  ].join("\n");
  const workerMimeParser = text("apps/worker/src/mime-parser.ts");
  const workerMimeHeaders = text("apps/worker/src/mime-headers.ts");
  const workerMimeHeaderParameters = text("apps/worker/src/mime-header-parameters.ts");
  const workerMimeCodecs = text("apps/worker/src/mime-codecs.ts");
  const workerMimeByteCodecs = text("apps/worker/src/mime-byte-codecs.ts");
  const workerMimeHeaderCodecs = text("apps/worker/src/mime-header-codecs.ts");
  const workerMimeTransferCodecs = text("apps/worker/src/mime-transfer-codecs.ts");
  const workerMimeSources = [
    workerMimeParser,
    workerMimeHeaders,
    workerMimeHeaderParameters,
    workerMimeCodecs,
    workerMimeByteCodecs,
    workerMimeHeaderCodecs,
    workerMimeTransferCodecs,
  ].join("\n");

  return {
    workerInboundEmail,
    workerMimeCodecs,
    workerMimeHeaders,
    workerMimeParser,
    workerMimeSources,
  };
}
