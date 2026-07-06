import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const auditEvents = sqliteTable("audit_events", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  actorId: text("actor_id").notNull(),
  actorKind: text("actor_kind").notNull(),
  subjectId: text("subject_id").notNull(),
  subjectKind: text("subject_kind").notNull(),
  metadataJson: text("metadata_json"),
  occurredAt: text("occurred_at").notNull(),
});

export const securityEvents = sqliteTable(
  "security_events",
  {
    id: text("id").primaryKey(),
    eventType: text("event_type").notNull(),
    severity: text("severity").notNull(),
    actorUserId: text("actor_user_id"),
    targetUserId: text("target_user_id"),
    action: text("action").notNull(),
    outcome: text("outcome").notNull(),
    requestId: text("request_id"),
    sessionId: text("session_id"),
    ipHash: text("ip_hash"),
    userAgentHash: text("user_agent_hash"),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("security_events_type_created_idx").on(table.eventType, table.createdAt),
    index("security_events_actor_created_idx").on(table.actorUserId, table.createdAt),
  ],
);

export const alertEvents = sqliteTable(
  "alert_events",
  {
    id: text("id").primaryKey(),
    severity: text("severity").notNull(),
    alertType: text("alert_type").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    title: text("title").notNull(),
    message: text("message"),
    status: text("status").notNull(),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at").notNull(),
    acknowledgedByUserId: text("acknowledged_by_user_id"),
    acknowledgedAt: text("acknowledged_at"),
    resolvedAt: text("resolved_at"),
  },
  (table) => [
    index("alert_events_status_created_idx").on(table.status, table.createdAt),
    index("alert_events_entity_created_idx").on(table.entityType, table.entityId, table.createdAt),
  ],
);
