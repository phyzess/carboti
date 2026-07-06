import { createAuditEvent } from "@carboti/audit";
import {
  CarbotiSinkKindSchema,
  CarbotiSourceKindSchema,
  carbotiConnectorManifests,
  carbotiConnectorRawObjectKey,
  getCarbotiConnectorManifest,
  type CarbotiConnectorManifest,
  type CarbotiMessageEnvelope,
  type CarbotiObjectKind,
  type CarbotiObjectRef,
  type CarbotiSourceKind,
} from "@carboti/core";
import { hashSourceContent } from "@carboti/files";
import type { Hono } from "hono";
import * as v from "valibot";
import { prepareAuditInsert } from "./audit-store";
import {
  apiClientActorId,
  requireCarbotiApiClient,
  type CarbotiApiClient,
} from "./carboti-api-auth";
import { authError, parseRequestJson, type AppContext } from "./http-utils";

const maxConnectorIngestBytes = 1_000_000;
const textArtifactByteLimit = 64_000;

const ConnectorConfigSchema = v.record(v.string(), v.unknown());

const RegisterConnectorSourceInputSchema = v.object({
  config: v.optional(ConnectorConfigSchema),
  kind: CarbotiSourceKindSchema,
  name: v.string(),
  secretRefs: v.optional(v.record(v.string(), v.string())),
  status: v.optional(v.picklist(["active", "disabled"])),
});

const RegisterConnectorSinkInputSchema = v.object({
  config: v.optional(ConnectorConfigSchema),
  kind: CarbotiSinkKindSchema,
  name: v.string(),
  secretRefs: v.optional(v.record(v.string(), v.string())),
  status: v.optional(v.picklist(["active", "disabled"])),
});

const ConnectorIngestInputSchema = v.object({
  contentBase64: v.optional(v.string()),
  contentText: v.optional(v.string()),
  contentType: v.string(),
  connectorMessageId: v.optional(v.string()),
  filename: v.string(),
  metadata: v.optional(ConnectorConfigSchema),
});

type RegisterConnectorSourceInput = v.InferOutput<typeof RegisterConnectorSourceInputSchema>;
type RegisterConnectorSinkInput = v.InferOutput<typeof RegisterConnectorSinkInputSchema>;
type ConnectorIngestInput = v.InferOutput<typeof ConnectorIngestInputSchema>;

type SourceRow = {
  config_json: string | null;
  created_at: string;
  id: string;
  kind: string;
  name: string;
  status: string;
  updated_at: string;
  workspace_id: string;
};

type SecretRefRow = {
  id: string;
  kind: string;
  status: string | null;
};

type HealthCheckRow = {
  checked_at: string;
  connector_kind: string;
  details_json: string | null;
  id: string;
  source_id: string;
  status: string;
};

export function registerCarbotiConnectorRoutes(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/carboti/connectors/manifests", async (context) => {
    const auth = await requireCarbotiApiClient(context, "connectors:read");
    if (!auth.ok) return auth.response;

    return context.json({
      manifests: carbotiConnectorManifests,
    });
  });

  app.post("/api/carboti/connectors/sources", async (context) => {
    const auth = await requireCarbotiApiClient(context, "connectors:write");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, RegisterConnectorSourceInputSchema);
    if (!parsed.ok) return parsed.response;

    return registerConnectorSource(context, {
      client: auth.client,
      input: parsed.value,
    });
  });

  app.post("/api/carboti/connectors/sinks", async (context) => {
    const auth = await requireCarbotiApiClient(context, "connectors:write");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, RegisterConnectorSinkInputSchema);
    if (!parsed.ok) return parsed.response;

    return registerConnectorSink(context, {
      client: auth.client,
      input: parsed.value,
    });
  });

  app.get("/api/carboti/connectors/sources/:sourceId/health", async (context) => {
    const auth = await requireCarbotiApiClient(context, "connectors:read");
    if (!auth.ok) return auth.response;

    return getConnectorSourceHealth(context, {
      client: auth.client,
      sourceId: context.req.param("sourceId"),
    });
  });

  app.post("/api/carboti/connectors/sources/:sourceId/health", async (context) => {
    const auth = await requireCarbotiApiClient(context, "connectors:write");
    if (!auth.ok) return auth.response;

    return runConnectorSourceHealth(context, {
      client: auth.client,
      sourceId: context.req.param("sourceId"),
    });
  });

  app.post("/api/carboti/connectors/sources/:sourceId/ingest", async (context) => {
    const auth = await requireCarbotiApiClient(context, "ingest:write");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, ConnectorIngestInputSchema);
    if (!parsed.ok) return parsed.response;

    return ingestConnectorObject(context, {
      client: auth.client,
      input: parsed.value,
      sourceId: context.req.param("sourceId"),
    });
  });
}

async function registerConnectorSource(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    input: RegisterConnectorSourceInput;
  },
): Promise<Response> {
  const manifest = getCarbotiConnectorManifest(input.input.kind);
  if (!manifest || manifest.direction === "sink") {
    return authError(
      context,
      "connector_manifest_not_found",
      "Connector source is not supported.",
      404,
    );
  }

  const config = input.input.config ?? {};
  const invalidConfig = validateConnectorConfig(config, manifest);
  if (invalidConfig) {
    return authError(context, invalidConfig.code, invalidConfig.message, 400);
  }
  const secretRefs = input.input.secretRefs ?? {};
  const secretValidation = await validateConnectorSecretRefs(context, input.client, secretRefs);
  if (!secretValidation.ok) {
    return authError(context, secretValidation.code, secretValidation.message, 400);
  }

  const now = new Date().toISOString();
  const sourceId = `source:${input.input.kind}:${crypto.randomUUID()}`;
  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        INSERT INTO carboti_sources (
          id,
          workspace_id,
          kind,
          name,
          status,
          config_json,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      sourceId,
      input.client.workspaceId,
      input.input.kind,
      input.input.name,
      input.input.status ?? "active",
      JSON.stringify({
        config,
        connectorManifestVersion: "2026-07-06",
        secretRefs,
      }),
      now,
      now,
    ),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.connector.source.created",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          connectorKind: input.input.kind,
          manifest,
          secretRefKeys: Object.keys(secretRefs),
          status: input.input.status ?? "active",
        },
        subject: {
          id: sourceId,
          kind: "carboti_source",
        },
      }),
    ),
  ]);

  return context.json(
    {
      manifest,
      source: {
        id: sourceId,
        kind: input.input.kind,
        name: input.input.name,
        status: input.input.status ?? "active",
      },
    },
    201,
  );
}

async function registerConnectorSink(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    input: RegisterConnectorSinkInput;
  },
): Promise<Response> {
  const manifest = getCarbotiConnectorManifest(input.input.kind);
  if (!manifest || manifest.direction === "source") {
    return authError(
      context,
      "connector_manifest_not_found",
      "Connector sink is not supported.",
      404,
    );
  }

  const config = input.input.config ?? {};
  const invalidConfig = validateConnectorConfig(config, manifest);
  if (invalidConfig) {
    return authError(context, invalidConfig.code, invalidConfig.message, 400);
  }
  const secretRefs = input.input.secretRefs ?? {};
  const secretValidation = await validateConnectorSecretRefs(context, input.client, secretRefs);
  if (!secretValidation.ok) {
    return authError(context, secretValidation.code, secretValidation.message, 400);
  }

  const now = new Date().toISOString();
  const sinkId = `sink:${input.input.kind}:${crypto.randomUUID()}`;
  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        INSERT INTO carboti_sinks (
          id,
          workspace_id,
          kind,
          name,
          status,
          config_json,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      sinkId,
      input.client.workspaceId,
      input.input.kind,
      input.input.name,
      input.input.status ?? "active",
      JSON.stringify({
        config,
        connectorManifestVersion: "2026-07-06",
        secretRefs,
      }),
      now,
      now,
    ),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.connector.sink.created",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          connectorKind: input.input.kind,
          manifest,
          secretRefKeys: Object.keys(secretRefs),
          status: input.input.status ?? "active",
        },
        subject: {
          id: sinkId,
          kind: "carboti_sink",
        },
      }),
    ),
  ]);

  return context.json(
    {
      manifest,
      sink: {
        id: sinkId,
        kind: input.input.kind,
        name: input.input.name,
        status: input.input.status ?? "active",
      },
    },
    201,
  );
}

async function getConnectorSourceHealth(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    sourceId: string;
  },
): Promise<Response> {
  const source = await readConnectorSource(context, input.client, input.sourceId);
  if (!source) {
    return authError(context, "connector_source_not_found", "Connector source was not found.", 404);
  }

  const latest = await context.env.DB.prepare(
    `
      SELECT id, source_id, connector_kind, status, checked_at, details_json
      FROM carboti_connector_health_checks
      WHERE source_id = ?
        AND workspace_id = ?
      ORDER BY checked_at DESC
      LIMIT 1
    `,
  )
    .bind(source.id, input.client.workspaceId)
    .first<HealthCheckRow>();

  return context.json({
    health: latest
      ? {
          checkedAt: latest.checked_at,
          connectorKind: latest.connector_kind,
          details: parseJsonRecord(latest.details_json),
          id: latest.id,
          sourceId: latest.source_id,
          status: latest.status,
        }
      : {
          checkedAt: null,
          connectorKind: source.kind,
          details: null,
          id: null,
          sourceId: source.id,
          status: "unknown",
        },
    manifest: getCarbotiConnectorManifest(source.kind as CarbotiSourceKind),
    source: presentSource(source),
  });
}

async function runConnectorSourceHealth(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    sourceId: string;
  },
): Promise<Response> {
  const source = await readConnectorSource(context, input.client, input.sourceId);
  if (!source) {
    return authError(context, "connector_source_not_found", "Connector source was not found.", 404);
  }

  const parsedKind = v.safeParse(CarbotiSourceKindSchema, source.kind);
  if (!parsedKind.success) {
    return authError(
      context,
      "connector_manifest_not_found",
      "Connector source is not supported.",
      404,
    );
  }

  const manifest = getCarbotiConnectorManifest(parsedKind.output);
  if (!manifest || manifest.direction === "sink") {
    return authError(
      context,
      "connector_manifest_not_found",
      "Connector source is not supported.",
      404,
    );
  }

  const config = parseConnectorConfig(source.config_json);
  const secretRefs = parseConnectorSecretRefs(source.config_json);
  const missingConfigFields = missingRequiredConfigFields(config, manifest);
  const status =
    source.status !== "active"
      ? "disabled"
      : missingConfigFields.length > 0
        ? "degraded"
        : "healthy";
  const now = new Date().toISOString();
  const healthId = `connector-health:${crypto.randomUUID()}`;
  const details = {
    checks: [
      {
        name: "manifest_registered",
        ok: true,
      },
      {
        missingConfigFields,
        name: "required_config",
        ok: missingConfigFields.length === 0,
      },
      {
        name: "secret_refs",
        ok: Object.keys(secretRefs).length > 0 || manifest.authModes.includes("none"),
        secretRefKeys: Object.keys(secretRefs),
      },
      {
        mode: manifest.healthCheck.mode,
        name: "remote_probe",
        ok: manifest.healthCheck.mode !== "remote",
        skipped: manifest.healthCheck.mode === "remote",
      },
    ],
    connectorKind: manifest.kind,
    healthCheckMode: manifest.healthCheck.mode,
  };

  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        INSERT INTO carboti_connector_health_checks (
          id,
          workspace_id,
          source_id,
          connector_kind,
          status,
          checked_at,
          details_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      healthId,
      input.client.workspaceId,
      source.id,
      source.kind,
      status,
      now,
      JSON.stringify(details),
    ),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.connector.health.checked",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          connectorKind: source.kind,
          details,
          status,
        },
        subject: {
          id: source.id,
          kind: "carboti_source",
        },
      }),
    ),
  ]);

  return context.json(
    {
      health: {
        checkedAt: now,
        connectorKind: source.kind,
        details,
        id: healthId,
        sourceId: source.id,
        status,
      },
      manifest,
      source: presentSource(source),
    },
    201,
  );
}

async function ingestConnectorObject(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    input: ConnectorIngestInput;
    sourceId: string;
  },
): Promise<Response> {
  const source = await readConnectorSource(context, input.client, input.sourceId);
  if (!source) {
    return authError(context, "connector_source_not_found", "Connector source was not found.", 404);
  }
  if (source.status !== "active") {
    return authError(context, "connector_source_disabled", "Connector source is disabled.", 409);
  }

  const parsedKind = v.safeParse(CarbotiSourceKindSchema, source.kind);
  if (!parsedKind.success) {
    return authError(
      context,
      "connector_manifest_not_found",
      "Connector source is not supported.",
      404,
    );
  }

  const manifest = getCarbotiConnectorManifest(parsedKind.output);
  if (!manifest || manifest.direction === "sink") {
    return authError(
      context,
      "connector_manifest_not_found",
      "Connector source is not supported.",
      404,
    );
  }

  const content = connectorContentBytes(input.input);
  if (!content.ok) {
    return authError(context, content.code, content.message, 400);
  }
  if (content.value.byteLength === 0) {
    return authError(context, "empty_body", "Connector content must not be empty.", 400);
  }
  if (content.value.byteLength > maxConnectorIngestBytes) {
    return authError(context, "connector_object_too_large", "Connector content is too large.", 400);
  }

  const receivedAt = new Date().toISOString();
  const messageId = crypto.randomUUID();
  const contentHash = await hashSourceContent(content.value);
  const rawObjectKey = carbotiConnectorRawObjectKey({
    filename: input.input.filename,
    messageId,
    receivedAt,
    sourceId: source.id,
    sourceKind: parsedKind.output,
  });

  await context.env.SOURCE_FILES.put(rawObjectKey, content.value, {
    customMetadata: {
      connectorKind: parsedKind.output,
      connectorMessageId: input.input.connectorMessageId ?? "",
      contentHash,
      messageId,
      source: "connector",
      sourceId: source.id,
    },
    httpMetadata: {
      contentType: input.input.contentType,
    },
  });

  const prepared = prepareConnectorIngestStatements(context.env, {
    client: input.client,
    connectorMessageId: input.input.connectorMessageId ?? null,
    content,
    contentHash,
    contentType: input.input.contentType,
    filename: input.input.filename,
    manifest,
    messageId,
    metadata: input.input.metadata ?? {},
    rawObjectKey,
    receivedAt,
    source,
    sourceKind: parsedKind.output,
  });

  try {
    await context.env.DB.batch(prepared.statements);
  } catch (error) {
    await context.env.SOURCE_FILES.delete(rawObjectKey);
    throw error;
  }

  return context.json(
    {
      artifacts: prepared.metadata.artifactIds.map((id) => ({ id })),
      messageId,
      normalizedMessageObjectId: prepared.metadata.normalizedMessageObjectId,
      rawObject: {
        contentHash,
        contentType: input.input.contentType,
        id: prepared.metadata.rawObjectId,
        objectKey: rawObjectKey,
        size: content.value.byteLength,
      },
      source: presentSource(source),
      status: "accepted",
    },
    202,
  );
}

function prepareConnectorIngestStatements(
  env: Env,
  input: {
    client: CarbotiApiClient;
    connectorMessageId: string | null;
    content: { textBody: string | null; value: ArrayBuffer };
    contentHash: string;
    contentType: string;
    filename: string;
    manifest: CarbotiConnectorManifest;
    messageId: string;
    metadata: Record<string, unknown>;
    rawObjectKey: string;
    receivedAt: string;
    source: SourceRow;
    sourceKind: CarbotiSourceKind;
  },
): {
  metadata: {
    artifactIds: string[];
    normalizedMessageObjectId: string;
    rawObjectId: string;
  };
  statements: D1PreparedStatement[];
} {
  const rawObjectKind = rawObjectKindFor(input.sourceKind, input.contentType);
  const rawObject = rawConnectorObjectRef(input, rawObjectKind);
  const normalizedMessageObjectId = normalizedMessageObjectIdFor(input.messageId);
  const envelope: CarbotiMessageEnvelope = {
    attachments: [],
    from: `connector:${input.source.id}`,
    id: input.messageId,
    metadata: {
      connector: {
        kind: input.sourceKind,
        messageId: input.connectorMessageId,
        sourceId: input.source.id,
      },
      filename: input.filename,
      rawSize: input.content.value.byteLength,
      source: "connector",
      sourceMetadata: input.metadata,
    },
    rawObjectRef: rawObject,
    receivedAt: input.receivedAt,
    sourceId: input.source.id,
    subject: input.filename,
    to: [],
    workspaceId: input.client.workspaceId,
  };
  const artifactInputs = [
    {
      contentType: "application/json",
      data: envelope,
      id: artifactIdFor(input.messageId, "normalized-json"),
      kind: "normalized_json",
      size: jsonSize(envelope),
    },
    ...(input.content.textBody
      ? [
          {
            contentType: "text/plain",
            data: {
              text: input.content.textBody,
            },
            id: artifactIdFor(input.messageId, "message-text"),
            kind: "message_text",
            size: new TextEncoder().encode(input.content.textBody).byteLength,
          },
        ]
      : []),
  ];

  return {
    metadata: {
      artifactIds: artifactInputs.map((artifact) => artifact.id),
      normalizedMessageObjectId,
      rawObjectId: rawObject.id,
    },
    statements: [
      prepareCarbotiObjectInsert(env, {
        contentHash: input.contentHash,
        contentType: input.contentType,
        createdAt: input.receivedAt,
        data: {
          connectorKind: input.sourceKind,
          connectorMessageId: input.connectorMessageId,
          filename: input.filename,
          source: "connector",
        },
        id: rawObject.id,
        kind: rawObjectKind,
        messageId: input.messageId,
        objectKey: input.rawObjectKey,
        size: input.content.value.byteLength,
        sourceId: input.source.id,
        workspaceId: input.client.workspaceId,
      }),
      prepareCarbotiObjectInsert(env, {
        contentType: "application/vnd.carboti.message+json",
        createdAt: input.receivedAt,
        data: envelope,
        id: normalizedMessageObjectId,
        kind: "normalized_message",
        messageId: input.messageId,
        sourceId: input.source.id,
        workspaceId: input.client.workspaceId,
      }),
      ...artifactInputs.flatMap((artifact) => [
        prepareCarbotiObjectInsert(env, {
          contentType: artifact.contentType,
          createdAt: input.receivedAt,
          data: {
            artifactKind: artifact.kind,
          },
          id: artifact.id,
          kind: "artifact",
          messageId: input.messageId,
          size: artifact.size,
          sourceId: input.source.id,
          workspaceId: input.client.workspaceId,
        }),
        prepareCarbotiArtifactInsert(env, {
          contentType: artifact.contentType,
          createdAt: input.receivedAt,
          data: artifact.data,
          id: artifact.id,
          kind: artifact.kind,
          messageId: input.messageId,
          size: artifact.size,
          workspaceId: input.client.workspaceId,
        }),
      ]),
      prepareCarbotiLineageInsert(env, {
        createdAt: input.receivedAt,
        fromObjectId: rawObject.id,
        relation: "normalized_to",
        toObjectId: normalizedMessageObjectId,
        workspaceId: input.client.workspaceId,
      }),
      ...artifactInputs.map((artifact) =>
        prepareCarbotiLineageInsert(env, {
          createdAt: input.receivedAt,
          fromObjectId: normalizedMessageObjectId,
          relation: "processed_into",
          toObjectId: artifact.id,
          workspaceId: input.client.workspaceId,
        }),
      ),
      prepareAuditInsert(
        env,
        createAuditEvent({
          action: "carboti.connector.ingest.accepted",
          actor: {
            id: apiClientActorId(input.client),
            kind: "system",
          },
          metadata: {
            artifactIds: artifactInputs.map((artifact) => artifact.id),
            connectorKind: input.sourceKind,
            contentHash: input.contentHash,
            contentType: input.contentType,
            filename: input.filename,
            manifestKind: input.manifest.kind,
            messageId: input.messageId,
            objectKey: input.rawObjectKey,
            rawObjectId: rawObject.id,
            sourceId: input.source.id,
          },
          subject: {
            id: input.messageId,
            kind: "carboti_message",
          },
        }),
      ),
    ],
  };
}

async function readConnectorSource(
  context: AppContext,
  client: CarbotiApiClient,
  sourceId: string,
): Promise<SourceRow | null> {
  return context.env.DB.prepare(
    `
      SELECT id, workspace_id, kind, name, status, config_json, created_at, updated_at
      FROM carboti_sources
      WHERE id = ?
        AND workspace_id = ?
      LIMIT 1
    `,
  )
    .bind(sourceId, client.workspaceId)
    .first<SourceRow>();
}

function validateConnectorConfig(
  config: Record<string, unknown>,
  manifest: CarbotiConnectorManifest,
): {
  code: "connector_config_missing_required_field" | "connector_secret_inline_not_allowed";
  message: string;
} | null {
  const missingFields = missingRequiredConfigFields(config, manifest);
  if (missingFields.length > 0) {
    return {
      code: "connector_config_missing_required_field",
      message: `Connector config is missing required field "${missingFields[0]}".`,
    };
  }

  const secretPath = inlineSecretPath(config);
  if (secretPath) {
    return {
      code: "connector_secret_inline_not_allowed",
      message: `Connector config must store secrets as secret refs, not inline at "${secretPath}".`,
    };
  }

  return null;
}

async function validateConnectorSecretRefs(
  context: AppContext,
  client: CarbotiApiClient,
  secretRefs: Record<string, string>,
): Promise<
  | {
      ok: true;
    }
  | {
      code: "connector_secret_ref_invalid" | "connector_secret_ref_not_found";
      message: string;
      ok: false;
    }
> {
  for (const [key, secretRef] of Object.entries(secretRefs)) {
    if (!secretRef.startsWith("secret:")) {
      return {
        code: "connector_secret_ref_invalid",
        message: `Connector secret ref "${key}" must reference a Carboti secret ref.`,
        ok: false,
      };
    }

    const row = await context.env.DB.prepare(
      `
        SELECT id, kind, status
        FROM carboti_secret_refs
        WHERE id = ?
          AND workspace_id = ?
          AND kind = ?
          AND (status IS NULL OR status = 'active')
        LIMIT 1
      `,
    )
      .bind(secretRef, client.workspaceId, "connector_credential")
      .first<SecretRefRow>();
    if (!row) {
      return {
        code: "connector_secret_ref_not_found",
        message: `Connector secret ref "${key}" was not found or is not active.`,
        ok: false,
      };
    }
  }

  return {
    ok: true,
  };
}

function missingRequiredConfigFields(
  config: Record<string, unknown>,
  manifest: CarbotiConnectorManifest,
): string[] {
  return manifest.configFields
    .filter((field) => field.required && config[field.name] === undefined)
    .map((field) => field.name);
}

function inlineSecretPath(value: unknown, path = "config"): string | null {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const result = inlineSecretPath(value[index], `${path}.${index}`);
      if (result) return result;
    }
    return null;
  }

  if (!isUnknownRecord(value)) return null;

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    if (/(secret|token|password|credential|api[_-]?key|clientsecret)/i.test(key)) {
      return childPath;
    }
    const result = inlineSecretPath(child, childPath);
    if (result) return result;
  }

  return null;
}

function connectorContentBytes(input: ConnectorIngestInput):
  | {
      ok: true;
      textBody: string | null;
      value: ArrayBuffer;
    }
  | {
      code:
        | "connector_content_ambiguous"
        | "connector_content_missing"
        | "connector_content_invalid";
      message: string;
      ok: false;
    } {
  if (input.contentBase64 && input.contentText !== undefined) {
    return {
      code: "connector_content_ambiguous",
      message: "Provide either contentBase64 or contentText, not both.",
      ok: false,
    };
  }

  if (input.contentText !== undefined) {
    return {
      ok: true,
      textBody: textArtifactFor(input.contentText, input.contentType),
      value: bytesToArrayBuffer(new TextEncoder().encode(input.contentText)),
    };
  }

  if (!input.contentBase64) {
    return {
      code: "connector_content_missing",
      message: "Connector content is required.",
      ok: false,
    };
  }

  try {
    const binary = atob(input.contentBase64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return {
      ok: true,
      textBody: textArtifactFor(bytes, input.contentType),
      value: bytesToArrayBuffer(bytes),
    };
  } catch {
    return {
      code: "connector_content_invalid",
      message: "contentBase64 must be valid base64.",
      ok: false,
    };
  }
}

function textArtifactFor(value: string | Uint8Array, contentType: string): string | null {
  const byteLength =
    typeof value === "string" ? new TextEncoder().encode(value).byteLength : value.byteLength;
  if (!isTextualContentType(contentType) || byteLength > textArtifactByteLimit) {
    return null;
  }

  return typeof value === "string" ? value : new TextDecoder().decode(value);
}

function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function isTextualContentType(contentType: string): boolean {
  const normalized = contentType.toLowerCase();
  return (
    normalized.startsWith("text/") ||
    normalized.includes("json") ||
    normalized.includes("xml") ||
    normalized.includes("csv")
  );
}

function rawObjectKindFor(sourceKind: CarbotiSourceKind, contentType: string): CarbotiObjectKind {
  if (contentType.toLowerCase().includes("message/rfc822")) return "raw_email";
  if (
    sourceKind === "cloudflare_email" ||
    sourceKind === "email_forward" ||
    sourceKind === "gmail" ||
    sourceKind === "microsoft_graph" ||
    sourceKind === "imap" ||
    sourceKind === "ses" ||
    sourceKind === "postmark" ||
    sourceKind === "mailgun"
  ) {
    return "raw_email";
  }

  return "raw_document";
}

function rawConnectorObjectRef(
  input: {
    contentHash: string;
    contentType: string;
    messageId: string;
    rawObjectKey: string;
    content: { value: ArrayBuffer };
  },
  kind: CarbotiObjectKind,
): CarbotiObjectRef {
  return {
    contentHash: input.contentHash,
    contentType: input.contentType,
    id: rawConnectorObjectIdFor(input.messageId),
    kind,
    objectKey: input.rawObjectKey,
    size: input.content.value.byteLength,
  };
}

function prepareCarbotiObjectInsert(
  env: Env,
  input: {
    contentHash?: string | undefined;
    contentType?: string | undefined;
    createdAt: string;
    data?: unknown;
    id: string;
    kind: string;
    messageId?: string | undefined;
    objectKey?: string | undefined;
    size?: number | undefined;
    sourceId?: string | undefined;
    workspaceId: string;
  },
): D1PreparedStatement {
  return env.DB.prepare(
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
    input.id,
    input.workspaceId,
    input.kind,
    input.sourceId ?? null,
    input.messageId ?? null,
    input.objectKey ?? null,
    input.contentType ?? null,
    input.contentHash ?? null,
    input.size ?? null,
    input.data === undefined ? null : JSON.stringify(input.data),
    input.createdAt,
  );
}

function prepareCarbotiArtifactInsert(
  env: Env,
  input: {
    contentType: string;
    createdAt: string;
    data: unknown;
    id: string;
    kind: string;
    messageId: string;
    size: number;
    workspaceId: string;
  },
): D1PreparedStatement {
  return env.DB.prepare(
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
    input.id,
    input.workspaceId,
    input.kind,
    input.messageId,
    null,
    "carboti.message.v0",
    null,
    input.contentType,
    null,
    input.size,
    JSON.stringify(input.data),
    input.createdAt,
  );
}

function prepareCarbotiLineageInsert(
  env: Env,
  input: {
    createdAt: string;
    fromObjectId: string;
    relation: string;
    toObjectId: string;
    workspaceId: string;
  },
): D1PreparedStatement {
  return env.DB.prepare(
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
    input.workspaceId,
    input.fromObjectId,
    input.toObjectId,
    input.relation,
    null,
    input.createdAt,
  );
}

function presentSource(source: SourceRow): Record<string, unknown> {
  return {
    id: source.id,
    kind: source.kind,
    name: source.name,
    status: source.status,
  };
}

function parseConnectorConfig(value: string | null): Record<string, unknown> {
  const parsed = parseJsonRecord(value);
  if (isUnknownRecord(parsed.config)) return parsed.config;
  return {};
}

function parseConnectorSecretRefs(value: string | null): Record<string, string> {
  const parsed = parseJsonRecord(value);
  if (!isUnknownRecord(parsed.secretRefs)) return {};
  return Object.fromEntries(
    Object.entries(parsed.secretRefs).filter((entry): entry is [string, string] => {
      const [key, secretRef] = entry;
      return typeof key === "string" && typeof secretRef === "string";
    }),
  );
}

function parseJsonRecord(value: string | null): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return isUnknownRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rawConnectorObjectIdFor(messageId: string): string {
  return `object:${messageId}:raw-connector`;
}

function normalizedMessageObjectIdFor(messageId: string): string {
  return `object:${messageId}:normalized-message`;
}

function artifactIdFor(messageId: string, kind: string): string {
  return `artifact:${messageId}:${kind}`;
}

function jsonSize(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}
