import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const aiAdvisoryArtifacts = sqliteTable(
  "ai_advisory_artifacts",
  {
    id: text("id").primaryKey(),
    importJobId: text("import_job_id").notNull(),
    kind: text("kind").notNull(),
    status: text("status").notNull(),
    provider: text("provider").notNull(),
    model: text("model").notNull(),
    promptVersion: text("prompt_version").notNull(),
    summary: text("summary").notNull(),
    outputJson: text("output_json").notNull(),
    createdBy: text("created_by").notNull(),
    createdAt: text("created_at").notNull(),
    confirmedBy: text("confirmed_by"),
    confirmedAt: text("confirmed_at"),
    dismissedBy: text("dismissed_by"),
    dismissedAt: text("dismissed_at"),
  },
  (table) => [
    index("ai_advisory_artifacts_job_idx").on(table.importJobId, table.createdAt),
    index("ai_advisory_artifacts_status_idx").on(table.status),
  ],
);
