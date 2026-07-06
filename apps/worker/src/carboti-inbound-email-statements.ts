import type { CarbotiAttachment, CarbotiMessageEnvelope, CarbotiObjectRef } from "@carboti/core";
import type { InboundEmailAttachmentResult } from "./inbound-email-attachments";

export type CarbotiInboundEmailMetadataInput = {
  attachmentResults: InboundEmailAttachmentResult[];
  from: string;
  inboundEmailId: string;
  rawContentHash: string;
  rawObjectKey: string;
  rawSize: number;
  receivedAt: string;
  status: string;
  subject: string | undefined;
  textBody: string | undefined;
  to: string;
};

const defaultWorkspaceId = "default";
const defaultCloudflareEmailSourceId = "source:cloudflare-email:default";

export function prepareCarbotiInboundEmailStatements(
  env: Env,
  input: CarbotiInboundEmailMetadataInput,
): D1PreparedStatement[] {
  const rawEmailObject = rawEmailObjectRef(input);
  const attachments = input.attachmentResults.map((result, index) =>
    carbotiAttachment(input.inboundEmailId, result, index),
  );
  const attachmentManifestData = attachmentManifest(input.inboundEmailId, input.attachmentResults);
  const envelope: CarbotiMessageEnvelope = {
    attachments,
    from: input.from,
    id: input.inboundEmailId,
    metadata: {
      rawSize: input.rawSize,
      status: input.status,
    },
    rawObjectRef: rawEmailObject,
    receivedAt: input.receivedAt,
    sourceId: defaultCloudflareEmailSourceId,
    subject: input.subject,
    to: [input.to],
    workspaceId: defaultWorkspaceId,
  };
  const normalizedMessageObjectId = normalizedMessageObjectIdFor(input.inboundEmailId);
  const normalizedJsonArtifactId = artifactIdFor(input.inboundEmailId, "normalized-json");
  const attachmentManifestArtifactId = artifactIdFor(input.inboundEmailId, "attachment-manifest");
  const artifactInputs = [
    {
      contentType: "application/json",
      data: envelope,
      id: normalizedJsonArtifactId,
      kind: "normalized_json",
      size: jsonSize(envelope),
    },
    {
      contentType: "application/json",
      data: attachmentManifestData,
      id: attachmentManifestArtifactId,
      kind: "attachment_manifest",
      size: jsonSize(attachmentManifestData),
    },
    ...(input.textBody
      ? [
          {
            contentType: "text/plain",
            data: {
              text: input.textBody,
            },
            id: artifactIdFor(input.inboundEmailId, "message-text"),
            kind: "message_text",
            size: new TextEncoder().encode(input.textBody).byteLength,
          },
        ]
      : []),
  ];

  return [
    prepareDefaultCloudflareEmailSourceUpsert(env, input.receivedAt),
    prepareCarbotiObjectInsert(env, {
      contentHash: input.rawContentHash,
      contentType: "message/rfc822",
      createdAt: input.receivedAt,
      data: {
        from: input.from,
        subject: input.subject,
        to: input.to,
      },
      id: rawEmailObject.id,
      kind: "raw_email",
      messageId: input.inboundEmailId,
      objectKey: input.rawObjectKey,
      size: input.rawSize,
      sourceId: defaultCloudflareEmailSourceId,
    }),
    ...input.attachmentResults.map((result, index) =>
      prepareCarbotiObjectInsert(env, {
        contentHash: result.contentHash,
        contentType: result.attachment.contentType,
        createdAt: input.receivedAt,
        data: {
          filename: result.attachment.filename,
          importJobId: result.intake.ok ? result.intake.importJobId : null,
          sourceFileId: result.intake.ok ? result.intake.sourceFileId : null,
          status: result.intake.ok ? (result.intake.duplicate ? "duplicate" : "queued") : "stored",
        },
        id: rawAttachmentObjectIdFor(input.inboundEmailId, index),
        kind: "raw_attachment",
        messageId: input.inboundEmailId,
        objectKey: result.rawObjectKey,
        size: result.attachment.size,
        sourceId: defaultCloudflareEmailSourceId,
      }),
    ),
    prepareCarbotiObjectInsert(env, {
      contentType: "application/vnd.carboti.message+json",
      createdAt: input.receivedAt,
      data: envelope,
      id: normalizedMessageObjectId,
      kind: "normalized_message",
      messageId: input.inboundEmailId,
      sourceId: defaultCloudflareEmailSourceId,
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
        messageId: input.inboundEmailId,
        size: artifact.size,
        sourceId: defaultCloudflareEmailSourceId,
      }),
      prepareCarbotiArtifactInsert(env, {
        contentType: artifact.contentType,
        createdAt: input.receivedAt,
        data: artifact.data,
        id: artifact.id,
        kind: artifact.kind,
        messageId: input.inboundEmailId,
        size: artifact.size,
      }),
    ]),
    prepareCarbotiLineageInsert(env, {
      createdAt: input.receivedAt,
      fromObjectId: rawEmailObject.id,
      relation: "normalized_to",
      toObjectId: normalizedMessageObjectId,
    }),
    ...input.attachmentResults.map((_, index) =>
      prepareCarbotiLineageInsert(env, {
        createdAt: input.receivedAt,
        fromObjectId: rawEmailObject.id,
        relation: "contains",
        toObjectId: rawAttachmentObjectIdFor(input.inboundEmailId, index),
      }),
    ),
    ...artifactInputs.map((artifact) =>
      prepareCarbotiLineageInsert(env, {
        createdAt: input.receivedAt,
        fromObjectId: normalizedMessageObjectId,
        relation: "processed_into",
        toObjectId: artifact.id,
      }),
    ),
  ];
}

function prepareDefaultCloudflareEmailSourceUpsert(env: Env, now: string): D1PreparedStatement {
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
    defaultCloudflareEmailSourceId,
    defaultWorkspaceId,
    "cloudflare_email",
    "Default Cloudflare Email Routing source",
    "active",
    JSON.stringify({
      managedBy: "carboti",
    }),
    now,
    now,
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
    defaultWorkspaceId,
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
    defaultWorkspaceId,
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
    defaultWorkspaceId,
    input.fromObjectId,
    input.toObjectId,
    input.relation,
    null,
    input.createdAt,
  );
}

function rawEmailObjectRef(input: CarbotiInboundEmailMetadataInput): CarbotiObjectRef {
  return {
    contentHash: input.rawContentHash,
    contentType: "message/rfc822",
    id: rawEmailObjectIdFor(input.inboundEmailId),
    kind: "raw_email",
    objectKey: input.rawObjectKey,
    size: input.rawSize,
  };
}

function carbotiAttachment(
  inboundEmailId: string,
  result: InboundEmailAttachmentResult,
  index: number,
): CarbotiAttachment {
  const objectId = rawAttachmentObjectIdFor(inboundEmailId, index);

  return {
    contentType: result.attachment.contentType,
    filename: result.attachment.filename,
    id: objectId,
    objectRef: {
      contentHash: result.contentHash,
      contentType: result.attachment.contentType,
      id: objectId,
      kind: "raw_attachment",
      objectKey: result.rawObjectKey,
      size: result.attachment.size,
    },
  };
}

function attachmentManifest(
  inboundEmailId: string,
  results: InboundEmailAttachmentResult[],
): Record<string, unknown> {
  return {
    attachments: results.map((result, index) => ({
      contentHash: result.contentHash,
      contentType: result.attachment.contentType,
      filename: result.attachment.filename,
      importJobId: result.intake.ok ? result.intake.importJobId : null,
      objectRef: {
        id: rawAttachmentObjectIdFor(inboundEmailId, index),
        kind: "raw_attachment",
        objectKey: result.rawObjectKey,
      },
      size: result.attachment.size,
      sourceFileId: result.intake.ok ? result.intake.sourceFileId : null,
      status: result.intake.ok ? (result.intake.duplicate ? "duplicate" : "queued") : "stored",
    })),
  };
}

function rawEmailObjectIdFor(inboundEmailId: string): string {
  return `object:${inboundEmailId}:raw-email`;
}

function normalizedMessageObjectIdFor(inboundEmailId: string): string {
  return `object:${inboundEmailId}:normalized-message`;
}

function rawAttachmentObjectIdFor(inboundEmailId: string, index: number): string {
  return `object:${inboundEmailId}:raw-attachment:${index + 1}`;
}

function artifactIdFor(inboundEmailId: string, kind: string): string {
  return `artifact:${inboundEmailId}:${kind}`;
}

function jsonSize(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}
