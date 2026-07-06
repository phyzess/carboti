import { createAuditEvent } from "@carboti/audit";
import { CarbotiArtifactKindSchema } from "@carboti/core";
import type { Hono } from "hono";
import * as v from "valibot";
import { prepareAuditInsert, writeAudit } from "./audit-store";
import {
  apiClientActorId,
  carbotiApiClientHasScope,
  requireCarbotiApiClient,
  type CarbotiApiClient,
} from "./carboti-api-auth";
import { replayCarbotiMessage } from "./carboti-evidence-routes";
import { authError, parseRequestJson, type AppContext } from "./http-utils";

const AgentArtifactSearchInputSchema = v.object({
  kinds: v.optional(v.array(CarbotiArtifactKindSchema)),
  limit: v.optional(v.number()),
  messageId: v.optional(v.string()),
  query: v.optional(v.string()),
});

const AgentContextBundleInputSchema = v.object({
  artifactKinds: v.optional(v.array(CarbotiArtifactKindSchema)),
  limit: v.optional(v.number()),
});

const AgentArtifactAccessInputSchema = v.object({
  ttlSeconds: v.optional(v.number()),
});

type AgentArtifactSearchInput = v.InferOutput<typeof AgentArtifactSearchInputSchema>;
type AgentContextBundleInput = v.InferOutput<typeof AgentContextBundleInputSchema>;
type AgentArtifactAccessInput = v.InferOutput<typeof AgentArtifactAccessInputSchema>;

type AgentArtifactRow = {
  content_type: string | null;
  created_at: string;
  data_json: string | null;
  id: string;
  kind: string;
  message_id: string | null;
  processor_run_id: string | null;
  schema_id: string | null;
  size: number | null;
  workspace_id: string;
};

type McpRequest = {
  id?: number | string | null;
  jsonrpc?: string;
  method?: string;
  params?: unknown;
};

export function registerCarbotiAgentRoutes(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/carboti/agent/artifacts/search", async (context) => {
    const auth = await requireCarbotiApiClient(context, "agent:read");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, AgentArtifactSearchInputSchema);
    if (!parsed.ok) return parsed.response;

    const result = await searchAgentArtifacts(context, auth.client, parsed.value);
    await auditAgentRead(context, auth.client, "carboti.agent.artifacts.searched", {
      count: result.artifacts.length,
      messageId: parsed.value.messageId ?? null,
      query: parsed.value.query ?? null,
    });
    return context.json(result);
  });

  app.get("/api/carboti/agent/artifacts/:artifactId/inspect", async (context) => {
    const auth = await requireCarbotiApiClient(context, "agent:read");
    if (!auth.ok) return auth.response;

    const result = await inspectAgentArtifact(
      context,
      auth.client,
      context.req.param("artifactId"),
    );
    if (!result) {
      return authError(context, "artifact_not_found", "Artifact was not found.", 404);
    }

    await auditAgentRead(context, auth.client, "carboti.agent.artifact.inspected", {
      artifactId: context.req.param("artifactId"),
    });
    return context.json({ artifact: result });
  });

  app.post("/api/carboti/agent/artifacts/:artifactId/access", async (context) => {
    const auth = await requireCarbotiApiClient(context, "agent:read");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, AgentArtifactAccessInputSchema);
    if (!parsed.ok) return parsed.response;

    let result: Record<string, string> | null;
    try {
      result = await createAgentArtifactAccess(context, auth.client, {
        ...parsed.value,
        artifactId: context.req.param("artifactId"),
      });
    } catch {
      return authError(
        context,
        "artifact_access_signing_unavailable",
        "Artifact access signing is not configured.",
        409,
      );
    }
    if (!result) return authError(context, "artifact_not_found", "Artifact was not found.", 404);
    await auditAgentRead(context, auth.client, "carboti.agent.artifact_access.created", {
      artifactId: context.req.param("artifactId"),
      expiresAt: result.expiresAt,
    });
    return context.json(result, 201);
  });

  app.get("/api/carboti/agent/artifact-access/:token", async (context) => {
    const result = await readSignedAgentArtifact(context, context.req.param("token"));
    if (!result.ok) {
      return authError(context, result.code, result.message, result.status);
    }
    return context.json({
      artifact: result.artifact,
    });
  });

  app.post("/api/carboti/agent/messages/:messageId/context", async (context) => {
    const auth = await requireCarbotiApiClient(context, "agent:read");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, AgentContextBundleInputSchema);
    if (!parsed.ok) return parsed.response;

    const result = await createAgentContextBundle(context, auth.client, {
      ...parsed.value,
      messageId: context.req.param("messageId"),
    });
    if (!result) {
      return authError(
        context,
        "message_artifacts_not_found",
        "No eligible artifacts were found.",
        404,
      );
    }

    return context.json(result, 201);
  });

  app.post("/api/carboti/agent/messages/:messageId/replay", async (context) => {
    const auth = await requireCarbotiApiClient(context, "replay:write");
    if (!auth.ok) return auth.response;
    return replayCarbotiMessage(context, auth.client, context.req.param("messageId"));
  });

  app.post("/api/carboti/mcp", async (context) => {
    const auth = await requireCarbotiApiClient(context, "agent:read");
    if (!auth.ok) return auth.response;
    return handleMcpRequest(context, auth.client);
  });
}

async function createAgentArtifactAccess(
  context: AppContext,
  client: CarbotiApiClient,
  input: AgentArtifactAccessInput & {
    artifactId: string;
  },
): Promise<Record<string, string> | null> {
  const artifact = await readArtifactById(context, client.workspaceId, input.artifactId);
  if (!artifact) return null;

  const ttlSeconds = boundedLimit(input.ttlSeconds, 900);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const token = await signAgentArtifactAccess(context.env, {
    artifactId: artifact.id,
    expiresAt,
    workspaceId: client.workspaceId,
  });

  return {
    artifactId: artifact.id,
    expiresAt,
    token,
    url: `/api/carboti/agent/artifact-access/${encodeURIComponent(token)}`,
  };
}

async function readSignedAgentArtifact(
  context: AppContext,
  token: string,
): Promise<
  | {
      artifact: Record<string, unknown>;
      ok: true;
    }
  | {
      code: "artifact_access_invalid" | "artifact_access_expired" | "artifact_not_found";
      message: string;
      ok: false;
      status: 401 | 404 | 410;
    }
> {
  const payload = await verifyAgentArtifactAccess(context.env, token);
  if (!payload) {
    return {
      code: "artifact_access_invalid",
      message: "Artifact access token is invalid.",
      ok: false,
      status: 401,
    };
  }

  if (Date.parse(payload.expiresAt) <= Date.now()) {
    return {
      code: "artifact_access_expired",
      message: "Artifact access token expired.",
      ok: false,
      status: 410,
    };
  }

  const artifact = await readArtifactById(context, payload.workspaceId, payload.artifactId);
  if (!artifact) {
    return {
      code: "artifact_not_found",
      message: "Artifact was not found.",
      ok: false,
      status: 404,
    };
  }

  return {
    artifact: {
      ...presentArtifactSummary(artifact),
      data: parseDataJson(artifact.data_json),
    },
    ok: true,
  };
}

async function searchAgentArtifacts(
  context: AppContext,
  client: CarbotiApiClient,
  input: AgentArtifactSearchInput,
): Promise<{
  artifacts: Array<Record<string, unknown>>;
}> {
  const limit = boundedLimit(input.limit, 20);
  const query = input.query?.trim();
  const kinds = input.kinds ?? [];
  const result = await context.env.DB.prepare(
    `
      SELECT
        id,
        workspace_id,
        kind,
        message_id,
        processor_run_id,
        schema_id,
        content_type,
        size,
        data_json,
        created_at
      FROM carboti_artifacts
      WHERE workspace_id = ?
        AND (? IS NULL OR message_id = ?)
        AND (? IS NULL OR id LIKE ? OR kind LIKE ? OR schema_id LIKE ?)
      ORDER BY created_at DESC
      LIMIT ?
    `,
  )
    .bind(
      client.workspaceId,
      input.messageId ?? null,
      input.messageId ?? null,
      query ?? null,
      likeQuery(query),
      likeQuery(query),
      likeQuery(query),
      limit,
    )
    .all<AgentArtifactRow>();

  return {
    artifacts: result.results
      .filter((artifact) => kinds.length === 0 || kinds.includes(parseArtifactKind(artifact.kind)))
      .map(presentArtifactSummary),
  };
}

async function readArtifactById(
  context: AppContext,
  workspaceId: string,
  artifactId: string,
): Promise<AgentArtifactRow | null> {
  return context.env.DB.prepare(
    `
      SELECT
        id,
        workspace_id,
        kind,
        message_id,
        processor_run_id,
        schema_id,
        content_type,
        size,
        data_json,
        created_at
      FROM carboti_artifacts
      WHERE workspace_id = ?
        AND id = ?
      LIMIT 1
    `,
  )
    .bind(workspaceId, artifactId)
    .first<AgentArtifactRow>();
}

async function inspectAgentArtifact(
  context: AppContext,
  client: CarbotiApiClient,
  artifactId: string,
): Promise<Record<string, unknown> | null> {
  const artifact = await readArtifactById(context, client.workspaceId, artifactId);
  if (!artifact) return null;
  return {
    ...presentArtifactSummary(artifact),
    dataPreview: previewJson(parseDataJson(artifact.data_json), 4000),
  };
}

async function signAgentArtifactAccess(
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

async function verifyAgentArtifactAccess(
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
  if (!(await timingSafeEqual(signature, expected))) return null;

  try {
    const body = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload))) as unknown;
    const record = toRecord(body);
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

async function createAgentContextBundle(
  context: AppContext,
  client: CarbotiApiClient,
  input: AgentContextBundleInput & {
    messageId: string;
  },
): Promise<Record<string, unknown> | null> {
  const limit = boundedLimit(input.limit, 10);
  const kinds = input.artifactKinds ?? ["normalized_json", "message_text", "processor_output"];
  const selected = await readContextArtifacts(context, client, {
    kinds,
    limit,
    messageId: input.messageId,
  });
  if (selected.length === 0) return null;

  const now = new Date().toISOString();
  const processorRunId = crypto.randomUUID();
  const artifactId = `artifact:${input.messageId}:agent-context:${processorRunId}`;
  const processorId = "processor:builtin:agent-context-bundle";
  const bundleData = {
    createdAt: now,
    items: selected.map((artifact) => ({
      artifact: presentArtifactSummary(artifact),
      dataPreview: previewJson(parseDataJson(artifact.data_json), 8000),
    })),
    messageId: input.messageId,
    policy: {
      rawObjectsIncluded: false,
      source: "agent_safe_artifacts_only",
    },
  };
  const dataJson = JSON.stringify(bundleData);
  const size = new TextEncoder().encode(dataJson).byteLength;

  await context.env.DB.batch([
    prepareAgentProcessorConfigUpsert(context.env, {
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
      processorRunId,
      client.workspaceId,
      processorId,
      null,
      input.messageId,
      "succeeded",
      selected[0]?.id ?? null,
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
      null,
      input.messageId,
      null,
      "application/json",
      null,
      size,
      JSON.stringify({
        artifactKind: "agent_context_bundle",
        processorId,
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
      "agent_context_bundle",
      input.messageId,
      processorRunId,
      "carboti.agent_context_bundle.v0",
      null,
      "application/json",
      null,
      size,
      dataJson,
      now,
    ),
    ...selected.map((artifact) =>
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
        artifact.id,
        artifactId,
        "processed_into",
        processorRunId,
        now,
      ),
    ),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.agent.context_bundle.created",
        actor: {
          id: apiClientActorId(client),
          kind: "system",
        },
        metadata: {
          artifactCount: selected.length,
          artifactId,
          rawObjectsIncluded: false,
        },
        subject: {
          id: input.messageId,
          kind: "carboti_message",
        },
      }),
    ),
  ]);

  return {
    artifactId,
    itemCount: selected.length,
    kind: "agent_context_bundle",
    messageId: input.messageId,
    processorRunId,
    status: "succeeded",
  };
}

async function readContextArtifacts(
  context: AppContext,
  client: CarbotiApiClient,
  input: {
    kinds: string[];
    limit: number;
    messageId: string;
  },
): Promise<AgentArtifactRow[]> {
  const result = await context.env.DB.prepare(
    `
      SELECT
        id,
        workspace_id,
        kind,
        message_id,
        processor_run_id,
        schema_id,
        content_type,
        size,
        data_json,
        created_at
      FROM carboti_artifacts
      WHERE workspace_id = ?
        AND message_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `,
  )
    .bind(client.workspaceId, input.messageId)
    .all<AgentArtifactRow>();

  return result.results
    .filter((artifact) => input.kinds.includes(artifact.kind))
    .slice(0, input.limit);
}

async function handleMcpRequest(context: AppContext, client: CarbotiApiClient): Promise<Response> {
  const request = await readMcpRequest(context);
  if (!request.ok) return request.response;

  const id = request.value.id ?? null;
  try {
    if (request.value.method === "initialize") {
      return context.json({
        id,
        jsonrpc: "2.0",
        result: {
          capabilities: {
            tools: {},
          },
          protocolVersion: "2025-06-18",
          serverInfo: {
            name: "carboti",
            version: "0.1.0",
          },
        },
      });
    }

    if (request.value.method === "tools/list") {
      return context.json({
        id,
        jsonrpc: "2.0",
        result: {
          tools: mcpTools(),
        },
      });
    }

    if (request.value.method === "tools/call") {
      const params = toRecord(request.value.params);
      const name = typeof params?.name === "string" ? params.name : "";
      const args = toRecord(params?.arguments) ?? {};
      const result = await callMcpTool(context, client, name, args);
      return context.json({
        id,
        jsonrpc: "2.0",
        result: {
          content: [
            {
              text: JSON.stringify(result, null, 2),
              type: "text",
            },
          ],
        },
      });
    }

    return mcpError(context, id, -32601, "Method not found.");
  } catch (error) {
    return mcpError(context, id, -32000, error instanceof Error ? error.message : String(error));
  }
}

async function callMcpTool(
  context: AppContext,
  client: CarbotiApiClient,
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  if (name === "carboti.search_artifacts") {
    return searchAgentArtifacts(context, client, {
      kinds: Array.isArray(args.kinds) ? args.kinds.flatMap(parseArtifactKindMaybe) : undefined,
      limit: typeof args.limit === "number" ? args.limit : undefined,
      messageId: typeof args.messageId === "string" ? args.messageId : undefined,
      query: typeof args.query === "string" ? args.query : undefined,
    });
  }

  if (name === "carboti.inspect_artifact") {
    const artifactId = stringArg(args, "artifactId");
    const artifact = await inspectAgentArtifact(context, client, artifactId);
    if (!artifact) throw new Error("Artifact was not found.");
    return { artifact };
  }

  if (name === "carboti.retrieve_context") {
    const messageId = stringArg(args, "messageId");
    const result = await createAgentContextBundle(context, client, {
      artifactKinds: Array.isArray(args.artifactKinds)
        ? args.artifactKinds.flatMap(parseArtifactKindMaybe)
        : undefined,
      limit: typeof args.limit === "number" ? args.limit : undefined,
      messageId,
    });
    if (!result) throw new Error("No eligible artifacts were found.");
    return result;
  }

  if (name === "carboti.replay_message") {
    if (!carbotiApiClientHasScope(client, "replay:write")) {
      throw new Error("API token scope is insufficient for replay.");
    }
    const response = await replayCarbotiMessage(context, client, stringArg(args, "messageId"));
    return response.json();
  }

  throw new Error(`Unknown tool: ${name}`);
}

async function readMcpRequest(context: AppContext): Promise<
  | {
      ok: true;
      value: McpRequest;
    }
  | {
      ok: false;
      response: Response;
    }
> {
  try {
    const body = (await context.req.json()) as unknown;
    const record = toRecord(body);
    if (!record) {
      return {
        ok: false,
        response: mcpError(context, null, -32600, "Invalid Request."),
      };
    }
    return {
      ok: true,
      value: record,
    };
  } catch {
    return {
      ok: false,
      response: mcpError(context, null, -32700, "Parse error."),
    };
  }
}

function mcpTools(): Array<Record<string, unknown>> {
  return [
    {
      description:
        "Search agent-safe Carboti artifact metadata without returning raw object bytes.",
      inputSchema: {
        properties: {
          kinds: {
            items: {
              type: "string",
            },
            type: "array",
          },
          limit: {
            maximum: 20,
            minimum: 1,
            type: "number",
          },
          messageId: {
            type: "string",
          },
          query: {
            type: "string",
          },
        },
        type: "object",
      },
      name: "carboti.search_artifacts",
    },
    {
      description: "Inspect one allowed artifact with a bounded JSON preview.",
      inputSchema: {
        properties: {
          artifactId: {
            type: "string",
          },
        },
        required: ["artifactId"],
        type: "object",
      },
      name: "carboti.inspect_artifact",
    },
    {
      description: "Create an agent_context_bundle artifact from eligible message artifacts.",
      inputSchema: {
        properties: {
          artifactKinds: {
            items: {
              type: "string",
            },
            type: "array",
          },
          limit: {
            maximum: 10,
            minimum: 1,
            type: "number",
          },
          messageId: {
            type: "string",
          },
        },
        required: ["messageId"],
        type: "object",
      },
      name: "carboti.retrieve_context",
    },
    {
      description: "Replay processing from preserved raw input when the token has replay:write.",
      inputSchema: {
        properties: {
          messageId: {
            type: "string",
          },
        },
        required: ["messageId"],
        type: "object",
      },
      name: "carboti.replay_message",
    },
  ];
}

function mcpError(
  context: AppContext,
  id: number | string | null,
  code: number,
  message: string,
): Response {
  return context.json({
    error: {
      code,
      message,
    },
    id,
    jsonrpc: "2.0",
  });
}

async function auditAgentRead(
  context: AppContext,
  client: CarbotiApiClient,
  action: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  await writeAudit(
    context.env,
    createAuditEvent({
      action,
      actor: {
        id: apiClientActorId(client),
        kind: "system",
      },
      metadata,
      subject: {
        id: client.workspaceId,
        kind: "carboti_workspace",
      },
    }),
  );
}

function prepareAgentProcessorConfigUpsert(
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
    "Built-in agent context bundle",
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

function presentArtifactSummary(row: AgentArtifactRow): Record<string, unknown> {
  return {
    contentType: row.content_type,
    createdAt: row.created_at,
    id: row.id,
    kind: row.kind,
    messageId: row.message_id,
    processorRunId: row.processor_run_id,
    schemaId: row.schema_id,
    size: row.size,
  };
}

function previewJson(value: unknown, limit: number): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.length <= limit ? text : `${text.slice(0, limit)}...`;
}

function parseDataJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
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

async function timingSafeEqual(left: string, right: string): Promise<boolean> {
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

function boundedLimit(value: number | undefined, fallback: number): number {
  if (!Number.isInteger(value) || value === undefined || value < 1) return fallback;
  return Math.min(value, fallback);
}

function likeQuery(value: string | undefined): string | null {
  if (!value) return null;
  return `%${value.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
}

function parseArtifactKind(value: string): v.InferOutput<typeof CarbotiArtifactKindSchema> {
  const parsed = v.safeParse(CarbotiArtifactKindSchema, value);
  return parsed.success ? parsed.output : "processor_output";
}

function parseArtifactKindMaybe(
  value: unknown,
): Array<v.InferOutput<typeof CarbotiArtifactKindSchema>> {
  const parsed = v.safeParse(CarbotiArtifactKindSchema, value);
  return parsed.success ? [parsed.output] : [];
}

function stringArg(args: Record<string, unknown>, key: string): string {
  const value = args[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${key} is required.`);
  }
  return value;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}
