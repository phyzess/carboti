import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const emailMessages = sqliteTable(
  "email_messages",
  {
    id: text("id").primaryKey(),
    kind: text("kind").notNull(),
    recipientEmail: text("recipient_email").notNull(),
    subject: text("subject").notNull(),
    status: text("status").notNull(),
    provider: text("provider").notNull(),
    providerMessageId: text("provider_message_id"),
    errorMessage: text("error_message"),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at").notNull(),
    sentAt: text("sent_at"),
  },
  (table) => [
    index("email_messages_recipient_status_idx").on(table.recipientEmail, table.status),
    index("email_messages_kind_status_idx").on(table.kind, table.status),
  ],
);

export const inboundEmailMessages = sqliteTable(
  "inbound_email_messages",
  {
    id: text("id").primaryKey(),
    fromEmail: text("from_email").notNull(),
    toEmail: text("to_email").notNull(),
    subject: text("subject"),
    rawObjectKey: text("raw_object_key").notNull(),
    rawSize: integer("raw_size").notNull(),
    attachmentCount: integer("attachment_count").notNull(),
    status: text("status").notNull(),
    metadataJson: text("metadata_json"),
    receivedAt: text("received_at").notNull(),
  },
  (table) => [index("inbound_email_messages_received_idx").on(table.receivedAt)],
);

export const inboundEmailAttachments = sqliteTable(
  "inbound_email_attachments",
  {
    id: text("id").primaryKey(),
    inboundEmailId: text("inbound_email_id").notNull(),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    sourceFileId: text("source_file_id"),
    importJobId: text("import_job_id"),
    objectKey: text("object_key"),
    status: text("status").notNull(),
    errorMessage: text("error_message"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("inbound_email_attachments_email_idx").on(table.inboundEmailId, table.createdAt),
    index("inbound_email_attachments_source_idx").on(table.sourceFileId),
  ],
);
