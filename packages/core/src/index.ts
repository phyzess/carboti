import * as v from "valibot";

export { carbotiOpenApiDocument, type CarbotiOpenApiDocument } from "./openapi";

export const carbotiSourceKinds = [
  "cloudflare_email",
  "email_forward",
  "http_upload",
  "webhook",
  "gmail",
  "microsoft_graph",
  "imap",
  "s3",
  "r2",
] as const;

export const carbotiObjectKinds = [
  "raw_email",
  "raw_attachment",
  "raw_document",
  "normalized_message",
  "artifact",
  "export",
] as const;

export const carbotiArtifactKinds = [
  "message_text",
  "message_html",
  "attachment_manifest",
  "normalized_json",
  "record",
  "table",
  "agent_context_bundle",
  "processor_output",
] as const;

export const carbotiProcessorKinds = ["builtin", "external_webhook", "hosted", "agent"] as const;

export const carbotiSinkKinds = ["api_pull", "webhook", "r2", "s3", "download", "queue"] as const;

export const carbotiProcessorPermissions = [
  "read:message",
  "read:artifacts",
  "write:artifacts",
] as const;

export const carbotiJobStatuses = [
  "queued",
  "processing",
  "needs_review",
  "succeeded",
  "failed",
  "canceled",
] as const;

export const carbotiDeliveryStatuses = ["pending", "delivered", "failed", "disabled"] as const;

export const CarbotiSourceKindSchema = v.picklist(carbotiSourceKinds);
export const CarbotiObjectKindSchema = v.picklist(carbotiObjectKinds);
export const CarbotiArtifactKindSchema = v.picklist(carbotiArtifactKinds);
export const CarbotiProcessorKindSchema = v.picklist(carbotiProcessorKinds);
export const CarbotiSinkKindSchema = v.picklist(carbotiSinkKinds);
export const CarbotiProcessorPermissionSchema = v.picklist(carbotiProcessorPermissions);
export const CarbotiJobStatusSchema = v.picklist(carbotiJobStatuses);
export const CarbotiDeliveryStatusSchema = v.picklist(carbotiDeliveryStatuses);

export type CarbotiSourceKind = v.InferOutput<typeof CarbotiSourceKindSchema>;
export type CarbotiObjectKind = v.InferOutput<typeof CarbotiObjectKindSchema>;
export type CarbotiArtifactKind = v.InferOutput<typeof CarbotiArtifactKindSchema>;
export type CarbotiProcessorKind = v.InferOutput<typeof CarbotiProcessorKindSchema>;
export type CarbotiSinkKind = v.InferOutput<typeof CarbotiSinkKindSchema>;
export type CarbotiProcessorPermission = v.InferOutput<typeof CarbotiProcessorPermissionSchema>;
export type CarbotiJobStatus = v.InferOutput<typeof CarbotiJobStatusSchema>;
export type CarbotiDeliveryStatus = v.InferOutput<typeof CarbotiDeliveryStatusSchema>;

export type CarbotiProcessorCapabilityManifest = {
  inputArtifactKinds: CarbotiArtifactKind[];
  inputObjectKinds: CarbotiObjectKind[];
  outputArtifactKinds: CarbotiArtifactKind[];
  permissions: CarbotiProcessorPermission[];
};

export const carbotiDefaultProcessorCapabilityManifest = {
  inputArtifactKinds: ["message_text", "message_html", "attachment_manifest", "normalized_json"],
  inputObjectKinds: ["normalized_message"],
  outputArtifactKinds: ["processor_output"],
  permissions: ["read:message", "read:artifacts", "write:artifacts"],
} satisfies CarbotiProcessorCapabilityManifest;

export const CarbotiProcessorCapabilityManifestSchema = v.object({
  inputArtifactKinds: v.optional(v.array(CarbotiArtifactKindSchema)),
  inputObjectKinds: v.optional(v.array(CarbotiObjectKindSchema)),
  outputArtifactKinds: v.optional(v.array(CarbotiArtifactKindSchema)),
  permissions: v.optional(v.array(CarbotiProcessorPermissionSchema)),
});

export type CarbotiProcessorCapabilityManifestInput = v.InferOutput<
  typeof CarbotiProcessorCapabilityManifestSchema
>;

export function normalizeCarbotiProcessorCapabilityManifest(
  input: CarbotiProcessorCapabilityManifestInput = {},
): CarbotiProcessorCapabilityManifest {
  return {
    inputArtifactKinds: [
      ...(input.inputArtifactKinds ?? carbotiDefaultProcessorCapabilityManifest.inputArtifactKinds),
    ],
    inputObjectKinds: [
      ...(input.inputObjectKinds ?? carbotiDefaultProcessorCapabilityManifest.inputObjectKinds),
    ],
    outputArtifactKinds: [
      ...(input.outputArtifactKinds ??
        carbotiDefaultProcessorCapabilityManifest.outputArtifactKinds),
    ],
    permissions: [...(input.permissions ?? carbotiDefaultProcessorCapabilityManifest.permissions)],
  };
}

export function parseCarbotiProcessorCapabilityManifest(
  input: unknown,
): CarbotiProcessorCapabilityManifest {
  return normalizeCarbotiProcessorCapabilityManifest(
    v.parse(CarbotiProcessorCapabilityManifestSchema, input ?? {}),
  );
}

export const CarbotiSourceSchema = v.object({
  id: v.string(),
  kind: CarbotiSourceKindSchema,
  name: v.string(),
  workspaceId: v.string(),
  status: v.picklist(["active", "disabled"]),
  createdAt: v.string(),
  updatedAt: v.string(),
});

export const CarbotiPipelineSchema = v.object({
  id: v.string(),
  name: v.string(),
  sourceId: v.string(),
  workspaceId: v.string(),
  status: v.picklist(["active", "disabled"]),
  createdAt: v.string(),
  updatedAt: v.string(),
});

export const CarbotiObjectRefSchema = v.object({
  id: v.string(),
  kind: CarbotiObjectKindSchema,
  objectKey: v.string(),
  contentType: v.string(),
  contentHash: v.optional(v.string()),
  size: v.optional(v.number()),
});

export const CarbotiStoredObjectSchema = v.object({
  id: v.string(),
  kind: CarbotiObjectKindSchema,
  workspaceId: v.string(),
  sourceId: v.optional(v.string()),
  messageId: v.optional(v.string()),
  objectKey: v.optional(v.string()),
  contentType: v.optional(v.string()),
  contentHash: v.optional(v.string()),
  size: v.optional(v.number()),
  data: v.optional(v.unknown()),
  createdAt: v.string(),
});

export const CarbotiAttachmentSchema = v.object({
  id: v.string(),
  filename: v.string(),
  contentType: v.string(),
  objectRef: CarbotiObjectRefSchema,
});

export const CarbotiMessageEnvelopeSchema = v.object({
  id: v.string(),
  sourceId: v.string(),
  workspaceId: v.string(),
  rawObjectRef: CarbotiObjectRefSchema,
  subject: v.optional(v.string()),
  from: v.optional(v.string()),
  to: v.optional(v.array(v.string())),
  receivedAt: v.string(),
  attachments: v.array(CarbotiAttachmentSchema),
  metadata: v.optional(v.record(v.string(), v.unknown())),
});

export const CarbotiArtifactSchema = v.object({
  id: v.string(),
  kind: CarbotiArtifactKindSchema,
  workspaceId: v.string(),
  messageId: v.optional(v.string()),
  processorRunId: v.optional(v.string()),
  schemaId: v.optional(v.string()),
  objectRef: v.optional(CarbotiObjectRefSchema),
  data: v.optional(v.unknown()),
  createdAt: v.string(),
});

export const CarbotiLineageEdgeSchema = v.object({
  id: v.string(),
  workspaceId: v.string(),
  fromObjectId: v.string(),
  toObjectId: v.string(),
  relation: v.picklist([
    "received_as",
    "contains",
    "normalized_to",
    "processed_into",
    "exported_as",
  ]),
  processorRunId: v.optional(v.string()),
  createdAt: v.string(),
});

export const CarbotiProcessorConfigSchema = v.object({
  id: v.string(),
  kind: CarbotiProcessorKindSchema,
  name: v.string(),
  workspaceId: v.string(),
  capabilityManifest: v.optional(CarbotiProcessorCapabilityManifestSchema),
  timeoutSeconds: v.optional(v.number()),
  endpointUrl: v.optional(v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
});

export const CarbotiProcessorRunSchema = v.object({
  id: v.string(),
  processorId: v.string(),
  pipelineId: v.optional(v.string()),
  messageId: v.optional(v.string()),
  status: CarbotiJobStatusSchema,
  startedAt: v.string(),
  completedAt: v.optional(v.string()),
  errorMessage: v.optional(v.string()),
});

export const CarbotiWebhookEndpointSchema = v.object({
  id: v.string(),
  workspaceId: v.string(),
  url: v.string(),
  status: v.picklist(["active", "disabled"]),
  createdAt: v.string(),
  updatedAt: v.string(),
});

export const CarbotiWebhookDeliverySchema = v.object({
  id: v.string(),
  endpointId: v.string(),
  eventType: v.string(),
  status: CarbotiDeliveryStatusSchema,
  attemptCount: v.number(),
  nextAttemptAt: v.optional(v.string()),
  deliveredAt: v.optional(v.string()),
  createdAt: v.string(),
});

export type CarbotiSource = v.InferOutput<typeof CarbotiSourceSchema>;
export type CarbotiPipeline = v.InferOutput<typeof CarbotiPipelineSchema>;
export type CarbotiObjectRef = v.InferOutput<typeof CarbotiObjectRefSchema>;
export type CarbotiStoredObject = v.InferOutput<typeof CarbotiStoredObjectSchema>;
export type CarbotiAttachment = v.InferOutput<typeof CarbotiAttachmentSchema>;
export type CarbotiMessageEnvelope = v.InferOutput<typeof CarbotiMessageEnvelopeSchema>;
export type CarbotiArtifact = v.InferOutput<typeof CarbotiArtifactSchema>;
export type CarbotiLineageEdge = v.InferOutput<typeof CarbotiLineageEdgeSchema>;
export type CarbotiProcessorConfig = v.InferOutput<typeof CarbotiProcessorConfigSchema>;
export type CarbotiProcessorRun = v.InferOutput<typeof CarbotiProcessorRunSchema>;
export type CarbotiWebhookEndpoint = v.InferOutput<typeof CarbotiWebhookEndpointSchema>;
export type CarbotiWebhookDelivery = v.InferOutput<typeof CarbotiWebhookDeliverySchema>;

export function parseCarbotiMessageEnvelope(input: unknown): CarbotiMessageEnvelope {
  return v.parse(CarbotiMessageEnvelopeSchema, input);
}

export function carbotiRawEmailObjectKey(input: { receivedAt: string; messageId: string }): string {
  return `raw-emails/${input.receivedAt.slice(0, 10)}/${input.messageId}.eml`;
}

export function carbotiRawHttpObjectKey(input: {
  filename: string;
  messageId: string;
  receivedAt: string;
}): string {
  const safeFilename = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `raw-http/${input.receivedAt.slice(0, 10)}/${input.messageId}/${safeFilename}`;
}
