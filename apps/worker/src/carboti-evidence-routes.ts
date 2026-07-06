import type { Hono } from "hono";
import { requireCarbotiApiClient, type CarbotiApiClient } from "./carboti-api-auth";
import { parseQueryLimit, type AppContext } from "./http-utils";

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

    const result = await replayMessage(context, auth.client, context.req.param("messageId"));
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

async function replayMessage(
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

function parseDataJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
