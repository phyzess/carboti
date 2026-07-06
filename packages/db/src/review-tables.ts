import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const importReviewIssues = sqliteTable(
  "import_review_issues",
  {
    id: text("id").primaryKey(),
    importJobId: text("import_job_id").notNull(),
    stagedRecordKey: text("staged_record_key").notNull(),
    code: text("code").notNull(),
    message: text("message").notNull(),
    severity: text("severity").notNull(),
    status: text("status").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("import_review_issues_job_idx").on(table.importJobId),
    index("import_review_issues_record_idx").on(table.importJobId, table.stagedRecordKey),
    uniqueIndex("import_review_issues_job_record_code_idx").on(
      table.importJobId,
      table.stagedRecordKey,
      table.code,
    ),
  ],
);

export const importReviewDecisions = sqliteTable(
  "import_review_decisions",
  {
    id: text("id").primaryKey(),
    importJobId: text("import_job_id").notNull(),
    action: text("action").notNull(),
    reviewerUserId: text("reviewer_user_id").notNull(),
    note: text("note"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("import_review_decisions_job_idx").on(table.importJobId)],
);

export const importReviewRecordDecisions = sqliteTable(
  "import_review_record_decisions",
  {
    id: text("id").primaryKey(),
    decisionId: text("decision_id").notNull(),
    importJobId: text("import_job_id").notNull(),
    stagedRecordKey: text("staged_record_key").notNull(),
    action: text("action").notNull(),
    note: text("note"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("import_review_record_decisions_job_idx").on(table.importJobId),
    index("import_review_record_decisions_record_idx").on(table.importJobId, table.stagedRecordKey),
  ],
);
