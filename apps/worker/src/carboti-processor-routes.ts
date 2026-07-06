import { createAuditEvent } from "@carboti/audit";
import {
  CarbotiArtifactKindSchema,
  CarbotiHostedProcessorResourceLimitsSchema,
  CarbotiHostedProcessorRuntimeSchema,
  CarbotiObjectKindSchema,
  CarbotiProcessorCapabilityManifestSchema,
  carbotiHostedProcessorRuntimeManifests,
  getCarbotiHostedProcessorRuntimeManifest,
  normalizeCarbotiHostedProcessorResourceLimits,
  normalizeCarbotiProcessorCapabilityManifest,
  type CarbotiProcessorCapabilityManifest,
  type CarbotiHostedProcessorRuntime,
} from "@carboti/core";
import type { Hono } from "hono";
import * as v from "valibot";
import { prepareAuditInsert } from "./audit-store";
import {
  apiClientActorId,
  requireCarbotiApiClient,
  type CarbotiApiClient,
} from "./carboti-api-auth";
import {
  decryptCarbotiSecret,
  encryptCarbotiSecret,
  type CarbotiEncryptedSecret,
} from "./carboti-secret-store";
import { authError, parseRequestJson, type AppContext } from "./http-utils";

const CreateExternalProcessorInputSchema = v.object({
  capabilityManifest: v.optional(CarbotiProcessorCapabilityManifestSchema),
  endpointUrl: v.pipe(v.string(), v.url()),
  name: v.string(),
  signingSecret: v.pipe(v.string(), v.minLength(16)),
  timeoutSeconds: v.optional(v.number()),
});

const CreateHostedProcessorInputSchema = v.object({
  capabilityManifest: v.optional(CarbotiProcessorCapabilityManifestSchema),
  entrypoint: v.optional(v.string()),
  name: v.string(),
  resourceLimits: v.optional(CarbotiHostedProcessorResourceLimitsSchema),
  runtime: v.optional(CarbotiHostedProcessorRuntimeSchema),
});

const InvokeExternalProcessorInputSchema = v.object({
  messageId: v.string(),
});

const ExternalProcessorArtifactSchema = v.object({
  contentType: v.optional(v.string()),
  data: v.unknown(),
  kind: CarbotiArtifactKindSchema,
  schemaId: v.optional(v.string()),
});

const ExternalProcessorResponseSchema = v.object({
  artifacts: v.array(ExternalProcessorArtifactSchema),
});

type CreateExternalProcessorInput = v.InferOutput<typeof CreateExternalProcessorInputSchema>;
type CreateHostedProcessorInput = v.InferOutput<typeof CreateHostedProcessorInputSchema>;
type ExternalProcessorArtifact = v.InferOutput<typeof ExternalProcessorArtifactSchema>;
type ExternalProcessorResponse = v.InferOutput<typeof ExternalProcessorResponseSchema>;

type ProcessorConfigRow = {
  config_json: string | null;
  endpoint_url: string | null;
  id: string;
  name: string;
  timeout_seconds: number | null;
  workspace_id: string;
};

type ProcessorInputObjectRow = {
  data_json: string | null;
  id: string;
  kind: string;
  object_key: string | null;
  source_id: string | null;
};

type ProcessorArtifactRow = {
  data_json: string | null;
  id: string;
  kind: string;
};

type ProcessorDeliveryRow = {
  attempt_count: number;
  id: string;
  input_object_id: string | null;
  message_id: string | null;
  processor_id: string | null;
  status: string;
};

type ProcessorSecretRow = CarbotiEncryptedSecret;

export function registerCarbotiProcessorRoutes(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/carboti/processor-runtimes", async (context) => {
    const auth = await requireCarbotiApiClient(context, "processors:read");
    if (!auth.ok) return auth.response;

    return context.json({
      runtimes: carbotiHostedProcessorRuntimeManifests,
    });
  });

  app.post("/api/carboti/processors/external", async (context) => {
    const auth = await requireCarbotiApiClient(context, "processors:write");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, CreateExternalProcessorInputSchema);
    if (!parsed.ok) return parsed.response;

    return createExternalProcessor(context, {
      client: auth.client,
      input: parsed.value,
    });
  });

  app.post("/api/carboti/processors/hosted", async (context) => {
    const auth = await requireCarbotiApiClient(context, "processors:write");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, CreateHostedProcessorInputSchema);
    if (!parsed.ok) return parsed.response;

    return createHostedProcessor(context, {
      client: auth.client,
      input: parsed.value,
    });
  });

  app.post("/api/carboti/processors/:processorId/invoke", async (context) => {
    const auth = await requireCarbotiApiClient(context, "processors:invoke");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, InvokeExternalProcessorInputSchema);
    if (!parsed.ok) return parsed.response;

    return invokeExternalProcessor(context, {
      client: auth.client,
      messageId: parsed.value.messageId,
      processorId: context.req.param("processorId"),
    });
  });

  app.post("/api/carboti/processor-deliveries/:deliveryId/retry", async (context) => {
    const auth = await requireCarbotiApiClient(context, "processors:invoke");
    if (!auth.ok) return auth.response;

    return retryProcessorDelivery(context, {
      client: auth.client,
      deliveryId: context.req.param("deliveryId"),
    });
  });
}

async function createHostedProcessor(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    input: CreateHostedProcessorInput;
  },
): Promise<Response> {
  const now = new Date().toISOString();
  const runtime: CarbotiHostedProcessorRuntime = input.input.runtime ?? "cloudflare_workers";
  const runtimeManifest = getCarbotiHostedProcessorRuntimeManifest(runtime);
  const resourceLimits = normalizeCarbotiHostedProcessorResourceLimits(
    input.input.resourceLimits ?? {},
    runtime,
  );
  const capabilityManifest = normalizeCarbotiProcessorCapabilityManifest(
    input.input.capabilityManifest,
  );
  const processorId = `processor:hosted:${crypto.randomUUID()}`;

  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        INSERT INTO carboti_processor_configs (
          id,
          workspace_id,
          kind,
          name,
          endpoint_url,
          timeout_seconds,
          status,
          config_json,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      processorId,
      input.client.workspaceId,
      "hosted",
      input.input.name,
      null,
      resourceLimits.timeoutSeconds,
      "active",
      JSON.stringify({
        apiClientId: input.client.id,
        capabilityManifest,
        entrypoint: input.input.entrypoint ?? null,
        resourceLimits,
        runtime,
        runtimeIsolation: runtimeManifest.isolation,
        runtimeManifestVersion: "2026-07-06",
      }),
      now,
      now,
    ),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.processor.hosted.created",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          capabilityManifest,
          resourceLimits,
          runtime,
          runtimeIsolation: runtimeManifest.isolation,
        },
        subject: {
          id: processorId,
          kind: "carboti_processor",
        },
      }),
    ),
  ]);

  return context.json(
    {
      capabilityManifest,
      kind: "hosted",
      processorId,
      resourceLimits,
      runtime,
      runtimeManifest,
      status: "active",
    },
    201,
  );
}

async function createExternalProcessor(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    input: CreateExternalProcessorInput;
  },
): Promise<Response> {
  const now = new Date().toISOString();
  const processorId = `processor:external:${crypto.randomUUID()}`;
  const endpointId = endpointIdFor(processorId);
  const signingSecretRef = signingSecretRefFor(processorId);
  const timeoutSeconds = Math.min(Math.max(input.input.timeoutSeconds ?? 30, 1), 60);
  const capabilityManifest = normalizeCarbotiProcessorCapabilityManifest(
    input.input.capabilityManifest,
  );
  let encryptedSigningSecret: CarbotiEncryptedSecret;
  try {
    encryptedSigningSecret = await encryptCarbotiSecret(context.env, input.input.signingSecret);
  } catch {
    return authError(
      context,
      "processor_secret_store_unavailable",
      "Processor signing secret store is not configured.",
      409,
    );
  }

  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        INSERT INTO carboti_secret_refs (
          id,
          workspace_id,
          kind,
          algorithm,
          key_version,
          iv,
          ciphertext,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      signingSecretRef,
      input.client.workspaceId,
      "processor_signing_key",
      encryptedSigningSecret.algorithm,
      encryptedSigningSecret.keyVersion,
      encryptedSigningSecret.iv,
      encryptedSigningSecret.ciphertext,
      now,
      now,
    ),
    context.env.DB.prepare(
      `
        INSERT INTO carboti_processor_configs (
          id,
          workspace_id,
          kind,
          name,
          endpoint_url,
          timeout_seconds,
          status,
          config_json,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      processorId,
      input.client.workspaceId,
      "external_webhook",
      input.input.name,
      input.input.endpointUrl,
      timeoutSeconds,
      "active",
      JSON.stringify({
        apiClientId: input.client.id,
        capabilityManifest,
        signingSecretRef,
      }),
      now,
      now,
    ),
    context.env.DB.prepare(
      `
        INSERT INTO carboti_webhook_endpoints (
          id,
          workspace_id,
          url,
          status,
          secret_ref,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      endpointId,
      input.client.workspaceId,
      input.input.endpointUrl,
      "active",
      signingSecretRef,
      now,
      now,
    ),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.processor.created",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          capabilityManifest,
          endpointId,
          endpointUrl: input.input.endpointUrl,
          signingSecretRef,
          timeoutSeconds,
        },
        subject: {
          id: processorId,
          kind: "carboti_processor",
        },
      }),
    ),
  ]);

  return context.json(
    {
      capabilityManifest,
      endpointId,
      endpointUrl: input.input.endpointUrl,
      kind: "external_webhook",
      processorId,
      signingSecretRef,
      status: "active",
      timeoutSeconds,
    },
    201,
  );
}

async function invokeExternalProcessor(
  context: AppContext,
  input: {
    attemptCount?: number;
    client: CarbotiApiClient;
    messageId: string;
    processorId: string;
    retryOfDeliveryId?: string | null;
  },
): Promise<Response> {
  const processor = await readProcessorConfig(context, input.client, input.processorId);
  if (!processor?.endpoint_url) {
    return authError(context, "processor_not_found", "Processor was not found.", 404);
  }

  const config = parseProcessorConfig(processor.config_json);
  if (!config.signingSecretRef) {
    return authError(
      context,
      "processor_signing_secret_missing",
      "Processor is not invokable.",
      409,
    );
  }

  const signingSecret = await readProcessorSigningSecret(context, {
    client: input.client,
    secretRef: config.signingSecretRef,
  });
  if (!signingSecret.ok) {
    return authError(context, signingSecret.code, signingSecret.message, 409);
  }

  const processorInput = await readProcessorInputObject(context, input.client, input.messageId);
  if (!processorInput) {
    return authError(context, "message_not_found", "Message was not found.", 404);
  }

  const capabilityManifest = config.capabilityManifest;
  const now = new Date().toISOString();
  const attemptCount = input.attemptCount ?? 1;
  const processorRunId = crypto.randomUUID();
  const deliveryId = crypto.randomUUID();
  const endpointId = endpointIdFor(processor.id);
  if (!capabilityManifest.permissions.includes("read:message")) {
    await recordProcessorFailure(context, {
      client: input.client,
      deliveryId,
      endpointId,
      errorMessage: "Processor capability manifest does not allow read:message.",
      attemptCount,
      inputObjectId: processorInput.id,
      messageId: input.messageId,
      now,
      processorId: processor.id,
      processorRunId,
      retryOfDeliveryId: input.retryOfDeliveryId ?? null,
      responseStatus: null,
    });
    return authError(
      context,
      "processor_input_not_allowed",
      "Processor is not allowed to read this message.",
      409,
    );
  }

  const inputObjectKind = v.safeParse(CarbotiObjectKindSchema, processorInput.kind);
  if (
    !inputObjectKind.success ||
    !capabilityManifest.inputObjectKinds.includes(inputObjectKind.output)
  ) {
    await recordProcessorFailure(context, {
      client: input.client,
      deliveryId,
      endpointId,
      errorMessage: `Processor capability manifest does not allow input object kind "${processorInput.kind}".`,
      attemptCount,
      inputObjectId: processorInput.id,
      messageId: input.messageId,
      now,
      processorId: processor.id,
      processorRunId,
      retryOfDeliveryId: input.retryOfDeliveryId ?? null,
      responseStatus: null,
    });
    return authError(
      context,
      "processor_input_not_allowed",
      "Processor is not allowed to read this input object kind.",
      409,
    );
  }

  const payload = {
    artifacts: capabilityManifest.permissions.includes("read:artifacts")
      ? await readProcessorInputArtifacts(
          context,
          input.client,
          input.messageId,
          capabilityManifest,
        )
      : [],
    capabilityManifest,
    inputObject: {
      data: parseDataJson(processorInput.data_json),
      id: processorInput.id,
      kind: inputObjectKind.output,
      objectKey: processorInput.object_key,
    },
    messageId: input.messageId,
    processorId: processor.id,
    processorRunId,
    requestedAt: now,
  };
  const body = JSON.stringify(payload);
  const timestamp = now;
  const signature = await hmacSha256Hex(signingSecret.value, `${timestamp}.${body}`);

  let response: Response;
  try {
    response = await fetch(processor.endpoint_url, {
      body,
      headers: {
        "content-type": "application/json",
        "x-carboti-delivery-id": deliveryId,
        "x-carboti-idempotency-key": processorRunId,
        "x-carboti-signature": `v1=${signature}`,
        "x-carboti-timestamp": timestamp,
      },
      method: "POST",
      signal: AbortSignal.timeout((processor.timeout_seconds ?? 30) * 1000),
    });
  } catch (error) {
    await recordProcessorFailure(context, {
      client: input.client,
      deliveryId,
      endpointId,
      errorMessage: error instanceof Error ? error.message : "Processor invocation failed.",
      attemptCount,
      inputObjectId: processorInput.id,
      messageId: input.messageId,
      now,
      processorId: processor.id,
      processorRunId,
      retryOfDeliveryId: input.retryOfDeliveryId ?? null,
      responseStatus: null,
    });
    return authError(context, "processor_invocation_failed", "Processor invocation failed.", 502);
  }

  if (!response.ok) {
    const errorMessage = await safeResponseText(response);
    await recordProcessorFailure(context, {
      client: input.client,
      deliveryId,
      endpointId,
      errorMessage,
      attemptCount,
      inputObjectId: processorInput.id,
      messageId: input.messageId,
      now,
      processorId: processor.id,
      processorRunId,
      retryOfDeliveryId: input.retryOfDeliveryId ?? null,
      responseStatus: response.status,
    });
    return authError(context, "processor_response_failed", "Processor returned an error.", 502);
  }

  const responseBody = await readProcessorResponse(response);
  if (!responseBody.ok) {
    await recordProcessorFailure(context, {
      client: input.client,
      deliveryId,
      endpointId,
      errorMessage: responseBody.message,
      attemptCount,
      inputObjectId: processorInput.id,
      messageId: input.messageId,
      now,
      processorId: processor.id,
      processorRunId,
      retryOfDeliveryId: input.retryOfDeliveryId ?? null,
      responseStatus: response.status,
    });
    return authError(context, "processor_response_invalid", responseBody.message, 502);
  }

  const capabilityViolation = findOutputArtifactCapabilityViolation(
    responseBody.value,
    capabilityManifest,
  );
  if (capabilityViolation) {
    await recordProcessorFailure(context, {
      client: input.client,
      deliveryId,
      endpointId,
      errorMessage: capabilityViolation,
      attemptCount,
      inputObjectId: processorInput.id,
      messageId: input.messageId,
      now,
      processorId: processor.id,
      processorRunId,
      retryOfDeliveryId: input.retryOfDeliveryId ?? null,
      responseStatus: response.status,
    });
    return authError(context, "processor_capability_violation", capabilityViolation, 502);
  }

  await recordProcessorSuccess(context, {
    artifacts: responseBody.value.artifacts,
    attemptCount,
    capabilityManifest,
    client: input.client,
    deliveryId,
    endpointId,
    inputObject: processorInput,
    messageId: input.messageId,
    now,
    processorId: processor.id,
    processorRunId,
    retryOfDeliveryId: input.retryOfDeliveryId ?? null,
    responseStatus: response.status,
  });

  return context.json(
    {
      artifactIds: responseBody.value.artifacts.map((_, index) =>
        artifactIdFor(input.messageId, processorRunId, index),
      ),
      deliveryId,
      processorRunId,
      retriedFromDeliveryId: input.retryOfDeliveryId ?? null,
      status: "succeeded",
    },
    201,
  );
}

async function retryProcessorDelivery(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    deliveryId: string;
  },
): Promise<Response> {
  const delivery = await context.env.DB.prepare(
    `
      SELECT id, status, attempt_count, processor_id, message_id, input_object_id
      FROM carboti_webhook_deliveries
      WHERE id = ?
        AND workspace_id = ?
      LIMIT 1
    `,
  )
    .bind(input.deliveryId, input.client.workspaceId)
    .first<ProcessorDeliveryRow>();

  if (!delivery) {
    return authError(context, "delivery_not_found", "Processor delivery was not found.", 404);
  }

  if (delivery.status !== "failed") {
    return authError(
      context,
      "delivery_not_retryable",
      "Only failed deliveries can be retried.",
      409,
    );
  }

  if (!delivery.processor_id || !delivery.message_id) {
    return authError(
      context,
      "delivery_replay_metadata_missing",
      "Processor delivery cannot be retried because replay metadata is missing.",
      409,
    );
  }

  return invokeExternalProcessor(context, {
    attemptCount: delivery.attempt_count + 1,
    client: input.client,
    messageId: delivery.message_id,
    processorId: delivery.processor_id,
    retryOfDeliveryId: delivery.id,
  });
}

async function readProcessorConfig(
  context: AppContext,
  client: CarbotiApiClient,
  processorId: string,
): Promise<ProcessorConfigRow | null> {
  return context.env.DB.prepare(
    `
      SELECT id, workspace_id, name, endpoint_url, timeout_seconds, config_json
      FROM carboti_processor_configs
      WHERE id = ?
        AND workspace_id = ?
        AND kind = 'external_webhook'
        AND status = 'active'
      LIMIT 1
    `,
  )
    .bind(processorId, client.workspaceId)
    .first<ProcessorConfigRow>();
}

async function readProcessorInputObject(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
): Promise<ProcessorInputObjectRow | null> {
  const normalized = await context.env.DB.prepare(
    `
      SELECT id, kind, source_id, object_key, data_json
      FROM carboti_objects
      WHERE workspace_id = ?
        AND message_id = ?
        AND kind = 'normalized_message'
      ORDER BY created_at DESC
      LIMIT 1
    `,
  )
    .bind(client.workspaceId, messageId)
    .first<ProcessorInputObjectRow>();

  if (normalized) return normalized;

  return context.env.DB.prepare(
    `
      SELECT id, kind, source_id, object_key, data_json
      FROM carboti_objects
      WHERE workspace_id = ?
        AND message_id = ?
        AND kind IN ('raw_document', 'raw_email')
      ORDER BY created_at ASC
      LIMIT 1
    `,
  )
    .bind(client.workspaceId, messageId)
    .first<ProcessorInputObjectRow>();
}

async function readProcessorInputArtifacts(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
  capabilityManifest: CarbotiProcessorCapabilityManifest,
): Promise<Array<Record<string, unknown>>> {
  const result = await context.env.DB.prepare(
    `
      SELECT id, kind, data_json
      FROM carboti_artifacts
      WHERE workspace_id = ?
        AND message_id = ?
      ORDER BY created_at ASC
      LIMIT 20
    `,
  )
    .bind(client.workspaceId, messageId)
    .all<ProcessorArtifactRow>();

  return result.results.flatMap((artifact) => {
    const artifactKind = v.safeParse(CarbotiArtifactKindSchema, artifact.kind);
    if (
      !artifactKind.success ||
      !capabilityManifest.inputArtifactKinds.includes(artifactKind.output)
    ) {
      return [];
    }

    return [
      {
        data: parseDataJson(artifact.data_json),
        id: artifact.id,
        kind: artifactKind.output,
      },
    ];
  });
}

async function readProcessorSigningSecret(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    secretRef: string;
  },
): Promise<
  | {
      ok: true;
      value: string;
    }
  | {
      code: "processor_signing_secret_missing" | "processor_signing_secret_unavailable";
      message: string;
      ok: false;
    }
> {
  const secret = await context.env.DB.prepare(
    `
      SELECT
        algorithm,
        ciphertext,
        iv,
        key_version AS keyVersion
      FROM carboti_secret_refs
      WHERE id = ?
        AND workspace_id = ?
        AND kind = ?
        AND (status IS NULL OR status = 'active')
      LIMIT 1
    `,
  )
    .bind(input.secretRef, input.client.workspaceId, "processor_signing_key")
    .first<ProcessorSecretRow>();

  if (!secret) {
    return {
      code: "processor_signing_secret_missing",
      message: "Processor signing secret was not found.",
      ok: false,
    };
  }

  try {
    return {
      ok: true,
      value: await decryptCarbotiSecret(context.env, secret),
    };
  } catch {
    return {
      code: "processor_signing_secret_unavailable",
      message: "Processor signing secret could not be decrypted.",
      ok: false,
    };
  }
}

async function recordProcessorSuccess(
  context: AppContext,
  input: {
    artifacts: ExternalProcessorArtifact[];
    attemptCount: number;
    capabilityManifest: CarbotiProcessorCapabilityManifest;
    client: CarbotiApiClient;
    deliveryId: string;
    endpointId: string;
    inputObject: ProcessorInputObjectRow;
    messageId: string;
    now: string;
    processorId: string;
    processorRunId: string;
    retryOfDeliveryId: string | null;
    responseStatus: number;
  },
): Promise<void> {
  const artifactStatements = input.artifacts.flatMap((artifact, index) => {
    const artifactId = artifactIdFor(input.messageId, input.processorRunId, index);
    const dataJson = JSON.stringify(artifact.data);
    const size = new TextEncoder().encode(dataJson).byteLength;
    return [
      context.env.DB.prepare(
        `
          INSERT INTO carboti_objects (
            id,
            workspace_id,
            kind,
            source_id,
            message_id,
            object_key,
            content_type,
            content_hash,
            size,
            data_json,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      ).bind(
        artifactId,
        input.client.workspaceId,
        "artifact",
        input.inputObject.source_id,
        input.messageId,
        null,
        artifact.contentType ?? "application/json",
        null,
        size,
        JSON.stringify({
          artifactKind: artifact.kind,
          processorId: input.processorId,
        }),
        input.now,
      ),
      context.env.DB.prepare(
        `
          INSERT INTO carboti_artifacts (
            id,
            workspace_id,
            kind,
            message_id,
            processor_run_id,
            schema_id,
            object_key,
            content_type,
            content_hash,
            size,
            data_json,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      ).bind(
        artifactId,
        input.client.workspaceId,
        artifact.kind,
        input.messageId,
        input.processorRunId,
        artifact.schemaId ?? null,
        null,
        artifact.contentType ?? "application/json",
        null,
        size,
        dataJson,
        input.now,
      ),
      context.env.DB.prepare(
        `
          INSERT INTO carboti_lineage_edges (
            id,
            workspace_id,
            from_object_id,
            to_object_id,
            relation,
            processor_run_id,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      ).bind(
        crypto.randomUUID(),
        input.client.workspaceId,
        input.inputObject.id,
        artifactId,
        "processed_into",
        input.processorRunId,
        input.now,
      ),
    ];
  });

  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        INSERT INTO carboti_processor_runs (
          id,
          workspace_id,
          processor_id,
          pipeline_id,
          message_id,
          status,
          input_object_id,
          output_artifact_count,
          error_message,
          started_at,
          completed_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      input.processorRunId,
      input.client.workspaceId,
      input.processorId,
      null,
      input.messageId,
      "succeeded",
      input.inputObject.id,
      input.artifacts.length,
      null,
      input.now,
      input.now,
    ),
    context.env.DB.prepare(
      `
        INSERT INTO carboti_webhook_deliveries (
          id,
          workspace_id,
          endpoint_id,
          processor_id,
          processor_run_id,
          message_id,
          input_object_id,
          retry_of_delivery_id,
          event_type,
          status,
          attempt_count,
          response_status,
          error_message,
          next_attempt_at,
          delivered_at,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      input.deliveryId,
      input.client.workspaceId,
      input.endpointId,
      input.processorId,
      input.processorRunId,
      input.messageId,
      input.inputObject.id,
      input.retryOfDeliveryId,
      "processor.invoke",
      "delivered",
      input.attemptCount,
      input.responseStatus,
      null,
      null,
      input.now,
      input.now,
    ),
    ...artifactStatements,
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.processor.invoked",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          artifactCount: input.artifacts.length,
          capabilityManifest: input.capabilityManifest,
          deliveryId: input.deliveryId,
          inputObjectId: input.inputObject.id,
          processorId: input.processorId,
          processorRunId: input.processorRunId,
        },
        subject: {
          id: input.messageId,
          kind: "carboti_message",
        },
      }),
    ),
  ]);
}

async function recordProcessorFailure(
  context: AppContext,
  input: {
    attemptCount: number;
    client: CarbotiApiClient;
    deliveryId: string;
    endpointId: string;
    errorMessage: string;
    inputObjectId: string;
    messageId: string;
    now: string;
    processorId: string;
    processorRunId: string;
    retryOfDeliveryId: string | null;
    responseStatus: number | null;
  },
): Promise<void> {
  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        INSERT INTO carboti_processor_runs (
          id,
          workspace_id,
          processor_id,
          pipeline_id,
          message_id,
          status,
          input_object_id,
          output_artifact_count,
          error_message,
          started_at,
          completed_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      input.processorRunId,
      input.client.workspaceId,
      input.processorId,
      null,
      input.messageId,
      "failed",
      input.inputObjectId,
      0,
      input.errorMessage.slice(0, 1000),
      input.now,
      input.now,
    ),
    context.env.DB.prepare(
      `
        INSERT INTO carboti_webhook_deliveries (
          id,
          workspace_id,
          endpoint_id,
          processor_id,
          processor_run_id,
          message_id,
          input_object_id,
          retry_of_delivery_id,
          event_type,
          status,
          attempt_count,
          response_status,
          error_message,
          next_attempt_at,
          delivered_at,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      input.deliveryId,
      input.client.workspaceId,
      input.endpointId,
      input.processorId,
      input.processorRunId,
      input.messageId,
      input.inputObjectId,
      input.retryOfDeliveryId,
      "processor.invoke",
      "failed",
      input.attemptCount,
      input.responseStatus,
      input.errorMessage.slice(0, 1000),
      null,
      null,
      input.now,
    ),
  ]);
}

async function readProcessorResponse(response: Response): Promise<
  | {
      ok: true;
      value: ExternalProcessorResponse;
    }
  | {
      message: string;
      ok: false;
    }
> {
  const text = await readResponseTextLimited(response, 64_000);
  if (!text) {
    return {
      message: "Processor response must not be empty.",
      ok: false,
    };
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return {
      message: "Processor response must be valid JSON.",
      ok: false,
    };
  }

  const parsed = v.safeParse(ExternalProcessorResponseSchema, body);
  if (!parsed.success) {
    return {
      message: parsed.issues[0]?.message ?? "Processor response is invalid.",
      ok: false,
    };
  }

  return {
    ok: true,
    value: parsed.output,
  };
}

function findOutputArtifactCapabilityViolation(
  response: ExternalProcessorResponse,
  capabilityManifest: CarbotiProcessorCapabilityManifest,
): string | null {
  const invalidArtifact = response.artifacts.find(
    (artifact) => !capabilityManifest.outputArtifactKinds.includes(artifact.kind),
  );
  if (!invalidArtifact) return null;

  return `Processor capability manifest does not allow output artifact kind "${invalidArtifact.kind}".`;
}

async function safeResponseText(response: Response): Promise<string> {
  const text = await readResponseTextLimited(response, 1000);
  return text || `HTTP ${response.status}`;
}

async function readResponseTextLimited(response: Response, limit: number): Promise<string> {
  if (!response.body) return "";

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  try {
    while (received < limit) {
      const result = await reader.read();
      if (result.done) break;

      const remaining = limit - received;
      const chunk = result.value.slice(0, remaining);
      chunks.push(chunk);
      received += chunk.byteLength;

      if (result.value.byteLength > remaining) {
        await reader.cancel();
        break;
      }
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(bytes);
}

async function hmacSha256Hex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    {
      hash: "SHA-256",
      name: "HMAC",
    },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(new Uint8Array(signature));
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function parseProcessorConfig(value: string | null): {
  capabilityManifest: CarbotiProcessorCapabilityManifest;
  signingSecretRef: string | null;
} {
  if (!value) {
    return {
      capabilityManifest: normalizeCarbotiProcessorCapabilityManifest(),
      signingSecretRef: null,
    };
  }
  try {
    const parsed: unknown = JSON.parse(value);
    const record = toUnknownRecord(parsed);
    if (!record) {
      return {
        capabilityManifest: normalizeCarbotiProcessorCapabilityManifest(),
        signingSecretRef: null,
      };
    }

    return {
      capabilityManifest: readCapabilityManifest(record.capabilityManifest),
      signingSecretRef:
        typeof record.signingSecretRef === "string" ? record.signingSecretRef : null,
    };
  } catch {
    return {
      capabilityManifest: normalizeCarbotiProcessorCapabilityManifest(),
      signingSecretRef: null,
    };
  }
}

function readCapabilityManifest(value: unknown): CarbotiProcessorCapabilityManifest {
  const parsed = v.safeParse(CarbotiProcessorCapabilityManifestSchema, value ?? {});
  if (!parsed.success) return normalizeCarbotiProcessorCapabilityManifest();
  return normalizeCarbotiProcessorCapabilityManifest(parsed.output);
}

function toUnknownRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function parseDataJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function artifactIdFor(messageId: string, processorRunId: string, index: number): string {
  return `artifact:${messageId}:processor:${processorRunId}:${index + 1}`;
}

function endpointIdFor(processorId: string): string {
  return `endpoint:${processorId}`;
}

function signingSecretRefFor(processorId: string): string {
  return `secret:${processorId}:signing-key`;
}
