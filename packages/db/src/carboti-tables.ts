import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const carbotiSources = sqliteTable(
  "carboti_sources",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    kind: text("kind").notNull(),
    name: text("name").notNull(),
    status: text("status").notNull(),
    configJson: text("config_json"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("carboti_sources_workspace_kind_idx").on(table.workspaceId, table.kind)],
);

export const carbotiPipelines = sqliteTable(
  "carboti_pipelines",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    sourceId: text("source_id").notNull(),
    name: text("name").notNull(),
    status: text("status").notNull(),
    configJson: text("config_json"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("carboti_pipelines_source_idx").on(table.sourceId, table.status)],
);

export const carbotiProcessorConfigs = sqliteTable(
  "carboti_processor_configs",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    kind: text("kind").notNull(),
    name: text("name").notNull(),
    endpointUrl: text("endpoint_url"),
    timeoutSeconds: integer("timeout_seconds"),
    status: text("status").notNull(),
    configJson: text("config_json"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("carboti_processor_configs_workspace_kind_idx").on(table.workspaceId, table.kind),
  ],
);

export const carbotiProcessorRuns = sqliteTable(
  "carboti_processor_runs",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    processorId: text("processor_id").notNull(),
    pipelineId: text("pipeline_id"),
    messageId: text("message_id"),
    status: text("status").notNull(),
    inputObjectId: text("input_object_id"),
    outputArtifactCount: integer("output_artifact_count").notNull().default(0),
    errorMessage: text("error_message"),
    startedAt: text("started_at").notNull(),
    completedAt: text("completed_at"),
  },
  (table) => [
    index("carboti_processor_runs_processor_started_idx").on(table.processorId, table.startedAt),
    index("carboti_processor_runs_message_started_idx").on(table.messageId, table.startedAt),
  ],
);

export const carbotiSecretRefs = sqliteTable(
  "carboti_secret_refs",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    kind: text("kind").notNull(),
    algorithm: text("algorithm").notNull(),
    keyVersion: text("key_version").notNull(),
    iv: text("iv").notNull(),
    ciphertext: text("ciphertext").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("carboti_secret_refs_workspace_kind_idx").on(
      table.workspaceId,
      table.kind,
      table.createdAt,
    ),
  ],
);

export const carbotiObjects = sqliteTable(
  "carboti_objects",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    kind: text("kind").notNull(),
    sourceId: text("source_id"),
    messageId: text("message_id"),
    objectKey: text("object_key"),
    contentType: text("content_type"),
    contentHash: text("content_hash"),
    size: integer("size"),
    dataJson: text("data_json"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("carboti_objects_workspace_kind_idx").on(table.workspaceId, table.kind, table.createdAt),
    index("carboti_objects_message_kind_idx").on(table.messageId, table.kind, table.createdAt),
    index("carboti_objects_object_key_idx").on(table.objectKey),
  ],
);

export const carbotiArtifacts = sqliteTable(
  "carboti_artifacts",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    kind: text("kind").notNull(),
    messageId: text("message_id"),
    processorRunId: text("processor_run_id"),
    schemaId: text("schema_id"),
    objectKey: text("object_key"),
    contentType: text("content_type"),
    contentHash: text("content_hash"),
    size: integer("size"),
    dataJson: text("data_json"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("carboti_artifacts_message_kind_idx").on(table.messageId, table.kind, table.createdAt),
    index("carboti_artifacts_processor_idx").on(table.processorRunId, table.createdAt),
  ],
);

export const carbotiLineageEdges = sqliteTable(
  "carboti_lineage_edges",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    fromObjectId: text("from_object_id").notNull(),
    toObjectId: text("to_object_id").notNull(),
    relation: text("relation").notNull(),
    processorRunId: text("processor_run_id"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("carboti_lineage_edges_from_idx").on(table.fromObjectId, table.createdAt),
    index("carboti_lineage_edges_to_idx").on(table.toObjectId, table.createdAt),
  ],
);

export const carbotiWebhookEndpoints = sqliteTable(
  "carboti_webhook_endpoints",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    url: text("url").notNull(),
    status: text("status").notNull(),
    secretRef: text("secret_ref"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("carboti_webhook_endpoints_workspace_status_idx").on(table.workspaceId, table.status),
  ],
);

export const carbotiWebhookDeliveries = sqliteTable(
  "carboti_webhook_deliveries",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id"),
    endpointId: text("endpoint_id").notNull(),
    processorId: text("processor_id"),
    processorRunId: text("processor_run_id"),
    messageId: text("message_id"),
    inputObjectId: text("input_object_id"),
    retryOfDeliveryId: text("retry_of_delivery_id"),
    eventType: text("event_type").notNull(),
    status: text("status").notNull(),
    attemptCount: integer("attempt_count").notNull().default(0),
    responseStatus: integer("response_status"),
    errorMessage: text("error_message"),
    nextAttemptAt: text("next_attempt_at"),
    deliveredAt: text("delivered_at"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("carboti_webhook_deliveries_endpoint_created_idx").on(table.endpointId, table.createdAt),
    index("carboti_webhook_deliveries_workspace_status_idx").on(
      table.workspaceId,
      table.status,
      table.createdAt,
    ),
    index("carboti_webhook_deliveries_processor_run_idx").on(table.processorRunId),
    index("carboti_webhook_deliveries_retry_idx").on(table.retryOfDeliveryId, table.createdAt),
  ],
);

export const carbotiApiClients = sqliteTable(
  "carboti_api_clients",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    name: text("name").notNull(),
    tokenHash: text("token_hash").notNull(),
    scopesJson: text("scopes_json").notNull(),
    status: text("status").notNull(),
    createdAt: text("created_at").notNull(),
    revokedAt: text("revoked_at"),
  },
  (table) => [
    uniqueIndex("carboti_api_clients_token_hash_idx").on(table.tokenHash),
    index("carboti_api_clients_workspace_status_idx").on(table.workspaceId, table.status),
  ],
);
