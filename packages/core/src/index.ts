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
  "ses",
  "postmark",
  "mailgun",
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

export const carbotiConnectorDirections = ["source", "sink", "source_sink"] as const;

export const carbotiConnectorCapabilities = [
  "webhook_ingest",
  "polling_ingest",
  "push_object",
  "pull_object",
  "artifact_sink",
  "health_check",
] as const;

export const carbotiConnectorAuthModes = [
  "none",
  "api_key",
  "basic",
  "oauth2",
  "aws_iam",
  "cloudflare_binding",
] as const;

export const carbotiHostedProcessorRuntimes = [
  "cloudflare_workers",
  "cloudflare_workflows",
  "cloudflare_containers",
  "external_sandbox",
] as const;

export const carbotiHostedProcessorNetworkPolicies = [
  "egress_disabled",
  "egress_allowlist",
  "egress_any",
] as const;

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
export const CarbotiConnectorDirectionSchema = v.picklist(carbotiConnectorDirections);
export const CarbotiConnectorCapabilitySchema = v.picklist(carbotiConnectorCapabilities);
export const CarbotiConnectorAuthModeSchema = v.picklist(carbotiConnectorAuthModes);
export const CarbotiHostedProcessorRuntimeSchema = v.picklist(carbotiHostedProcessorRuntimes);
export const CarbotiHostedProcessorNetworkPolicySchema = v.picklist(
  carbotiHostedProcessorNetworkPolicies,
);
export const CarbotiProcessorPermissionSchema = v.picklist(carbotiProcessorPermissions);
export const CarbotiJobStatusSchema = v.picklist(carbotiJobStatuses);
export const CarbotiDeliveryStatusSchema = v.picklist(carbotiDeliveryStatuses);

export type CarbotiSourceKind = v.InferOutput<typeof CarbotiSourceKindSchema>;
export type CarbotiObjectKind = v.InferOutput<typeof CarbotiObjectKindSchema>;
export type CarbotiArtifactKind = v.InferOutput<typeof CarbotiArtifactKindSchema>;
export type CarbotiProcessorKind = v.InferOutput<typeof CarbotiProcessorKindSchema>;
export type CarbotiSinkKind = v.InferOutput<typeof CarbotiSinkKindSchema>;
export type CarbotiConnectorDirection = v.InferOutput<typeof CarbotiConnectorDirectionSchema>;
export type CarbotiConnectorCapability = v.InferOutput<typeof CarbotiConnectorCapabilitySchema>;
export type CarbotiConnectorAuthMode = v.InferOutput<typeof CarbotiConnectorAuthModeSchema>;
export type CarbotiHostedProcessorRuntime = v.InferOutput<
  typeof CarbotiHostedProcessorRuntimeSchema
>;
export type CarbotiHostedProcessorNetworkPolicy = v.InferOutput<
  typeof CarbotiHostedProcessorNetworkPolicySchema
>;
export type CarbotiProcessorPermission = v.InferOutput<typeof CarbotiProcessorPermissionSchema>;
export type CarbotiJobStatus = v.InferOutput<typeof CarbotiJobStatusSchema>;
export type CarbotiDeliveryStatus = v.InferOutput<typeof CarbotiDeliveryStatusSchema>;

export type CarbotiProcessorCapabilityManifest = {
  inputArtifactKinds: CarbotiArtifactKind[];
  inputObjectKinds: CarbotiObjectKind[];
  outputArtifactKinds: CarbotiArtifactKind[];
  permissions: CarbotiProcessorPermission[];
};

export type CarbotiConnectorConfigField = {
  description?: string | undefined;
  name: string;
  required: boolean;
  secret: boolean;
};

export type CarbotiConnectorManifest = {
  authModes: CarbotiConnectorAuthMode[];
  capabilities: CarbotiConnectorCapability[];
  configFields: CarbotiConnectorConfigField[];
  direction: CarbotiConnectorDirection;
  displayName: string;
  healthCheck: {
    mode: "manifest" | "remote" | "none";
    requiredConfigFields: string[];
  };
  inputObjectKinds: CarbotiObjectKind[];
  kind: CarbotiSourceKind | CarbotiSinkKind;
  outputArtifactKinds: CarbotiArtifactKind[];
};

export type CarbotiHostedProcessorResourceLimits = {
  cpuMs: number;
  maxInputBytes: number;
  maxOutputBytes: number;
  memoryMb: number;
  networkPolicy: CarbotiHostedProcessorNetworkPolicy;
  timeoutSeconds: number;
};

export type CarbotiHostedProcessorRuntimeManifest = {
  defaultResourceLimits: CarbotiHostedProcessorResourceLimits;
  displayName: string;
  isolation: "worker" | "workflow" | "container" | "external";
  maxResourceLimits: CarbotiHostedProcessorResourceLimits;
  runtime: CarbotiHostedProcessorRuntime;
};

export const carbotiDefaultProcessorCapabilityManifest = {
  inputArtifactKinds: ["message_text", "message_html", "attachment_manifest", "normalized_json"],
  inputObjectKinds: ["normalized_message"],
  outputArtifactKinds: ["processor_output"],
  permissions: ["read:message", "read:artifacts", "write:artifacts"],
} satisfies CarbotiProcessorCapabilityManifest;

export const carbotiConnectorManifests = [
  {
    authModes: ["cloudflare_binding"],
    capabilities: ["webhook_ingest", "push_object", "health_check"],
    configFields: [],
    direction: "source",
    displayName: "Cloudflare Email Routing",
    healthCheck: { mode: "manifest", requiredConfigFields: [] },
    inputObjectKinds: ["raw_email", "raw_attachment"],
    kind: "cloudflare_email",
    outputArtifactKinds: ["normalized_json", "message_text", "attachment_manifest"],
  },
  {
    authModes: ["none"],
    capabilities: ["webhook_ingest", "push_object", "health_check"],
    configFields: [{ name: "forwardingAddress", required: false, secret: false }],
    direction: "source",
    displayName: "Forwarded Email",
    healthCheck: { mode: "manifest", requiredConfigFields: [] },
    inputObjectKinds: ["raw_email", "raw_attachment"],
    kind: "email_forward",
    outputArtifactKinds: ["normalized_json", "message_text", "attachment_manifest"],
  },
  {
    authModes: ["api_key"],
    capabilities: ["push_object", "health_check"],
    configFields: [],
    direction: "source",
    displayName: "HTTP Upload",
    healthCheck: { mode: "manifest", requiredConfigFields: [] },
    inputObjectKinds: ["raw_document"],
    kind: "http_upload",
    outputArtifactKinds: ["normalized_json", "message_text"],
  },
  {
    authModes: ["api_key"],
    capabilities: ["webhook_ingest", "push_object", "health_check"],
    configFields: [{ name: "eventName", required: false, secret: false }],
    direction: "source",
    displayName: "Generic Webhook",
    healthCheck: { mode: "manifest", requiredConfigFields: [] },
    inputObjectKinds: ["raw_document", "raw_email"],
    kind: "webhook",
    outputArtifactKinds: ["normalized_json", "message_text"],
  },
  {
    authModes: ["oauth2"],
    capabilities: ["polling_ingest", "webhook_ingest", "health_check"],
    configFields: [
      { name: "label", required: false, secret: false },
      { name: "query", required: false, secret: false },
    ],
    direction: "source",
    displayName: "Gmail",
    healthCheck: { mode: "remote", requiredConfigFields: [] },
    inputObjectKinds: ["raw_email", "raw_attachment"],
    kind: "gmail",
    outputArtifactKinds: ["normalized_json", "message_text", "attachment_manifest"],
  },
  {
    authModes: ["oauth2"],
    capabilities: ["polling_ingest", "webhook_ingest", "health_check"],
    configFields: [
      { name: "mailbox", required: false, secret: false },
      { name: "filter", required: false, secret: false },
    ],
    direction: "source",
    displayName: "Microsoft Graph Mail",
    healthCheck: { mode: "remote", requiredConfigFields: [] },
    inputObjectKinds: ["raw_email", "raw_attachment"],
    kind: "microsoft_graph",
    outputArtifactKinds: ["normalized_json", "message_text", "attachment_manifest"],
  },
  {
    authModes: ["basic"],
    capabilities: ["polling_ingest", "health_check"],
    configFields: [
      { name: "host", required: true, secret: false },
      { name: "mailbox", required: false, secret: false },
    ],
    direction: "source",
    displayName: "IMAP Mailbox",
    healthCheck: { mode: "remote", requiredConfigFields: ["host"] },
    inputObjectKinds: ["raw_email", "raw_attachment"],
    kind: "imap",
    outputArtifactKinds: ["normalized_json", "message_text", "attachment_manifest"],
  },
  {
    authModes: ["api_key", "aws_iam"],
    capabilities: ["webhook_ingest", "push_object", "health_check"],
    configFields: [{ name: "region", required: false, secret: false }],
    direction: "source",
    displayName: "Amazon SES Inbound",
    healthCheck: { mode: "manifest", requiredConfigFields: [] },
    inputObjectKinds: ["raw_email", "raw_attachment"],
    kind: "ses",
    outputArtifactKinds: ["normalized_json", "message_text", "attachment_manifest"],
  },
  {
    authModes: ["api_key"],
    capabilities: ["webhook_ingest", "push_object", "health_check"],
    configFields: [],
    direction: "source",
    displayName: "Postmark Inbound",
    healthCheck: { mode: "manifest", requiredConfigFields: [] },
    inputObjectKinds: ["raw_email", "raw_attachment"],
    kind: "postmark",
    outputArtifactKinds: ["normalized_json", "message_text", "attachment_manifest"],
  },
  {
    authModes: ["api_key"],
    capabilities: ["webhook_ingest", "push_object", "health_check"],
    configFields: [],
    direction: "source",
    displayName: "Mailgun Routes",
    healthCheck: { mode: "manifest", requiredConfigFields: [] },
    inputObjectKinds: ["raw_email", "raw_attachment"],
    kind: "mailgun",
    outputArtifactKinds: ["normalized_json", "message_text", "attachment_manifest"],
  },
  {
    authModes: ["aws_iam"],
    capabilities: ["pull_object", "push_object", "artifact_sink", "health_check"],
    configFields: [
      { name: "bucket", required: true, secret: false },
      { name: "prefix", required: false, secret: false },
      { name: "region", required: false, secret: false },
    ],
    direction: "source_sink",
    displayName: "Amazon S3",
    healthCheck: { mode: "remote", requiredConfigFields: ["bucket"] },
    inputObjectKinds: ["raw_document"],
    kind: "s3",
    outputArtifactKinds: ["normalized_json", "processor_output"],
  },
  {
    authModes: ["cloudflare_binding", "api_key"],
    capabilities: ["pull_object", "push_object", "artifact_sink", "health_check"],
    configFields: [
      { name: "bucket", required: true, secret: false },
      { name: "prefix", required: false, secret: false },
    ],
    direction: "source_sink",
    displayName: "Cloudflare R2",
    healthCheck: { mode: "remote", requiredConfigFields: ["bucket"] },
    inputObjectKinds: ["raw_document"],
    kind: "r2",
    outputArtifactKinds: ["normalized_json", "processor_output"],
  },
] as const satisfies CarbotiConnectorManifest[];

export const carbotiHostedProcessorRuntimeManifests = [
  {
    defaultResourceLimits: {
      cpuMs: 30_000,
      maxInputBytes: 1_000_000,
      maxOutputBytes: 1_000_000,
      memoryMb: 128,
      networkPolicy: "egress_disabled",
      timeoutSeconds: 30,
    },
    displayName: "Cloudflare Workers",
    isolation: "worker",
    maxResourceLimits: {
      cpuMs: 300_000,
      maxInputBytes: 10_000_000,
      maxOutputBytes: 10_000_000,
      memoryMb: 128,
      networkPolicy: "egress_allowlist",
      timeoutSeconds: 300,
    },
    runtime: "cloudflare_workers",
  },
  {
    defaultResourceLimits: {
      cpuMs: 60_000,
      maxInputBytes: 1_000_000,
      maxOutputBytes: 1_000_000,
      memoryMb: 128,
      networkPolicy: "egress_disabled",
      timeoutSeconds: 60,
    },
    displayName: "Cloudflare Workflows",
    isolation: "workflow",
    maxResourceLimits: {
      cpuMs: 300_000,
      maxInputBytes: 10_000_000,
      maxOutputBytes: 10_000_000,
      memoryMb: 128,
      networkPolicy: "egress_allowlist",
      timeoutSeconds: 900,
    },
    runtime: "cloudflare_workflows",
  },
  {
    defaultResourceLimits: {
      cpuMs: 300_000,
      maxInputBytes: 10_000_000,
      maxOutputBytes: 10_000_000,
      memoryMb: 512,
      networkPolicy: "egress_allowlist",
      timeoutSeconds: 300,
    },
    displayName: "Cloudflare Containers",
    isolation: "container",
    maxResourceLimits: {
      cpuMs: 1_800_000,
      maxInputBytes: 100_000_000,
      maxOutputBytes: 100_000_000,
      memoryMb: 4096,
      networkPolicy: "egress_allowlist",
      timeoutSeconds: 1800,
    },
    runtime: "cloudflare_containers",
  },
  {
    defaultResourceLimits: {
      cpuMs: 30_000,
      maxInputBytes: 1_000_000,
      maxOutputBytes: 1_000_000,
      memoryMb: 128,
      networkPolicy: "egress_disabled",
      timeoutSeconds: 30,
    },
    displayName: "External Sandbox",
    isolation: "external",
    maxResourceLimits: {
      cpuMs: 300_000,
      maxInputBytes: 10_000_000,
      maxOutputBytes: 10_000_000,
      memoryMb: 1024,
      networkPolicy: "egress_allowlist",
      timeoutSeconds: 300,
    },
    runtime: "external_sandbox",
  },
] as const satisfies CarbotiHostedProcessorRuntimeManifest[];

export const CarbotiProcessorCapabilityManifestSchema = v.object({
  inputArtifactKinds: v.optional(v.array(CarbotiArtifactKindSchema)),
  inputObjectKinds: v.optional(v.array(CarbotiObjectKindSchema)),
  outputArtifactKinds: v.optional(v.array(CarbotiArtifactKindSchema)),
  permissions: v.optional(v.array(CarbotiProcessorPermissionSchema)),
});

export const CarbotiConnectorConfigFieldSchema = v.object({
  description: v.optional(v.string()),
  name: v.string(),
  required: v.boolean(),
  secret: v.boolean(),
});

export const CarbotiConnectorManifestSchema = v.object({
  authModes: v.array(CarbotiConnectorAuthModeSchema),
  capabilities: v.array(CarbotiConnectorCapabilitySchema),
  configFields: v.array(CarbotiConnectorConfigFieldSchema),
  direction: CarbotiConnectorDirectionSchema,
  displayName: v.string(),
  healthCheck: v.object({
    mode: v.picklist(["manifest", "remote", "none"]),
    requiredConfigFields: v.array(v.string()),
  }),
  inputObjectKinds: v.array(CarbotiObjectKindSchema),
  kind: v.union([CarbotiSourceKindSchema, CarbotiSinkKindSchema]),
  outputArtifactKinds: v.array(CarbotiArtifactKindSchema),
});

export const CarbotiHostedProcessorResourceLimitsSchema = v.object({
  cpuMs: v.optional(v.number()),
  maxInputBytes: v.optional(v.number()),
  maxOutputBytes: v.optional(v.number()),
  memoryMb: v.optional(v.number()),
  networkPolicy: v.optional(CarbotiHostedProcessorNetworkPolicySchema),
  timeoutSeconds: v.optional(v.number()),
});

export const CarbotiHostedProcessorRuntimeManifestSchema = v.object({
  defaultResourceLimits: v.object({
    cpuMs: v.number(),
    maxInputBytes: v.number(),
    maxOutputBytes: v.number(),
    memoryMb: v.number(),
    networkPolicy: CarbotiHostedProcessorNetworkPolicySchema,
    timeoutSeconds: v.number(),
  }),
  displayName: v.string(),
  isolation: v.picklist(["worker", "workflow", "container", "external"]),
  maxResourceLimits: v.object({
    cpuMs: v.number(),
    maxInputBytes: v.number(),
    maxOutputBytes: v.number(),
    memoryMb: v.number(),
    networkPolicy: CarbotiHostedProcessorNetworkPolicySchema,
    timeoutSeconds: v.number(),
  }),
  runtime: CarbotiHostedProcessorRuntimeSchema,
});

export type CarbotiProcessorCapabilityManifestInput = v.InferOutput<
  typeof CarbotiProcessorCapabilityManifestSchema
>;

export type CarbotiConnectorManifestInput = v.InferOutput<typeof CarbotiConnectorManifestSchema>;

export type CarbotiHostedProcessorResourceLimitsInput = v.InferOutput<
  typeof CarbotiHostedProcessorResourceLimitsSchema
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

export function getCarbotiConnectorManifest(
  kind: CarbotiSourceKind | CarbotiSinkKind,
): CarbotiConnectorManifest | null {
  return carbotiConnectorManifests.find((manifest) => manifest.kind === kind) ?? null;
}

export function parseCarbotiConnectorManifest(input: unknown): CarbotiConnectorManifest {
  return v.parse(CarbotiConnectorManifestSchema, input);
}

export function getCarbotiHostedProcessorRuntimeManifest(
  runtime: CarbotiHostedProcessorRuntime,
): CarbotiHostedProcessorRuntimeManifest {
  return (
    carbotiHostedProcessorRuntimeManifests.find((manifest) => manifest.runtime === runtime) ??
    carbotiHostedProcessorRuntimeManifests[0]
  );
}

export function normalizeCarbotiHostedProcessorResourceLimits(
  input: CarbotiHostedProcessorResourceLimitsInput = {},
  runtime: CarbotiHostedProcessorRuntime = "cloudflare_workers",
): CarbotiHostedProcessorResourceLimits {
  const manifest = getCarbotiHostedProcessorRuntimeManifest(runtime);
  const defaults = manifest.defaultResourceLimits;
  const max = manifest.maxResourceLimits;
  const requestedNetworkPolicy = input.networkPolicy ?? defaults.networkPolicy;
  const networkPolicy =
    networkPolicyRank(requestedNetworkPolicy) > networkPolicyRank(max.networkPolicy)
      ? max.networkPolicy
      : requestedNetworkPolicy;

  return {
    cpuMs: clampInteger(input.cpuMs, defaults.cpuMs, 1, max.cpuMs),
    maxInputBytes: clampInteger(input.maxInputBytes, defaults.maxInputBytes, 1, max.maxInputBytes),
    maxOutputBytes: clampInteger(
      input.maxOutputBytes,
      defaults.maxOutputBytes,
      1,
      max.maxOutputBytes,
    ),
    memoryMb: clampInteger(input.memoryMb, defaults.memoryMb, 1, max.memoryMb),
    networkPolicy,
    timeoutSeconds: clampInteger(
      input.timeoutSeconds,
      defaults.timeoutSeconds,
      1,
      max.timeoutSeconds,
    ),
  };
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

export function carbotiConnectorRawObjectKey(input: {
  filename: string;
  messageId: string;
  receivedAt: string;
  sourceId: string;
  sourceKind: CarbotiSourceKind;
}): string {
  const safeSourceKind = safeObjectKeySegment(input.sourceKind);
  const safeSourceId = safeObjectKeySegment(input.sourceId);
  const safeFilename = safeObjectKeySegment(input.filename);
  return `raw-connectors/${safeSourceKind}/${safeSourceId}/${input.receivedAt.slice(0, 10)}/${input.messageId}/${safeFilename}`;
}

function clampInteger(
  value: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (!Number.isFinite(value) || value === undefined) return fallback;
  return Math.min(Math.max(Math.trunc(value), minimum), maximum);
}

function safeObjectKeySegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function networkPolicyRank(policy: CarbotiHostedProcessorNetworkPolicy): number {
  if (policy === "egress_disabled") return 0;
  if (policy === "egress_allowlist") return 1;
  return 2;
}
