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
      workerSources.includes('app.get("/api/carboti/openapi.json"') &&
      workerSources.includes('app.get("/api/carboti/api-clients"') &&
      workerSources.includes('app.post("/api/carboti/api-clients"') &&
      workerSources.includes('app.post("/api/carboti/api-clients/:clientId/revoke"') &&
      workerSources.includes('app.get("/api/carboti/secrets"') &&
      workerSources.includes('app.post("/api/carboti/secrets"') &&
      workerSources.includes('app.post("/api/carboti/secrets/:secretRef/revoke"') &&
      workerSources.includes('app.post("/api/carboti/ingest/http"') &&
      workerSources.includes('app.get("/api/carboti/connectors/manifests"') &&
      workerSources.includes('app.post("/api/carboti/connectors/sources"') &&
      workerSources.includes('app.post("/api/carboti/connectors/sinks"') &&
      workerSources.includes('app.post("/api/carboti/connectors/sources/:sourceId/health"') &&
      workerSources.includes('app.post("/api/carboti/connectors/sources/:sourceId/ingest"') &&
      workerSources.includes('app.get("/api/carboti/objects/:objectId"') &&
      workerSources.includes('app.get("/api/carboti/artifacts/:artifactId"') &&
      workerSources.includes('app.get("/api/carboti/artifacts/:artifactId/download"') &&
      workerSources.includes('app.post("/api/carboti/artifacts/:artifactId/download-url"') &&
      workerSources.includes('app.get("/api/carboti/artifact-downloads/:token"') &&
      workerSources.includes('app.get("/api/carboti/messages/:messageId/lineage"') &&
      workerSources.includes('app.get("/api/carboti/messages/:messageId/trace"') &&
      workerSources.includes('app.post("/api/carboti/messages/:messageId/artifacts"') &&
      workerSources.includes('app.post("/api/carboti/messages/:messageId/replay"') &&
      workerSources.includes('app.get("/api/carboti/processor-runtimes"') &&
      workerSources.includes('app.post("/api/carboti/processors/external"') &&
      workerSources.includes('app.post("/api/carboti/processors/hosted"') &&
      workerSources.includes('app.post("/api/carboti/processors/:processorId/invoke"') &&
      workerSources.includes('app.post("/api/carboti/processor-deliveries/:deliveryId/retry"') &&
      workerSources.includes('app.post("/api/carboti/mcp"') &&
      workerSources.includes('app.post("/api/carboti/agent/artifacts/search"') &&
      workerSources.includes('app.post("/api/carboti/agent/artifacts/:artifactId/access"') &&
      workerSources.includes('"api_clients:read"') &&
      workerSources.includes('"api_clients:write"') &&
      workerSources.includes('"artifacts:write"') &&
      workerSources.includes('"connectors:read"') &&
      workerSources.includes('"connectors:write"') &&
      workerSources.includes('"messages:read"') &&
      workerSources.includes('"processors:invoke"') &&
      workerSources.includes('"processors:read"') &&
      workerSources.includes('"processors:write"') &&
      workerSources.includes('"agent:read"') &&
      workerSources.includes('"secrets:read"') &&
      workerSources.includes('"secrets:write"') &&
      workerSources.includes("carboti_api_clients") &&
      workerSources.includes("carboti_connector_health_checks") &&
      workerSources.includes("carboti_processor_runs") &&
      workerSources.includes("carboti_sinks") &&
      workerSources.includes("carboti_webhook_deliveries") &&
      workerSources.includes("carboti_secret_refs") &&
      workerSources.includes("carboti.artifact.submitted") &&
      workerSources.includes("carboti.api_client.created") &&
      workerSources.includes("carboti.api_client.revoked") &&
      workerSources.includes("carboti.artifact.download_url.created") &&
      workerSources.includes("carboti.artifact.signed_downloaded") &&
      workerSources.includes("carboti.connector.health.checked") &&
      workerSources.includes("carboti.connector.ingest.accepted") &&
      workerSources.includes("carboti.connector.sink.created") &&
      workerSources.includes("carboti.connector.source.created") &&
      workerSources.includes("carboti.processor.invoked") &&
      workerSources.includes("carboti.processor.hosted.created") &&
      workerSources.includes("carboti.secret.created") &&
      workerSources.includes("carboti.secret.revoked") &&
      workerSources.includes("x-carboti-signature") &&
      workerSources.includes("capabilityManifest") &&
      workerSources.includes("carbotiConnectorManifests") &&
      workerSources.includes("normalizeCarbotiHostedProcessorResourceLimits") &&
      workerSources.includes("processor_capability_violation") &&
      workerSources.includes("outputArtifactKinds") &&
      workerSources.includes("inputArtifactKinds") &&
      workerSources.includes("signingSecretRef") &&
      workerSources.includes("encryptCarbotiSecret") &&
      workerSources.includes("processor_secret_store_unavailable") &&
      workerSources.includes("carbotiOpenApiDocument") &&
      workerSources.includes("agent_context_bundle") &&
      workerSources.includes("carboti.agent.context_bundle.created") &&
      workerSources.includes("carboti.retrieve_context") &&
      workerSources.includes("artifact_access_expired") &&
      !workerSources.includes("inline-signing-key") &&
      workerSources.includes("retry_of_delivery_id") &&
      workerSources.includes("HMAC") &&
      workerSources.includes("carbotiRawHttpObjectKey") &&
      workerSources.includes("carbotiConnectorRawObjectKey") &&
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
