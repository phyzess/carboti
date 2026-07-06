export function assertCoreInterfaces({ assert, core, db }) {
  assert(
    core.carbotiSourceKinds.includes("cloudflare_email") &&
      core.carbotiSourceKinds.includes("ses") &&
      core.carbotiSourceKinds.includes("mailgun") &&
      core.carbotiProcessorKinds.includes("external_webhook") &&
      core.carbotiArtifactKinds.includes("agent_context_bundle"),
    "core must expose source, processor, and artifact kind registries.",
  );

  const rawKey = core.carbotiRawEmailObjectKey({
    messageId: "msg-1",
    receivedAt: "2026-07-06T10:30:00.000Z",
  });
  assert(
    rawKey === "raw-emails/2026-07-06/msg-1.eml",
    "core must own raw email object key conventions.",
  );
  const rawHttpKey = core.carbotiRawHttpObjectKey({
    filename: "external ledger.csv",
    messageId: "msg-2",
    receivedAt: "2026-07-06T10:30:00.000Z",
  });
  assert(
    rawHttpKey === "raw-http/2026-07-06/msg-2/external_ledger.csv",
    "core must own raw HTTP object key conventions.",
  );
  const rawConnectorKey = core.carbotiConnectorRawObjectKey({
    filename: "ledger export.csv",
    messageId: "msg-3",
    receivedAt: "2026-07-06T10:30:00.000Z",
    sourceId: "source:r2:example",
    sourceKind: "r2",
  });
  assert(
    rawConnectorKey === "raw-connectors/r2/source_r2_example/2026-07-06/msg-3/ledger_export.csv",
    "core must own connector raw object key conventions.",
  );

  const parsed = core.parseCarbotiMessageEnvelope({
    attachments: [],
    id: "msg-1",
    rawObjectRef: {
      contentType: "message/rfc822",
      id: "obj-1",
      kind: "raw_email",
      objectKey: rawKey,
    },
    receivedAt: "2026-07-06T10:30:00.000Z",
    sourceId: "source-1",
    workspaceId: "default",
  });
  assert(parsed.id === "msg-1", "core must validate a minimal message envelope.");

  assert(
    core.CarbotiStoredObjectSchema && core.carbotiObjectKinds.includes("normalized_message"),
    "core must expose stored object schema and normalized message object kind.",
  );

  const manifest = core.parseCarbotiProcessorCapabilityManifest({
    inputArtifactKinds: ["normalized_json"],
    outputArtifactKinds: ["processor_output"],
  });
  assert(
    core.CarbotiProcessorCapabilityManifestSchema &&
      core.carbotiProcessorPermissions.includes("read:artifacts") &&
      manifest.inputArtifactKinds.join(",") === "normalized_json" &&
      manifest.inputObjectKinds.join(",") === "normalized_message" &&
      manifest.outputArtifactKinds.join(",") === "processor_output",
    "core must expose processor capability manifest contracts with stable defaults.",
  );

  const r2Manifest = core.getCarbotiConnectorManifest("r2");
  assert(
    r2Manifest?.direction === "source_sink" &&
      r2Manifest.capabilities.includes("artifact_sink") &&
      core.carbotiConnectorManifests.some((manifest) => manifest.kind === "gmail"),
    "core must expose connector manifests for source and sink adapters.",
  );

  const hostedLimits = core.normalizeCarbotiHostedProcessorResourceLimits(
    {
      cpuMs: 999999,
      maxInputBytes: 999999999,
      maxOutputBytes: 999999999,
      memoryMb: 9999,
      networkPolicy: "egress_any",
      timeoutSeconds: 999,
    },
    "cloudflare_workers",
  );
  assert(
    core.carbotiHostedProcessorRuntimeManifests.some(
      (runtime) => runtime.runtime === "cloudflare_workers",
    ) &&
      hostedLimits.timeoutSeconds === 300 &&
      hostedLimits.networkPolicy === "egress_allowlist",
    "core must expose hosted processor runtime manifests and clamp resource limits.",
  );

  assert(
    core.carbotiOpenApiDocument.openapi === "3.1.0" &&
      core.carbotiOpenApiDocument.paths["/api/carboti/ingest/http"].post.operationId ===
        "ingestHttpObject" &&
      core.carbotiOpenApiDocument.paths["/api/carboti/api-clients"].post.operationId ===
        "createApiClient" &&
      core.carbotiOpenApiDocument.paths["/api/carboti/secrets"].post.operationId ===
        "createSecretRef" &&
      core.carbotiOpenApiDocument.paths["/api/carboti/connectors/manifests"].get.operationId ===
        "listConnectorManifests" &&
      core.carbotiOpenApiDocument.paths["/api/carboti/messages/{messageId}/trace"].get
        .operationId === "getMessageTrace" &&
      core.carbotiOpenApiDocument.paths["/api/carboti/artifacts/{artifactId}/download-url"].post
        .operationId === "createArtifactDownloadUrl" &&
      core.carbotiOpenApiDocument.paths["/api/carboti/processors/external"].post.operationId ===
        "createExternalProcessor" &&
      core.carbotiOpenApiDocument.paths["/api/carboti/processors/hosted"].post.operationId ===
        "createHostedProcessor" &&
      core.carbotiOpenApiDocument.paths["/api/carboti/mcp"].post.operationId === "carbotiMcp",
    "core must expose the versioned Carboti OpenAPI contract.",
  );

  assert(
    db.carbotiArtifacts &&
      db.carbotiConnectorHealthChecks &&
      db.carbotiLineageEdges &&
      db.carbotiObjects &&
      db.carbotiProcessorRuns &&
      db.carbotiSecretRefs &&
      db.carbotiSinks &&
      db.carbotiWebhookDeliveries,
    "db facade must export Carboti object, artifact, lineage, connector, sink, processor run, secret ref, and delivery tables.",
  );
}
