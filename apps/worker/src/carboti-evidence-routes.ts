import { createAuditEvent } from "@carboti/audit";
import type { Hono } from "hono";
import { prepareAuditInsert } from "./audit-store";
import { requireCarbotiApiClient, type CarbotiApiClient } from "./carboti-api-auth";
import { authError, parseQueryLimit, parseRequestJson, type AppContext } from "./http-utils";
import * as v from "valibot";

const ArtifactDownloadUrlInputSchema = v.object({
  ttlSeconds: v.optional(v.number()),
});

type ArtifactDownloadUrlInput = v.InferOutput<typeof ArtifactDownloadUrlInputSchema>;

type CarbotiObjectRow = {
  content_hash: string | null;
  content_type: string | null;
  created_at: string;
  data_json: string | null;
  id: string;
  kind: string;
  message_id: string | null;
  object_key: string | null;
  size: number | null;
  source_id: string | null;
  workspace_id: string;
};

type CarbotiArtifactRow = {
  content_hash: string | null;
  content_type: string | null;
  created_at: string;
  data_json: string | null;
  id: string;
  kind: string;
  message_id: string | null;
  object_key: string | null;
  processor_run_id: string | null;
  schema_id: string | null;
  size: number | null;
  workspace_id: string;
};

type CarbotiLineageRow = {
  created_at: string;
  from_object_id: string;
  id: string;
  processor_run_id: string | null;
  relation: string;
  to_object_id: string;
  workspace_id: string;
};

type CarbotiProcessorRunRow = {
  completed_at: string | null;
  error_message: string | null;
  id: string;
  input_object_id: string | null;
  message_id: string | null;
  output_artifact_count: number;
  pipeline_id: string | null;
  processor_id: string;
  started_at: string;
  status: string;
  workspace_id: string;
};

type CarbotiWebhookDeliveryRow = {
  attempt_count: number;
  created_at: string;
  delivered_at: string | null;
  endpoint_id: string;
  error_message: string | null;
  event_type: string;
  id: string;
  input_object_id: string | null;
  message_id: string | null;
  next_attempt_at: string | null;
  processor_id: string | null;
  processor_run_id: string | null;
  response_status: number | null;
  retry_of_delivery_id: string | null;
  status: string;
  workspace_id: string | null;
};

type CarbotiAuditEventRow = {
  action: string;
  actor_id: string;
  actor_kind: string;
  id: string;
  metadata_json: string | null;
  occurred_at: string;
  subject_id: string;
  subject_kind: string;
};

type RawReplayObjectRow = CarbotiObjectRow & {
  object_key: string;
};

export function registerCarbotiEvidenceRoutes(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/carboti/objects/:objectId", async (context) => {
    const auth = await requireCarbotiApiClient(context, "objects:read");
    if (!auth.ok) return auth.response;

    const row = await readObject(context, auth.client, context.req.param("objectId"));
    if (!row) {
      return context.json(
        {
          error: {
            code: "object_not_found",
            message: "Object was not found.",
          },
        },
        404,
      );
    }

    return context.json({ object: presentObject(row) });
  });

  app.get("/api/carboti/artifacts/:artifactId", async (context) => {
    const auth = await requireCarbotiApiClient(context, "artifacts:read");
    if (!auth.ok) return auth.response;

    const row = await readArtifact(context, auth.client, context.req.param("artifactId"));
    if (!row) {
      return context.json(
        {
          error: {
            code: "artifact_not_found",
            message: "Artifact was not found.",
          },
        },
        404,
      );
    }

    return context.json({ artifact: presentArtifact(row) });
  });

  app.get("/api/carboti/artifacts/:artifactId/download", async (context) => {
    const auth = await requireCarbotiApiClient(context, "artifacts:read");
    if (!auth.ok) return auth.response;

    const row = await readArtifact(context, auth.client, context.req.param("artifactId"));
    if (!row) return authError(context, "artifact_not_found", "Artifact was not found.", 404);

    await writeArtifactDownloadAudit(context, {
      actorId: `api_client:${auth.client.id}`,
      actorKind: "system",
      artifactId: row.id,
      action: "carboti.artifact.downloaded",
    });
    return artifactDownloadResponse(row);
  });

  app.post("/api/carboti/artifacts/:artifactId/download-url", async (context) => {
    const auth = await requireCarbotiApiClient(context, "artifacts:read");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, ArtifactDownloadUrlInputSchema);
    if (!parsed.ok) return parsed.response;

    const row = await readArtifact(context, auth.client, context.req.param("artifactId"));
    if (!row) return authError(context, "artifact_not_found", "Artifact was not found.", 404);

    let result: Record<string, string>;
    try {
      result = await createArtifactDownloadUrl(context, auth.client, row, parsed.value);
    } catch {
      return authError(
        context,
        "artifact_download_signing_unavailable",
        "Artifact download signing is not configured.",
        409,
      );
    }

    await writeArtifactDownloadAudit(context, {
      actorId: `api_client:${auth.client.id}`,
      actorKind: "system",
      artifactId: row.id,
      action: "carboti.artifact.download_url.created",
    });
    return context.json(result, 201);
  });

  app.get("/api/carboti/artifact-downloads/:token", async (context) => {
    const result = await readSignedArtifactDownload(context, context.req.param("token"));
    if (!result.ok) {
      return authError(context, result.code, result.message, result.status);
    }

    await writeArtifactDownloadAudit(context, {
      actorId: "system:signed-artifact-download",
      actorKind: "system",
      artifactId: result.artifact.id,
      action: "carboti.artifact.signed_downloaded",
    });
    return artifactDownloadResponse(result.artifact);
  });

  app.get("/api/carboti/messages/:messageId/artifacts", async (context) => {
    const auth = await requireCarbotiApiClient(context, "artifacts:read");
    if (!auth.ok) return auth.response;

    const limit = parseQueryLimit(context.req.query("limit"), 50);
    const artifacts = await readMessageArtifacts(context, auth.client, {
      limit,
      messageId: context.req.param("messageId"),
    });

    return context.json({
      artifacts: artifacts.map(presentArtifact),
      messageId: context.req.param("messageId"),
    });
  });

  app.get("/api/carboti/messages/:messageId/trace", async (context) => {
    const auth = await requireCarbotiApiClient(context, "messages:read");
    if (!auth.ok) return auth.response;

    const messageId = context.req.param("messageId");
    const trace = await readMessageTrace(context, auth.client, messageId);
    return context.json({
      messageId,
      trace,
    });
  });

  app.get("/api/carboti/messages/:messageId/lineage", async (context) => {
    const auth = await requireCarbotiApiClient(context, "lineage:read");
    if (!auth.ok) return auth.response;

    const lineage = await readMessageLineage(context, auth.client, context.req.param("messageId"));

    return context.json({
      edges: lineage.map(presentLineage),
      messageId: context.req.param("messageId"),
    });
  });

  app.post("/api/carboti/messages/:messageId/replay", async (context) => {
    const auth = await requireCarbotiApiClient(context, "replay:write");
    if (!auth.ok) return auth.response;

    const result = await replayCarbotiMessage(context, auth.client, context.req.param("messageId"));
    return result;
  });
}

async function readObject(
  context: AppContext,
  client: CarbotiApiClient,
  objectId: string,
): Promise<CarbotiObjectRow | null> {
  return context.env.DB.prepare(
    `
      SELECT
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
      FROM carboti_objects
      WHERE id = ?
        AND workspace_id = ?
      LIMIT 1
    `,
  )
    .bind(objectId, client.workspaceId)
    .first<CarbotiObjectRow>();
}

async function readArtifact(
  context: AppContext,
  client: CarbotiApiClient,
  artifactId: string,
): Promise<CarbotiArtifactRow | null> {
  return context.env.DB.prepare(
    `
      SELECT
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
      FROM carboti_artifacts
      WHERE id = ?
        AND workspace_id = ?
      LIMIT 1
    `,
  )
    .bind(artifactId, client.workspaceId)
    .first<CarbotiArtifactRow>();
}

async function readMessageArtifacts(
  context: AppContext,
  client: CarbotiApiClient,
  input: {
    limit: number;
    messageId: string;
  },
): Promise<CarbotiArtifactRow[]> {
  const result = await context.env.DB.prepare(
    `
      SELECT
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
      FROM carboti_artifacts
      WHERE workspace_id = ?
        AND message_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `,
  )
    .bind(client.workspaceId, input.messageId, input.limit)
    .all<CarbotiArtifactRow>();

  return result.results;
}

async function readMessageLineage(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
): Promise<CarbotiLineageRow[]> {
  const result = await context.env.DB.prepare(
    `
      SELECT
        id,
        workspace_id,
        from_object_id,
        to_object_id,
        relation,
        processor_run_id,
        created_at
      FROM carboti_lineage_edges
      WHERE workspace_id = ?
        AND (
          from_object_id IN (
            SELECT id FROM carboti_objects WHERE workspace_id = ? AND message_id = ?
          )
          OR to_object_id IN (
            SELECT id FROM carboti_objects WHERE workspace_id = ? AND message_id = ?
          )
        )
      ORDER BY created_at ASC
    `,
  )
    .bind(client.workspaceId, client.workspaceId, messageId, client.workspaceId, messageId)
    .all<CarbotiLineageRow>();

  return result.results;
}

async function readMessageTrace(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
): Promise<Record<string, unknown>> {
  const [objects, artifacts, lineage, processorRuns, deliveries, audits] = await Promise.all([
    readMessageObjects(context, client, messageId),
    readMessageArtifacts(context, client, {
      limit: 100,
      messageId,
    }),
    readMessageLineage(context, client, messageId),
    readMessageProcessorRuns(context, client, messageId),
    readMessageDeliveries(context, client, messageId),
    readMessageAuditEvents(context, client, messageId),
  ]);

  return {
    artifacts: artifacts.map(presentArtifact),
    audits: audits.map(presentAuditEvent),
    deliveries: deliveries.map(presentDelivery),
    lineage: lineage.map(presentLineage),
    objects: objects.map(presentObject),
    processorRuns: processorRuns.map(presentProcessorRun),
    summary: {
      artifactCount: artifacts.length,
      auditCount: audits.length,
      deliveryCount: deliveries.length,
      objectCount: objects.length,
      processorRunCount: processorRuns.length,
    },
  };
}

async function readMessageObjects(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
): Promise<CarbotiObjectRow[]> {
  const result = await context.env.DB.prepare(
    `
      SELECT
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
      FROM carboti_objects
      WHERE workspace_id = ?
        AND message_id = ?
      ORDER BY created_at ASC
      LIMIT 100
    `,
  )
    .bind(client.workspaceId, messageId)
    .all<CarbotiObjectRow>();

  return result.results;
}

async function readMessageProcessorRuns(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
): Promise<CarbotiProcessorRunRow[]> {
  const result = await context.env.DB.prepare(
    `
      SELECT
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
      FROM carboti_processor_runs
      WHERE workspace_id = ?
        AND message_id = ?
      ORDER BY started_at ASC
      LIMIT 100
    `,
  )
    .bind(client.workspaceId, messageId)
    .all<CarbotiProcessorRunRow>();

  return result.results;
}

async function readMessageDeliveries(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
): Promise<CarbotiWebhookDeliveryRow[]> {
  const result = await context.env.DB.prepare(
    `
      SELECT
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
      FROM carboti_webhook_deliveries
      WHERE workspace_id = ?
        AND message_id = ?
      ORDER BY created_at ASC
      LIMIT 100
    `,
  )
    .bind(client.workspaceId, messageId)
    .all<CarbotiWebhookDeliveryRow>();

  return result.results;
}

async function readMessageAuditEvents(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
): Promise<CarbotiAuditEventRow[]> {
  const result = await context.env.DB.prepare(
    `
      SELECT
        id,
        action,
        actor_id,
        actor_kind,
        subject_id,
        subject_kind,
        metadata_json,
        occurred_at
      FROM audit_events
      WHERE subject_id = ?
        OR metadata_json LIKE ?
      ORDER BY occurred_at ASC
      LIMIT 100
    `,
  )
    .bind(messageId, `%${messageId}%`)
    .all<CarbotiAuditEventRow>();

  return result.results.filter((event) => {
    const metadata = parseRecord(event.metadata_json);
    return (
      event.subject_id === messageId ||
      metadata.messageId === messageId ||
      metadata.replayedMessageId === messageId
    );
  });
}

async function createArtifactDownloadUrl(
  context: AppContext,
  client: CarbotiApiClient,
  artifact: CarbotiArtifactRow,
  input: ArtifactDownloadUrlInput,
): Promise<Record<string, string>> {
  const ttlSeconds = boundedTtl(input.ttlSeconds, 900);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const token = await signArtifactDownload(context.env, {
    artifactId: artifact.id,
    expiresAt,
    workspaceId: client.workspaceId,
  });

  return {
    artifactId: artifact.id,
    expiresAt,
    token,
    url: `/api/carboti/artifact-downloads/${encodeURIComponent(token)}`,
  };
}

async function readSignedArtifactDownload(
  context: AppContext,
  token: string,
): Promise<
  | {
      artifact: CarbotiArtifactRow;
      ok: true;
    }
  | {
      code: "artifact_download_invalid" | "artifact_download_expired" | "artifact_not_found";
      message: string;
      ok: false;
      status: 401 | 404 | 410;
    }
> {
  const payload = await verifyArtifactDownload(context.env, token);
  if (!payload) {
    return {
      code: "artifact_download_invalid",
      message: "Artifact download token is invalid.",
      ok: false,
      status: 401,
    };
  }
  if (Date.parse(payload.expiresAt) <= Date.now()) {
    return {
      code: "artifact_download_expired",
      message: "Artifact download token expired.",
      ok: false,
      status: 410,
    };
  }

  const artifact = await context.env.DB.prepare(
    `
      SELECT
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
      FROM carboti_artifacts
      WHERE workspace_id = ?
        AND id = ?
      LIMIT 1
    `,
  )
    .bind(payload.workspaceId, payload.artifactId)
    .first<CarbotiArtifactRow>();
  if (!artifact) {
    return {
      code: "artifact_not_found",
      message: "Artifact was not found.",
      ok: false,
      status: 404,
    };
  }

  return {
    artifact,
    ok: true,
  };
}

async function signArtifactDownload(
  env: Env,
  payload: {
    artifactId: string;
    expiresAt: string;
    workspaceId: string;
  },
): Promise<string> {
  const encodedPayload = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await hmacSha256Hex(env, encodedPayload);
  return `${encodedPayload}.${signature}`;
}

async function verifyArtifactDownload(
  env: Env,
  token: string,
): Promise<{
  artifactId: string;
  expiresAt: string;
  workspaceId: string;
} | null> {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = await hmacSha256Hex(env, encodedPayload);
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const decoded = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encodedPayload)),
    ) as unknown;
    const record = toRecord(decoded);
    if (
      !record ||
      typeof record.artifactId !== "string" ||
      typeof record.expiresAt !== "string" ||
      typeof record.workspaceId !== "string"
    ) {
      return null;
    }
    return {
      artifactId: record.artifactId,
      expiresAt: record.expiresAt,
      workspaceId: record.workspaceId,
    };
  } catch {
    return null;
  }
}

async function hmacSha256Hex(env: Env, value: string): Promise<string> {
  const secret = env.CARBOTI_SECRET_ENCRYPTION_KEY;
  if (!secret || secret.length < 32) {
    throw new Error("CARBOTI_SECRET_ENCRYPTION_KEY must be at least 32 characters.");
  }

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

async function writeArtifactDownloadAudit(
  context: AppContext,
  input: {
    action: string;
    actorId: string;
    actorKind: "system";
    artifactId: string;
  },
): Promise<void> {
  await prepareAuditInsert(
    context.env,
    createAuditEvent({
      action: input.action,
      actor: {
        id: input.actorId,
        kind: input.actorKind,
      },
      metadata: {},
      subject: {
        id: input.artifactId,
        kind: "carboti_artifact",
      },
    }),
  ).run();
}

export async function replayCarbotiMessage(
  context: AppContext,
  client: CarbotiApiClient,
  messageId: string,
): Promise<Response> {
  const rawObject = await context.env.DB.prepare(
    `
      SELECT
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
      FROM carboti_objects
      WHERE workspace_id = ?
        AND message_id = ?
        AND kind IN ('raw_document', 'raw_email')
        AND object_key IS NOT NULL
      ORDER BY created_at ASC
      LIMIT 1
    `,
  )
    .bind(client.workspaceId, messageId)
    .first<RawReplayObjectRow>();

  if (!rawObject) {
    return context.json(
      {
        error: {
          code: "raw_object_not_found",
          message: "No replayable raw object was found for this message.",
        },
      },
      404,
    );
  }

  const storedObject = await context.env.SOURCE_FILES.get(rawObject.object_key);
  if (!storedObject) {
    return context.json(
      {
        error: {
          code: "raw_object_missing",
          message: "Raw object metadata exists, but the R2 object is missing.",
        },
      },
      409,
    );
  }

  const now = new Date().toISOString();
  const runId = crypto.randomUUID();
  const processorId = "processor:builtin:replay";
  const artifactId = `artifact:${messageId}:replay:${runId}`;
  const artifactData = {
    inputObject: presentObject(rawObject),
    objectAvailable: true,
    replayedAt: now,
    runId,
  };
  const artifactSize = new TextEncoder().encode(JSON.stringify(artifactData)).byteLength;

  await context.env.DB.batch([
    prepareReplayProcessorConfigUpsert(context.env, {
      now,
      processorId,
      workspaceId: client.workspaceId,
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
      runId,
      client.workspaceId,
      processorId,
      null,
      messageId,
      "succeeded",
      rawObject.id,
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
      client.workspaceId,
      "artifact",
      rawObject.source_id,
      messageId,
      null,
      "application/json",
      null,
      artifactSize,
      JSON.stringify({
        artifactKind: "processor_output",
        replayRunId: runId,
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
      client.workspaceId,
      "processor_output",
      messageId,
      runId,
      "carboti.replay.v0",
      null,
      "application/json",
      null,
      artifactSize,
      JSON.stringify(artifactData),
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
      client.workspaceId,
      rawObject.id,
      artifactId,
      "processed_into",
      runId,
      now,
    ),
  ]);

  return context.json(
    {
      artifactId,
      inputObjectId: rawObject.id,
      messageId,
      processorRunId: runId,
      status: "succeeded",
    },
    201,
  );
}

function prepareReplayProcessorConfigUpsert(
  env: Env,
  input: {
    now: string;
    processorId: string;
    workspaceId: string;
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
    input.workspaceId,
    "builtin",
    "Built-in replay verifier",
    null,
    30,
    "active",
    JSON.stringify({
      managedBy: "carboti",
    }),
    input.now,
    input.now,
  );
}

function presentObject(row: CarbotiObjectRow): Record<string, unknown> {
  return {
    contentHash: row.content_hash,
    contentType: row.content_type,
    createdAt: row.created_at,
    data: parseDataJson(row.data_json),
    id: row.id,
    kind: row.kind,
    messageId: row.message_id,
    objectKey: row.object_key,
    size: row.size,
    sourceId: row.source_id,
    workspaceId: row.workspace_id,
  };
}

function presentArtifact(row: CarbotiArtifactRow): Record<string, unknown> {
  return {
    contentHash: row.content_hash,
    contentType: row.content_type,
    createdAt: row.created_at,
    data: parseDataJson(row.data_json),
    id: row.id,
    kind: row.kind,
    messageId: row.message_id,
    objectKey: row.object_key,
    processorRunId: row.processor_run_id,
    schemaId: row.schema_id,
    size: row.size,
    workspaceId: row.workspace_id,
  };
}

function presentLineage(row: CarbotiLineageRow): Record<string, unknown> {
  return {
    createdAt: row.created_at,
    fromObjectId: row.from_object_id,
    id: row.id,
    processorRunId: row.processor_run_id,
    relation: row.relation,
    toObjectId: row.to_object_id,
    workspaceId: row.workspace_id,
  };
}

function presentProcessorRun(row: CarbotiProcessorRunRow): Record<string, unknown> {
  return {
    completedAt: row.completed_at,
    errorMessage: row.error_message,
    id: row.id,
    inputObjectId: row.input_object_id,
    messageId: row.message_id,
    outputArtifactCount: row.output_artifact_count,
    pipelineId: row.pipeline_id,
    processorId: row.processor_id,
    startedAt: row.started_at,
    status: row.status,
    workspaceId: row.workspace_id,
  };
}

function presentDelivery(row: CarbotiWebhookDeliveryRow): Record<string, unknown> {
  return {
    attemptCount: row.attempt_count,
    createdAt: row.created_at,
    deliveredAt: row.delivered_at,
    endpointId: row.endpoint_id,
    errorMessage: row.error_message,
    eventType: row.event_type,
    id: row.id,
    inputObjectId: row.input_object_id,
    messageId: row.message_id,
    nextAttemptAt: row.next_attempt_at,
    processorId: row.processor_id,
    processorRunId: row.processor_run_id,
    responseStatus: row.response_status,
    retryOfDeliveryId: row.retry_of_delivery_id,
    status: row.status,
    workspaceId: row.workspace_id,
  };
}

function presentAuditEvent(row: CarbotiAuditEventRow): Record<string, unknown> {
  return {
    action: row.action,
    actorId: row.actor_id,
    actorKind: row.actor_kind,
    id: row.id,
    metadata: parseRecord(row.metadata_json),
    occurredAt: row.occurred_at,
    subjectId: row.subject_id,
    subjectKind: row.subject_kind,
  };
}

function artifactDownloadResponse(row: CarbotiArtifactRow): Response {
  const body = artifactDownloadBody(row);
  const headers = new Headers({
    "content-disposition": `attachment; filename="${artifactFilename(row)}"`,
    "content-type": body.contentType,
  });
  return new Response(body.value, {
    headers,
    status: 200,
  });
}

function artifactDownloadBody(row: CarbotiArtifactRow): {
  contentType: string;
  value: string;
} {
  const data = parseDataJson(row.data_json);
  if (typeof data === "string") {
    return {
      contentType: row.content_type ?? "text/plain",
      value: data,
    };
  }
  if (isRecord(data) && typeof data.text === "string") {
    return {
      contentType: row.content_type ?? "text/plain",
      value: data.text,
    };
  }

  return {
    contentType: row.content_type ?? "application/json",
    value: JSON.stringify(data, null, 2),
  };
}

function artifactFilename(row: CarbotiArtifactRow): string {
  const extension = (row.content_type ?? "").startsWith("text/") ? "txt" : "json";
  return `${safeFilename(row.kind)}-${safeFilename(row.id)}.${extension}`;
}

function parseDataJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function parseRecord(value: string | null): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function boundedTtl(value: number | undefined, fallback: number): number {
  if (!Number.isInteger(value) || value === undefined || value < 1) return fallback;
  return Math.min(value, fallback);
}

function timingSafeEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  if (leftBytes.byteLength !== rightBytes.byteLength) return false;

  let difference = 0;
  for (let index = 0; index < leftBytes.byteLength; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decodeBase64Url(value: string): ArrayBuffer {
  const padded = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return buffer;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}
