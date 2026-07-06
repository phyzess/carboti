import type { CarbotiMessageEnvelope, CarbotiObjectRef } from "@carboti/core";
import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import { apiClientActorId, type CarbotiApiClient } from "./carboti-api-auth";
import type { SourceIntakeResult } from "./source-intake";

export type CarbotiHttpIngestStatementsInput = {
  client: CarbotiApiClient;
  contentHash: string;
  contentType: string;
  filename: string;
  messageId: string;
  rawObjectKey: string;
  rawSize: number;
  receivedAt: string;
  sourceResult: SourceIntakeResult | null;
  textBody: string | null;
};

export type CarbotiHttpIngestMetadata = {
  artifactIds: string[];
  normalizedMessageObjectId: string;
  rawObjectId: string;
  sourceId: string;
};

export function prepareCarbotiHttpIngestStatements(
  env: Env,
  input: CarbotiHttpIngestStatementsInput,
): {
  metadata: CarbotiHttpIngestMetadata;
  statements: D1PreparedStatement[];
} {
  const sourceId = httpSourceIdFor(input.client.workspaceId);
  const rawObject = rawHttpObjectRef(input);
  const normalizedMessageObjectId = normalizedMessageObjectIdFor(input.messageId);
  const envelope: CarbotiMessageEnvelope = {
    attachments: [],
    from: apiClientActorId(input.client),
    id: input.messageId,
    metadata: {
      contentType: input.contentType,
      filename: input.filename,
      importPipeline: importPipelineMetadata(input.sourceResult),
      rawSize: input.rawSize,
      source: "http_upload",
    },
    rawObjectRef: rawObject,
    receivedAt: input.receivedAt,
    sourceId,
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
    ...(input.textBody
      ? [
          {
            contentType: "text/plain",
            data: {
              text: input.textBody,
            },
            id: artifactIdFor(input.messageId, "message-text"),
            kind: "message_text",
            size: new TextEncoder().encode(input.textBody).byteLength,
          },
        ]
      : []),
  ];

  return {
    metadata: {
      artifactIds: artifactInputs.map((artifact) => artifact.id),
      normalizedMessageObjectId,
      rawObjectId: rawObject.id,
      sourceId,
    },
    statements: [
      prepareHttpSourceUpsert(env, {
        now: input.receivedAt,
        sourceId,
        workspaceId: input.client.workspaceId,
      }),
      prepareCarbotiObjectInsert(env, {
        contentHash: input.contentHash,
        contentType: input.contentType,
        createdAt: input.receivedAt,
        data: {
          apiClientId: input.client.id,
          filename: input.filename,
          source: "http_upload",
        },
        id: rawObject.id,
        kind: "raw_document",
        messageId: input.messageId,
        objectKey: input.rawObjectKey,
        size: input.rawSize,
        sourceId,
        workspaceId: input.client.workspaceId,
      }),
      prepareCarbotiObjectInsert(env, {
        contentType: "application/vnd.carboti.message+json",
        createdAt: input.receivedAt,
        data: envelope,
        id: normalizedMessageObjectId,
        kind: "normalized_message",
        messageId: input.messageId,
        sourceId,
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
          sourceId,
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
          action: "carboti.http_ingest.accepted",
          actor: {
            id: apiClientActorId(input.client),
            kind: "system",
          },
          metadata: {
            artifactIds: artifactInputs.map((artifact) => artifact.id),
            contentHash: input.contentHash,
            contentType: input.contentType,
            filename: input.filename,
            messageId: input.messageId,
            objectKey: input.rawObjectKey,
            rawObjectId: rawObject.id,
            sourceResult: importPipelineMetadata(input.sourceResult),
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

function prepareHttpSourceUpsert(
  env: Env,
  input: {
    now: string;
    sourceId: string;
    workspaceId: string;
  },
): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT OR IGNORE INTO carboti_sources (
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
    input.sourceId,
    input.workspaceId,
    "http_upload",
    "Default HTTP ingest source",
    "active",
    JSON.stringify({
      managedBy: "carboti",
    }),
    input.now,
    input.now,
  );
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

function rawHttpObjectRef(input: CarbotiHttpIngestStatementsInput): CarbotiObjectRef {
  return {
    contentHash: input.contentHash,
    contentType: input.contentType,
    id: rawHttpObjectIdFor(input.messageId),
    kind: "raw_document",
    objectKey: input.rawObjectKey,
    size: input.rawSize,
  };
}

function importPipelineMetadata(result: SourceIntakeResult | null): Record<string, unknown> {
  if (!result) {
    return {
      status: "not_supported",
    };
  }

  if (!result.ok) {
    return {
      code: result.code,
      importJobId: result.importJobId ?? null,
      objectKey: result.objectKey ?? null,
      sourceFileId: result.sourceFileId ?? null,
      status: result.code,
    };
  }

  return {
    duplicate: result.duplicate,
    importJobId: result.importJobId,
    objectKey: result.objectKey,
    sourceFileId: result.sourceFileId,
    status: result.status,
  };
}

function rawHttpObjectIdFor(messageId: string): string {
  return `object:${messageId}:raw-document`;
}

function normalizedMessageObjectIdFor(messageId: string): string {
  return `object:${messageId}:normalized-message`;
}

function artifactIdFor(messageId: string, kind: string): string {
  return `artifact:${messageId}:${kind}`;
}

function httpSourceIdFor(workspaceId: string): string {
  return `source:http-upload:${workspaceId}`;
}

function jsonSize(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}
