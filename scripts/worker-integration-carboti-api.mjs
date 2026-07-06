import { createHash } from "node:crypto";
import { assert, expectApiError, expectStatus } from "./worker-integration-http.mjs";

const apiToken = "carboti-api-integration-token";
const apiClientId = "api-client:integration";
const apiHeaders = {
  authorization: `Bearer ${apiToken}`,
};

export async function testCarbotiHttpIngestAndReplay({ client, env }) {
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
        "ingest:write",
        "objects:read",
        "artifacts:read",
        "lineage:read",
        "replay:write",
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
