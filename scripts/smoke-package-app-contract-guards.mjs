export function assertPackageAppContractGuards(context) {
  const {
    assert,
    exists,
    i18nPackage,
    text,
    webSources,
    workerInboundEmail,
    workerMimeParser,
    workerMimeSources,
    workerSourceIntake,
    workerSourceIntakeStore,
    workerSources,
  } = context;

  assert(
    exists("apps/worker/src/rbac-policy.ts") &&
      exists("apps/web/src/rbac-policy.ts") &&
      text("apps/worker/src/rbac-policy.ts").includes("createRbacPolicy") &&
      text("apps/web/src/rbac-policy.ts").includes("createRbacPolicy") &&
      workerSources.includes("appCan(") &&
      webSources.includes("appCan("),
    "worker and web apps must use app-owned RBAC policy adapters instead of binding directly to package defaults.",
  );
  assert(
    workerSourceIntake.includes("createSourceFileImportJob") &&
      workerSourceIntakeStore.includes("source_file.uploaded") &&
      workerSourceIntakeStore.includes("import_job.queued") &&
      workerInboundEmail.includes("handleInboundEmail") &&
      workerInboundEmail.includes("raw-emails/") &&
      workerInboundEmail.includes("prepareCarbotiInboundEmailStatements") &&
      workerInboundEmail.includes("carboti_lineage_edges") &&
      workerInboundEmail.includes("parseMimeAttachments") &&
      workerInboundEmail.includes("parseMimeTextBody") &&
      workerInboundEmail.includes("system:inbound-email") &&
      workerInboundEmail.includes("buildRawAttachmentObjectKey") &&
      workerMimeParser.includes("export function parseMimeAttachments") &&
      workerMimeParser.includes("export function parseMimeTextBody") &&
      workerMimeSources.includes("decodeHeaderValue") &&
      workerMimeSources.includes("decodeTransferEncodedBody") &&
      workerSources.includes("async email(message, env)"),
    "worker must support business-neutral inbound email intake into raw R2, source files, and import jobs.",
  );
  assert(
    workerSources.includes("requireCarbotiApiClient") &&
      workerSources.includes('app.post("/api/carboti/ingest/http"') &&
      workerSources.includes('app.get("/api/carboti/objects/:objectId"') &&
      workerSources.includes('app.get("/api/carboti/artifacts/:artifactId"') &&
      workerSources.includes('app.get("/api/carboti/messages/:messageId/lineage"') &&
      workerSources.includes('app.post("/api/carboti/messages/:messageId/artifacts"') &&
      workerSources.includes('app.post("/api/carboti/messages/:messageId/replay"') &&
      workerSources.includes('app.post("/api/carboti/processors/external"') &&
      workerSources.includes('app.post("/api/carboti/processors/:processorId/invoke"') &&
      workerSources.includes('app.post("/api/carboti/processor-deliveries/:deliveryId/retry"') &&
      workerSources.includes('"artifacts:write"') &&
      workerSources.includes('"processors:invoke"') &&
      workerSources.includes('"processors:write"') &&
      workerSources.includes("carboti_api_clients") &&
      workerSources.includes("carboti_processor_runs") &&
      workerSources.includes("carboti_webhook_deliveries") &&
      workerSources.includes("carboti.artifact.submitted") &&
      workerSources.includes("carboti.processor.invoked") &&
      workerSources.includes("x-carboti-signature") &&
      workerSources.includes("retry_of_delivery_id") &&
      workerSources.includes("HMAC") &&
      workerSources.includes("carbotiRawHttpObjectKey") &&
      workerSources.includes("processor_output"),
    "worker must expose token-scoped Carboti HTTP ingest, evidence read, artifact submit, outbound processor, delivery retry, and replay APIs.",
  );
  assert(
    webSources.includes("VITE_QITU_DEFAULT_LOCALE") &&
      webSources.includes("qitu.locale") &&
      !i18nPackage.includes("VITE_QITU_DEFAULT_LOCALE"),
    "default web locale must be app-owned configuration, not a reusable i18n package policy.",
  );
}
