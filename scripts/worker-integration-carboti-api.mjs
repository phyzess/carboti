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
        "SELECT status, error_message FROM carboti_processor_runs WHERE processor_id = ? ORDER BY started_at DESC LIMIT 1",
      )
        .bind(processor.processorId)
        .first();
      assert(failedRun.status === "failed", "failed processor response records failed run");
      assert(
        failedRun.error_message.includes("processor exploded"),
        "failed processor run stores response error text",
      );

      const failedDelivery = await env.DB.prepare(
        "SELECT id, status, response_status FROM carboti_webhook_deliveries ORDER BY created_at DESC LIMIT 1",
      ).first();
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
        "ingest:write",
        "objects:read",
        "artifacts:read",
        "artifacts:write",
        "lineage:read",
        "processors:invoke",
        "processors:write",
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

async function withMockedFetch(fetchImplementation, callback) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => fetchImplementation(new Request(input, init));
  try {
    await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
}
