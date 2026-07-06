import { createHash } from "node:crypto";
import { createHmac } from "node:crypto";
import { assert, expectApiError, expectStatus } from "./worker-integration-http.mjs";

const apiToken = "carboti-api-integration-token";
const apiClientId = "api-client:integration";
const processorSigningSecret = "processor-signing-secret-for-integration";
const apiHeaders = {
  authorization: `Bearer ${apiToken}`,
};

export async function testCarbotiHttpIngestAndReplay({ client, env }) {
  const openApi = await client.json("/api/carboti/openapi.json");
  assert(openApi.openapi === "3.1.0", "Carboti OpenAPI document is exposed");
  assert(
    openApi.components.securitySchemes.bearerAuth.scheme === "bearer",
    "Carboti OpenAPI documents bearer token auth",
  );
  assert(
    openApi.components.schemas.CapabilityManifest.properties.outputArtifactKinds,
    "Carboti OpenAPI documents processor capability manifests",
  );
  assert(
    openApi.paths["/api/carboti/ingest/http"].post.operationId === "ingestHttpObject" &&
      openApi.paths["/api/carboti/api-clients"].post.operationId === "createApiClient" &&
      openApi.paths["/api/carboti/secrets"].post.operationId === "createSecretRef" &&
      openApi.paths["/api/carboti/processors/external"].post.operationId ===
        "createExternalProcessor" &&
      openApi.paths["/api/carboti/processors/hosted"].post.operationId ===
        "createHostedProcessor" &&
      openApi.paths["/api/carboti/connectors/manifests"].get.operationId ===
        "listConnectorManifests" &&
      openApi.paths["/api/carboti/connectors/sources/{sourceId}/ingest"].post.operationId ===
        "ingestConnectorObject" &&
      openApi.paths["/api/carboti/messages/{messageId}/trace"].get.operationId ===
        "getMessageTrace" &&
      openApi.paths["/api/carboti/artifacts/{artifactId}/download-url"].post.operationId ===
        "createArtifactDownloadUrl" &&
      openApi.paths["/api/carboti/processor-deliveries/{deliveryId}/retry"].post.operationId ===
        "retryProcessorDelivery" &&
      openApi.paths["/api/carboti/mcp"].post.operationId === "carbotiMcp",
    "Carboti OpenAPI covers ingest, connector, processor, retry, and MCP routes",
  );

  await expectApiError(
    await client.post("/api/carboti/ingest/http", "label,value\nDenied,0\n", {
      headers: {
        "content-type": "text/plain",
        "x-carboti-filename": "denied.txt",
      },
    }),
    401,
    "missing_api_token",
  );

  await seedApiClient(env);

  const createdClientResponse = await client.post(
    "/api/carboti/api-clients",
    JSON.stringify({
      name: "Read-only integration client",
      scopes: ["artifacts:read", "messages:read"],
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(createdClientResponse, 201);
  const createdClient = await createdClientResponse.json();
  assert(
    createdClient.token.startsWith("cbt_") &&
      createdClient.apiClient.scopes.join(",") === "artifacts:read,messages:read",
    "API client management creates a scoped token and returns it once",
  );

  const apiClients = await client.json("/api/carboti/api-clients", {
    headers: apiHeaders,
  });
  assert(
    apiClients.apiClients.some((apiClient) => apiClient.id === createdClient.apiClient.id) &&
      !JSON.stringify(apiClients).includes(createdClient.token),
    "API client listing exposes metadata without token material",
  );

  const revokeClientResponse = await client.post(
    `/api/carboti/api-clients/${createdClient.apiClient.id}/revoke`,
    "",
    {
      headers: apiHeaders,
    },
  );
  await expectStatus(revokeClientResponse, 200);
  await expectApiError(
    await client.request("/api/carboti/messages/non-existent/trace", {
      headers: {
        authorization: `Bearer ${createdClient.token}`,
      },
    }),
    401,
    "invalid_api_token",
  );

  const secretResponse = await client.post(
    "/api/carboti/secrets",
    JSON.stringify({
      description: "Integration connector credential",
      kind: "connector_credential",
      name: "R2 integration credential",
      plaintext: "integration-connector-secret",
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(secretResponse, 201);
  const connectorSecret = await secretResponse.json();
  assert(
    connectorSecret.secret.id.startsWith("secret:connector_credential:") &&
      connectorSecret.secret.status === "active",
    "secret refs can store connector credentials without returning plaintext",
  );

  const secretList = await client.json("/api/carboti/secrets", {
    headers: apiHeaders,
  });
  assert(
    secretList.secrets.some((secret) => secret.id === connectorSecret.secret.id) &&
      !JSON.stringify(secretList).includes("integration-connector-secret"),
    "secret listing exposes metadata without secret material",
  );

  const connectorManifests = await client.json("/api/carboti/connectors/manifests", {
    headers: apiHeaders,
  });
  const connectorKinds = connectorManifests.manifests.map((manifest) => manifest.kind).sort();
  for (const expectedKind of [
    "gmail",
    "imap",
    "mailgun",
    "microsoft_graph",
    "postmark",
    "r2",
    "s3",
    "ses",
  ]) {
    assert(
      connectorKinds.includes(expectedKind),
      `connector manifest registry includes ${expectedKind}`,
    );
  }
  assert(
    connectorManifests.manifests.find((manifest) => manifest.kind === "r2").direction ===
      "source_sink",
    "R2 connector is declared as both source and sink capable",
  );

  await expectApiError(
    await client.post(
      "/api/carboti/connectors/sources",
      JSON.stringify({
        config: {
          accessToken: "must-not-be-inline",
        },
        kind: "gmail",
        name: "Gmail with inline token",
      }),
      {
        headers: {
          ...apiHeaders,
          "content-type": "application/json",
        },
      },
    ),
    400,
    "connector_secret_inline_not_allowed",
  );

  const connectorSourceResponse = await client.post(
    "/api/carboti/connectors/sources",
    JSON.stringify({
      config: {
        bucket: "incoming-documents",
        prefix: "raw/",
      },
      kind: "r2",
      name: "Incoming R2 bucket",
      secretRefs: {
        credential: connectorSecret.secret.id,
      },
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(connectorSourceResponse, 201);
  const connectorSource = await connectorSourceResponse.json();
  assert(
    connectorSource.source.kind === "r2" && connectorSource.source.id.startsWith("source:r2:"),
    "R2 connector source registration succeeds",
  );

  const connectorSinkResponse = await client.post(
    "/api/carboti/connectors/sinks",
    JSON.stringify({
      config: {
        bucket: "processed-archive",
        prefix: "artifacts/",
      },
      kind: "s3",
      name: "S3 artifact archive",
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(connectorSinkResponse, 201);
  const connectorSink = await connectorSinkResponse.json();
  assert(
    connectorSink.sink.kind === "s3" && connectorSink.manifest.direction === "source_sink",
    "S3 connector sink registration succeeds",
  );

  const connectorHealthResponse = await client.post(
    `/api/carboti/connectors/sources/${connectorSource.source.id}/health`,
    "",
    {
      headers: apiHeaders,
    },
  );
  await expectStatus(connectorHealthResponse, 201);
  const connectorHealth = await connectorHealthResponse.json();
  assert(
    connectorHealth.health.status === "healthy" &&
      connectorHealth.health.details.checks.some(
        (check) => check.name === "secret_refs" && check.secretRefKeys.includes("credential"),
      ),
    "connector health check records operational status and credential refs",
  );

  const connectorHealthRead = await client.json(
    `/api/carboti/connectors/sources/${connectorSource.source.id}/health`,
    {
      headers: apiHeaders,
    },
  );
  assert(
    connectorHealthRead.health.status === "healthy",
    "connector health read returns the latest recorded check",
  );

  const connectorIngestResponse = await client.post(
    `/api/carboti/connectors/sources/${connectorSource.source.id}/ingest`,
    JSON.stringify({
      connectorMessageId: "r2://incoming-documents/raw/ledger.csv",
      contentText: "label,value\nConnector,99\n",
      contentType: "text/csv",
      filename: "ledger.csv",
      metadata: {
        objectKey: "raw/ledger.csv",
      },
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(connectorIngestResponse, 202);
  const connectorIngest = await connectorIngestResponse.json();
  assert(
    connectorIngest.rawObject.objectKey.startsWith("raw-connectors/r2/"),
    "connector ingest stores raw objects under connector-specific R2 keys",
  );
  assert(
    env.SOURCE_FILES.has(connectorIngest.rawObject.objectKey),
    "connector ingest preserves the raw object in R2",
  );

  const connectorArtifacts = await client.json(
    `/api/carboti/messages/${connectorIngest.messageId}/artifacts`,
    {
      headers: apiHeaders,
    },
  );
  assert(
    connectorArtifacts.artifacts
      .map((artifact) => artifact.kind)
      .sort()
      .join(",") === "message_text,normalized_json",
    "connector ingest creates the same normalized JSON and text artifacts as HTTP ingest",
  );
  const connectorNormalized = connectorArtifacts.artifacts.find(
    (artifact) => artifact.kind === "normalized_json",
  );
  const connectorNormalizedDetail = await client.json(
    `/api/carboti/artifacts/${connectorNormalized.id}`,
    {
      headers: apiHeaders,
    },
  );
  assert(
    connectorNormalizedDetail.artifact.data.metadata.connector.kind === "r2" &&
      connectorNormalizedDetail.artifact.data.rawObjectRef.objectKey ===
        connectorIngest.rawObject.objectKey,
    "connector normalized artifact links source metadata to the preserved raw object",
  );

  const connectorLineage = await client.json(
    `/api/carboti/messages/${connectorIngest.messageId}/lineage`,
    {
      headers: apiHeaders,
    },
  );
  assert(
    connectorLineage.edges
      .map((edge) => edge.relation)
      .sort()
      .join(",") === "normalized_to,processed_into,processed_into",
    "connector ingest records raw-to-normalized and normalized-to-artifact lineage",
  );

  const connectorTrace = await client.json(
    `/api/carboti/messages/${connectorIngest.messageId}/trace`,
    {
      headers: apiHeaders,
    },
  );
  assert(
    connectorTrace.trace.summary.objectCount >= 3 &&
      connectorTrace.trace.summary.artifactCount === 2 &&
      connectorTrace.trace.audits.some(
        (event) => event.action === "carboti.connector.ingest.accepted",
      ),
    "message trace returns objects, artifacts, lineage, runs, deliveries, and audit context",
  );

  const connectorDownloadResponse = await client.request(
    `/api/carboti/artifacts/${connectorNormalized.id}/download`,
    {
      headers: apiHeaders,
    },
  );
  await expectStatus(connectorDownloadResponse, 200);
  assert(
    (await connectorDownloadResponse.text()).includes("rawObjectRef"),
    "artifact download returns artifact data as a downloadable response",
  );

  const connectorDownloadUrlResponse = await client.post(
    `/api/carboti/artifacts/${connectorNormalized.id}/download-url`,
    JSON.stringify({
      ttlSeconds: 60,
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(connectorDownloadUrlResponse, 201);
  const connectorDownloadUrl = await connectorDownloadUrlResponse.json();
  const signedDownload = await client.request(connectorDownloadUrl.url);
  await expectStatus(signedDownload, 200);
  assert(
    (await signedDownload.text()).includes("sourceMetadata"),
    "signed artifact download URL works without bearer auth",
  );

  const revokeSecretResponse = await client.post(
    `/api/carboti/secrets/${connectorSecret.secret.id}/revoke`,
    "",
    {
      headers: apiHeaders,
    },
  );
  await expectStatus(revokeSecretResponse, 200);
  await expectApiError(
    await client.post(
      "/api/carboti/connectors/sources",
      JSON.stringify({
        config: {
          bucket: "revoked-secret-test",
        },
        kind: "r2",
        name: "Revoked secret source",
        secretRefs: {
          credential: connectorSecret.secret.id,
        },
      }),
      {
        headers: {
          ...apiHeaders,
          "content-type": "application/json",
        },
      },
    ),
    400,
    "connector_secret_ref_not_found",
  );

  const processorRuntimes = await client.json("/api/carboti/processor-runtimes", {
    headers: apiHeaders,
  });
  assert(
    processorRuntimes.runtimes.some(
      (runtime) =>
        runtime.runtime === "cloudflare_workers" &&
        runtime.maxResourceLimits.networkPolicy === "egress_allowlist",
    ),
    "hosted processor runtime discovery exposes Cloudflare resource boundaries",
  );

  const hostedProcessorResponse = await client.post(
    "/api/carboti/processors/hosted",
    JSON.stringify({
      capabilityManifest: {
        inputArtifactKinds: ["normalized_json"],
        inputObjectKinds: ["normalized_message"],
        outputArtifactKinds: ["processor_output"],
        permissions: ["read:message", "read:artifacts", "write:artifacts"],
      },
      entrypoint: "processors/extract-ledger.ts",
      name: "Hosted ledger extractor",
      resourceLimits: {
        cpuMs: 999999,
        maxInputBytes: 999999999,
        maxOutputBytes: 999999999,
        memoryMb: 9999,
        networkPolicy: "egress_any",
        timeoutSeconds: 999,
      },
      runtime: "cloudflare_workers",
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(hostedProcessorResponse, 201);
  const hostedProcessor = await hostedProcessorResponse.json();
  assert(
    hostedProcessor.kind === "hosted" &&
      hostedProcessor.resourceLimits.timeoutSeconds === 300 &&
      hostedProcessor.resourceLimits.cpuMs === 300000 &&
      hostedProcessor.resourceLimits.maxInputBytes === 10000000 &&
      hostedProcessor.resourceLimits.memoryMb === 128 &&
      hostedProcessor.resourceLimits.networkPolicy === "egress_allowlist",
    "hosted processor registration clamps requested limits to runtime boundaries",
  );

  const ingestResponse = await client.post(
    "/api/carboti/ingest/http",
    "label,value\nExternal,42\n",
    {
      headers: {
        ...apiHeaders,
        "content-type": "text/plain",
        "x-carboti-filename": "external-ledger.txt",
      },
    },
  );
  await expectStatus(ingestResponse, 202);
  const ingest = await ingestResponse.json();

  assert(ingest.status === "accepted", "HTTP ingest accepts raw document input");
  assert(ingest.messageId, "HTTP ingest returns a Carboti message id");
  assert(
    ingest.rawObject?.objectKey?.startsWith("raw-http/"),
    "HTTP ingest stores raw objects under raw-http",
  );
  assert(env.SOURCE_FILES.has(ingest.rawObject.objectKey), "HTTP raw object is present in R2");
  assert(
    ingest.importPipeline?.status === "queued",
    "supported HTTP ingest enters the source-file import pipeline",
  );

  const objectDetail = await client.json(`/api/carboti/objects/${ingest.rawObject.id}`, {
    headers: apiHeaders,
  });
  assert(objectDetail.object.kind === "raw_document", "object detail exposes raw document kind");
  assert(
    objectDetail.object.objectKey === ingest.rawObject.objectKey,
    "object detail exposes raw object key",
  );

  const artifacts = await client.json(`/api/carboti/messages/${ingest.messageId}/artifacts`, {
    headers: apiHeaders,
  });
  const artifactKinds = artifacts.artifacts
    .map((artifact) => artifact.kind)
    .sort()
    .join(",");
  assert(
    artifactKinds === "message_text,normalized_json",
    "HTTP ingest creates normalized JSON and message text artifacts",
  );

  const normalizedArtifact = artifacts.artifacts.find(
    (artifact) => artifact.kind === "normalized_json",
  );
  const normalizedDetail = await client.json(`/api/carboti/artifacts/${normalizedArtifact.id}`, {
    headers: apiHeaders,
  });
  assert(
    normalizedDetail.artifact.data.rawObjectRef.objectKey === ingest.rawObject.objectKey,
    "normalized artifact links back to the raw object",
  );
  assert(
    normalizedDetail.artifact.data.metadata.importPipeline.importJobId,
    "normalized artifact records import pipeline handoff",
  );

  const lineage = await client.json(`/api/carboti/messages/${ingest.messageId}/lineage`, {
    headers: apiHeaders,
  });
  const lineageRelations = lineage.edges
    .map((edge) => edge.relation)
    .sort()
    .join(",");
  assert(
    lineageRelations === "normalized_to,processed_into,processed_into",
    "HTTP ingest records raw-to-normalized and normalized-to-artifact lineage",
  );

  const agentSearch = await client.post(
    "/api/carboti/agent/artifacts/search",
    JSON.stringify({
      kinds: ["normalized_json"],
      limit: 5,
      messageId: ingest.messageId,
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(agentSearch, 200);
  const agentSearchResult = await agentSearch.json();
  assert(
    agentSearchResult.artifacts.length === 1 &&
      agentSearchResult.artifacts[0].kind === "normalized_json" &&
      !("data" in agentSearchResult.artifacts[0]),
    "agent artifact search returns safe metadata without artifact data",
  );

  const agentInspect = await client.json(
    `/api/carboti/agent/artifacts/${agentSearchResult.artifacts[0].id}/inspect`,
    {
      headers: apiHeaders,
    },
  );
  assert(
    agentInspect.artifact.dataPreview.includes("rawObjectRef"),
    "agent artifact inspect returns a bounded preview",
  );

  const agentAccessResponse = await client.post(
    `/api/carboti/agent/artifacts/${agentSearchResult.artifacts[0].id}/access`,
    JSON.stringify({
      ttlSeconds: 60,
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(agentAccessResponse, 201);
  const agentAccess = await agentAccessResponse.json();
  assert(agentAccess.token && agentAccess.url, "agent artifact access returns a signed token");

  const signedArtifact = await client.json(agentAccess.url);
  assert(
    signedArtifact.artifact.id === agentSearchResult.artifacts[0].id &&
      signedArtifact.artifact.data.rawObjectRef.objectKey === ingest.rawObject.objectKey,
    "signed artifact access can retrieve the artifact without bearer auth",
  );

  const agentContextResponse = await client.post(
    `/api/carboti/agent/messages/${ingest.messageId}/context`,
    JSON.stringify({
      artifactKinds: ["normalized_json"],
      limit: 2,
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(agentContextResponse, 201);
  const agentContext = await agentContextResponse.json();
  assert(
    agentContext.kind === "agent_context_bundle" && agentContext.itemCount === 1,
    "agent context bundle is created from eligible artifacts",
  );

  const agentContextArtifact = await client.json(
    `/api/carboti/artifacts/${agentContext.artifactId}`,
    {
      headers: apiHeaders,
    },
  );
  assert(
    agentContextArtifact.artifact.kind === "agent_context_bundle" &&
      agentContextArtifact.artifact.data.policy.rawObjectsIncluded === false,
    "agent context bundle stores safe retrieval policy",
  );

  const mcpToolsResponse = await client.post(
    "/api/carboti/mcp",
    JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "tools/list",
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(mcpToolsResponse, 200);
  const mcpTools = await mcpToolsResponse.json();
  assert(
    mcpTools.result.tools.some((tool) => tool.name === "carboti.retrieve_context") &&
      mcpTools.result.tools.some((tool) => tool.name === "carboti.replay_message"),
    "MCP endpoint lists stable Carboti agent tools",
  );

  const mcpRetrieveResponse = await client.post(
    "/api/carboti/mcp",
    JSON.stringify({
      id: 2,
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        arguments: {
          artifactKinds: ["normalized_json"],
          messageId: ingest.messageId,
        },
        name: "carboti.retrieve_context",
      },
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(mcpRetrieveResponse, 200);
  const mcpRetrieve = await mcpRetrieveResponse.json();
  assert(
    JSON.parse(mcpRetrieve.result.content[0].text).kind === "agent_context_bundle",
    "MCP retrieve_context creates an agent context bundle",
  );

  const agentAudit = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM audit_events WHERE action IN (?, ?)",
  )
    .bind("carboti.agent.artifacts.searched", "carboti.agent.context_bundle.created")
    .first();
  assert(agentAudit.count >= 2, "agent reads and context creation are audited");

  await expectApiError(
    await client.post(
      `/api/carboti/messages/${ingest.messageId}/artifacts`,
      JSON.stringify({
        data: {
          total: 42,
        },
        kind: "not_a_real_artifact",
      }),
      {
        headers: {
          ...apiHeaders,
          "content-type": "application/json",
        },
      },
    ),
    400,
    "invalid_request",
  );

  const submittedResponse = await client.post(
    `/api/carboti/messages/${ingest.messageId}/artifacts`,
    JSON.stringify({
      data: {
        rows: 1,
        total: 42,
      },
      kind: "processor_output",
      schemaId: "external.ledger.summary.v1",
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(submittedResponse, 201);
  const submitted = await submittedResponse.json();
  assert(submitted.status === "succeeded", "external artifact submission succeeds");
  assert(
    submitted.inputObjectId === ingest.normalizedMessageObjectId,
    "external artifact submission uses the normalized message as processor input",
  );

  const submittedArtifact = await client.json(`/api/carboti/artifacts/${submitted.artifactId}`, {
    headers: apiHeaders,
  });
  assert(
    submittedArtifact.artifact.kind === "processor_output",
    "submitted artifact keeps the requested artifact kind",
  );
  assert(
    submittedArtifact.artifact.processorRunId === submitted.processorRunId,
    "submitted artifact exposes its processor run id",
  );
  assert(
    submittedArtifact.artifact.data.total === 42,
    "submitted artifact stores processor output data",
  );

  const submittedRun = await env.DB.prepare(
    "SELECT status, processor_id, input_object_id, output_artifact_count FROM carboti_processor_runs WHERE id = ?",
  )
    .bind(submitted.processorRunId)
    .first();
  assert(submittedRun.status === "succeeded", "submitted artifact records a processor run");
  assert(
    submittedRun.input_object_id === ingest.normalizedMessageObjectId,
    "submitted processor run references normalized input",
  );
  assert(
    submittedRun.output_artifact_count === 1,
    "submitted processor run records one artifact output",
  );

  const lineageAfterSubmit = await client.json(
    `/api/carboti/messages/${ingest.messageId}/lineage`,
    {
      headers: apiHeaders,
    },
  );
  assert(
    lineageAfterSubmit.edges.some(
      (edge) =>
        edge.processorRunId === submitted.processorRunId &&
        edge.toObjectId === submitted.artifactId,
    ),
    "submitted artifact lineage links processor run to artifact",
  );

  const processorCapabilityManifest = {
    inputArtifactKinds: ["normalized_json"],
    inputObjectKinds: ["normalized_message"],
    outputArtifactKinds: ["processor_output"],
    permissions: ["read:message", "read:artifacts", "write:artifacts"],
  };

  const processorResponse = await client.post(
    "/api/carboti/processors/external",
    JSON.stringify({
      capabilityManifest: processorCapabilityManifest,
      endpointUrl: "https://processor.example.test/process",
      name: "Integration processor",
      signingSecret: processorSigningSecret,
      timeoutSeconds: 5,
    }),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/json",
      },
    },
  );
  await expectStatus(processorResponse, 201);
  const processor = await processorResponse.json();
  assert(processor.kind === "external_webhook", "external processor config is created");
  assert(
    processor.capabilityManifest.outputArtifactKinds.join(",") === "processor_output",
    "external processor config returns its capability manifest",
  );
  assert(processor.signingSecretRef, "external processor config returns a signing secret ref");

  const processorConfigRow = await env.DB.prepare(
    "SELECT config_json FROM carboti_processor_configs WHERE id = ?",
  )
    .bind(processor.processorId)
    .first();
  const processorConfig = JSON.parse(processorConfigRow.config_json);
  assert(
    processorConfig.signingSecretRef === processor.signingSecretRef,
    "processor config stores a signing secret ref",
  );
  assert(
    !("signingSecret" in processorConfig),
    "processor config does not store the inline signing secret",
  );

  const processorSecretRow = await env.DB.prepare(
    "SELECT ciphertext FROM carboti_secret_refs WHERE id = ?",
  )
    .bind(processor.signingSecretRef)
    .first();
  assert(processorSecretRow.ciphertext, "processor signing secret is stored as ciphertext");
  assert(
    !processorSecretRow.ciphertext.includes(processorSigningSecret),
    "processor signing secret ciphertext does not contain the plaintext secret",
  );

  let signedRequestVerified = false;
  await withMockedFetch(
    async (request) => {
      const body = await request.text();
      const timestamp = request.headers.get("x-carboti-timestamp");
      const signature = request.headers.get("x-carboti-signature");
      const expectedSignature = `v1=${createHmac("sha256", processorSigningSecret)
        .update(`${timestamp}.${body}`)
        .digest("hex")}`;
      signedRequestVerified = signature === expectedSignature;

      const payload = JSON.parse(body);
      assert(
        payload.capabilityManifest.inputArtifactKinds.join(",") === "normalized_json",
        "processor receives its capability manifest",
      );
      assert(payload.messageId === ingest.messageId, "processor receives the message id");
      assert(
        payload.inputObject.id === ingest.normalizedMessageObjectId,
        "processor receives normalized input object",
      );
      assert(
        payload.artifacts.map((artifact) => artifact.kind).join(",") === "normalized_json",
        "processor only receives artifacts allowed by its capability manifest",
      );
      assert(
        request.headers.get("x-carboti-idempotency-key"),
        "processor request includes idempotency key",
      );

      return new Response(
        JSON.stringify({
          artifacts: [
            {
              data: {
                extractedTotal: 42,
              },
              kind: "processor_output",
              schemaId: "external.processor.output.v1",
            },
          ],
        }),
        {
          headers: {
            "content-type": "application/json",
          },
          status: 200,
        },
      );
    },
    async () => {
      const invokeResponse = await client.post(
        `/api/carboti/processors/${processor.processorId}/invoke`,
        JSON.stringify({
          messageId: ingest.messageId,
        }),
        {
          headers: {
            ...apiHeaders,
            "content-type": "application/json",
          },
        },
      );
      await expectStatus(invokeResponse, 201);
      const invoke = await invokeResponse.json();
      assert(invoke.status === "succeeded", "external processor invocation succeeds");
      assert(invoke.artifactIds.length === 1, "external processor response creates one artifact");

      const processorArtifact = await client.json(
        `/api/carboti/artifacts/${invoke.artifactIds[0]}`,
        {
          headers: apiHeaders,
        },
      );
      assert(
        processorArtifact.artifact.processorRunId === invoke.processorRunId,
        "processor response artifact links to invocation run",
      );
      assert(
        processorArtifact.artifact.data.extractedTotal === 42,
        "processor response artifact stores returned data",
      );

      const processorRun = await env.DB.prepare(
        "SELECT status, processor_id, output_artifact_count FROM carboti_processor_runs WHERE id = ?",
      )
        .bind(invoke.processorRunId)
        .first();
      assert(processorRun.status === "succeeded", "processor invocation records succeeded run");
      assert(
        processorRun.processor_id === processor.processorId,
        "processor invocation run references external processor",
      );
      assert(
        processorRun.output_artifact_count === 1,
        "processor invocation records output artifact count",
      );

      const delivery = await env.DB.prepare(
        "SELECT id, status, response_status FROM carboti_webhook_deliveries WHERE id = ?",
      )
        .bind(invoke.deliveryId)
        .first();
      assert(delivery.status === "delivered", "processor invocation records delivery success");
      assert(delivery.response_status === 200, "processor delivery records response status");
      await expectApiError(
        await client.post(`/api/carboti/processor-deliveries/${delivery.id}/retry`, "", {
          headers: apiHeaders,
        }),
        409,
        "delivery_not_retryable",
      );
    },
  );
  assert(signedRequestVerified, "processor invocation signs the outbound request with HMAC");

  await withMockedFetch(
    async () =>
      new Response(
        JSON.stringify({
          artifacts: [
            {
              data: {
                rows: [],
              },
              kind: "table",
            },
          ],
        }),
        {
          headers: {
            "content-type": "application/json",
          },
          status: 200,
        },
      ),
    async () => {
      await expectApiError(
        await client.post(
          `/api/carboti/processors/${processor.processorId}/invoke`,
          JSON.stringify({
            messageId: ingest.messageId,
          }),
          {
            headers: {
              ...apiHeaders,
              "content-type": "application/json",
            },
          },
        ),
        502,
        "processor_capability_violation",
      );

      const capabilityRun = await env.DB.prepare(
        "SELECT status, error_message FROM carboti_processor_runs WHERE processor_id = ? ORDER BY started_at DESC LIMIT 1",
      )
        .bind(processor.processorId)
        .first();
      assert(capabilityRun.status === "failed", "capability violation records failed run");
      assert(
        capabilityRun.error_message.includes("output artifact kind"),
        "capability violation explains the rejected output kind",
      );
    },
  );

  await withMockedFetch(
    async () =>
      new Response("processor exploded", {
        status: 500,
      }),
    async () => {
      await expectApiError(
        await client.post(
          `/api/carboti/processors/${processor.processorId}/invoke`,
          JSON.stringify({
            messageId: ingest.messageId,
          }),
          {
            headers: {
              ...apiHeaders,
              "content-type": "application/json",
            },
          },
        ),
        502,
        "processor_response_failed",
      );

      const failedRun = await env.DB.prepare(
        "SELECT status, error_message FROM carboti_processor_runs WHERE processor_id = ? AND error_message LIKE ? ORDER BY started_at DESC LIMIT 1",
      )
        .bind(processor.processorId, "%processor exploded%")
        .first();
      assert(failedRun.status === "failed", "failed processor response records failed run");
      assert(
        failedRun.error_message.includes("processor exploded"),
        "failed processor run stores response error text",
      );

      const failedDelivery = await env.DB.prepare(
        "SELECT id, status, response_status FROM carboti_webhook_deliveries WHERE processor_id = ? AND response_status = ? ORDER BY created_at DESC LIMIT 1",
      )
        .bind(processor.processorId, 500)
        .first();
      assert(failedDelivery.status === "failed", "failed processor response records delivery");
      assert(failedDelivery.response_status === 500, "failed delivery records response status");

      await withMockedFetch(
        async () =>
          new Response(
            JSON.stringify({
              artifacts: [
                {
                  data: {
                    recovered: true,
                  },
                  kind: "processor_output",
                  schemaId: "external.processor.retry.v1",
                },
              ],
            }),
            {
              headers: {
                "content-type": "application/json",
              },
              status: 200,
            },
          ),
        async () => {
          const retryResponse = await client.post(
            `/api/carboti/processor-deliveries/${failedDelivery.id}/retry`,
            "",
            {
              headers: apiHeaders,
            },
          );
          await expectStatus(retryResponse, 201);
          const retry = await retryResponse.json();
          assert(
            retry.retriedFromDeliveryId === failedDelivery.id,
            "retry response links back to failed delivery",
          );
          assert(retry.artifactIds.length === 1, "retry stores returned artifact");

          const retryDelivery = await env.DB.prepare(
            "SELECT status, attempt_count, retry_of_delivery_id FROM carboti_webhook_deliveries WHERE id = ?",
          )
            .bind(retry.deliveryId)
            .first();
          assert(retryDelivery.status === "delivered", "retry records delivered status");
          assert(retryDelivery.attempt_count === 2, "retry increments attempt count");
          assert(
            retryDelivery.retry_of_delivery_id === failedDelivery.id,
            "retry delivery points at original failed delivery",
          );

          const retryArtifact = await client.json(
            `/api/carboti/artifacts/${retry.artifactIds[0]}`,
            {
              headers: apiHeaders,
            },
          );
          assert(
            retryArtifact.artifact.data.recovered === true,
            "retry stores recovered processor artifact",
          );
        },
      );
    },
  );

  const replayResponse = await client.post(`/api/carboti/messages/${ingest.messageId}/replay`, "", {
    headers: apiHeaders,
  });
  await expectStatus(replayResponse, 201);
  const replay = await replayResponse.json();
  assert(replay.status === "succeeded", "replay completes synchronously for preserved raw object");
  assert(replay.artifactId, "replay returns processor output artifact id");

  const replayRun = await env.DB.prepare(
    "SELECT status, input_object_id, output_artifact_count FROM carboti_processor_runs WHERE id = ?",
  )
    .bind(replay.processorRunId)
    .first();
  assert(replayRun.status === "succeeded", "replay records a succeeded processor run");
  assert(
    replayRun.input_object_id === ingest.rawObject.id,
    "replay processor run references the raw object",
  );
  assert(replayRun.output_artifact_count === 1, "replay processor run records output count");

  const replayArtifact = await client.json(`/api/carboti/artifacts/${replay.artifactId}`, {
    headers: apiHeaders,
  });
  assert(replayArtifact.artifact.kind === "processor_output", "replay stores processor output");
  assert(
    replayArtifact.artifact.data.inputObject.objectKey === ingest.rawObject.objectKey,
    "replay artifact proves raw object availability",
  );

  const unsupportedResponse = await client.post(
    "/api/carboti/ingest/http",
    new Uint8Array([0, 1, 2, 3]),
    {
      headers: {
        ...apiHeaders,
        "content-type": "application/octet-stream",
        "x-carboti-filename": "opaque.bin",
      },
    },
  );
  await expectStatus(unsupportedResponse, 202);
  const unsupported = await unsupportedResponse.json();
  assert(
    unsupported.importPipeline?.status === "unsupported_source_file",
    "unsupported HTTP ingest reports unsupported pipeline status",
  );
  assert(
    env.SOURCE_FILES.has(unsupported.rawObject.objectKey),
    "unsupported HTTP ingest still preserves the raw object",
  );

  const unsupportedArtifacts = await client.json(
    `/api/carboti/messages/${unsupported.messageId}/artifacts`,
    {
      headers: apiHeaders,
    },
  );
  assert(
    unsupportedArtifacts.artifacts.map((artifact) => artifact.kind).join(",") === "normalized_json",
    "unsupported HTTP ingest still creates normalized JSON evidence",
  );
}

async function seedApiClient(env) {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `
      INSERT INTO carboti_api_clients (
        id,
        workspace_id,
        name,
        token_hash,
        scopes_json,
        status,
        created_at,
        revoked_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
  )
    .bind(
      apiClientId,
      "default",
      "Integration API client",
      hashSecret(apiToken),
      JSON.stringify([
        "api_clients:read",
        "api_clients:write",
        "ingest:write",
        "objects:read",
        "artifacts:read",
        "artifacts:write",
        "lineage:read",
        "messages:read",
        "connectors:read",
        "connectors:write",
        "processors:invoke",
        "processors:read",
        "processors:write",
        "replay:write",
        "agent:read",
        "secrets:read",
        "secrets:write",
      ]),
      "active",
      now,
      null,
    )
    .run();
}

function hashSecret(secret) {
  return `sha256.${createHash("sha256").update(secret).digest("base64url")}`;
}

async function withMockedFetch(fetchImplementation, callback) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => fetchImplementation(new Request(input, init));
  try {
    await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
}
