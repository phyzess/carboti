import { createAuditEvent } from "@carboti/audit";
import { CarbotiArtifactKindSchema } from "@carboti/core";
import type { Hono } from "hono";
import * as v from "valibot";
import { prepareAuditInsert } from "./audit-store";
import {
  apiClientActorId,
  requireCarbotiApiClient,
  type CarbotiApiClient,
} from "./carboti-api-auth";
import { authError, parseRequestJson, type AppContext } from "./http-utils";

const SubmitCarbotiArtifactInputSchema = v.object({
  contentType: v.optional(v.string()),
  data: v.unknown(),
  kind: CarbotiArtifactKindSchema,
  schemaId: v.optional(v.string()),
});

type SubmitCarbotiArtifactInput = v.InferOutput<typeof SubmitCarbotiArtifactInputSchema>;

type ProcessorInputObjectRow = {
  id: string;
  source_id: string | null;
};

export function registerCarbotiArtifactSubmitRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/carboti/messages/:messageId/artifacts", async (context) => {
    const auth = await requireCarbotiApiClient(context, "artifacts:write");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, SubmitCarbotiArtifactInputSchema);
    if (!parsed.ok) return parsed.response;

    return submitCarbotiArtifact(context, {
      client: auth.client,
      input: parsed.value,
      messageId: context.req.param("messageId"),
    });
  });
}

async function submitCarbotiArtifact(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    input: SubmitCarbotiArtifactInput;
    messageId: string;
  },
): Promise<Response> {
  const processorInput = await readProcessorInputObject(context, input.client, input.messageId);
  if (!processorInput) {
    return authError(context, "message_not_found", "Message was not found.", 404);
  }

  const now = new Date().toISOString();
  const processorId = processorIdFor(input.client);
  const processorRunId = crypto.randomUUID();
  const artifactId = `artifact:${input.messageId}:submitted:${processorRunId}`;
  const contentType = input.input.contentType ?? "application/json";
  const dataJson = JSON.stringify(input.input.data);
  const artifactSize = new TextEncoder().encode(dataJson).byteLength;

  await context.env.DB.batch([
    prepareApiClientProcessorConfigUpsert(context.env, {
      client: input.client,
      now,
      processorId,
    }),
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
      processorRunId,
      input.client.workspaceId,
      processorId,
      null,
      input.messageId,
      "succeeded",
      processorInput.id,
      1,
      null,
      now,
      now,
    ),
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
      processorInput.source_id,
      input.messageId,
      null,
      contentType,
      null,
      artifactSize,
      JSON.stringify({
        artifactKind: input.input.kind,
        submittedBy: input.client.id,
      }),
      now,
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
      input.input.kind,
      input.messageId,
      processorRunId,
      input.input.schemaId ?? null,
      null,
      contentType,
      null,
      artifactSize,
      dataJson,
      now,
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
      processorInput.id,
      artifactId,
      "processed_into",
      processorRunId,
      now,
    ),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.artifact.submitted",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          artifactId,
          artifactKind: input.input.kind,
          contentType,
          inputObjectId: processorInput.id,
          processorId,
          processorRunId,
          schemaId: input.input.schemaId ?? null,
        },
        subject: {
          id: input.messageId,
          kind: "carboti_message",
        },
      }),
    ),
  ]);

  return context.json(
    {
      artifactId,
      inputObjectId: processorInput.id,
      messageId: input.messageId,
      processorRunId,
      status: "succeeded",
    },
    201,
  );
}

async function readProcessorInputObject(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
): Promise<ProcessorInputObjectRow | null> {
  const normalized = await context.env.DB.prepare(
    `
      SELECT id, source_id
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
      SELECT id, source_id
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

function prepareApiClientProcessorConfigUpsert(
  env: Env,
  input: {
    client: CarbotiApiClient;
    now: string;
    processorId: string;
  },
): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT OR IGNORE INTO carboti_processor_configs (
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
    input.processorId,
    input.client.workspaceId,
    "external_webhook",
    `API client processor: ${input.client.name}`,
    null,
    30,
    "active",
    JSON.stringify({
      apiClientId: input.client.id,
      mode: "api_submission",
    }),
    input.now,
    input.now,
  );
}

function processorIdFor(client: CarbotiApiClient): string {
  return `processor:api-client:${client.id}`;
}
