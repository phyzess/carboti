export function assertWorkerSchemaGuards(context) {
  const { assert, coreMigration } = context;

  assert(
    coreMigration.includes("password_credentials"),
    "core migration must include password credentials.",
  );
  assert(coreMigration.includes("token_hash"), "core migration must store token hashes.");
  assert(
    coreMigration.includes("password_reset_tokens") && coreMigration.includes("email_messages"),
    "auth email migration must include password reset tokens and email message metadata.",
  );
  assert(
    coreMigration.includes("inbound_email_messages") &&
      coreMigration.includes("inbound_email_attachments"),
    "inbound email migration must include receipt and attachment metadata tables.",
  );
  assert(
    coreMigration.includes("carboti_objects") &&
      coreMigration.includes("carboti_artifacts") &&
      coreMigration.includes("carboti_lineage_edges") &&
      coreMigration.includes("retry_of_delivery_id") &&
      coreMigration.includes("carboti_secret_refs") &&
      coreMigration.includes("ciphertext"),
    "Carboti migrations must include object, artifact, lineage, replayable delivery, and encrypted secret metadata tables.",
  );
  assert(
    coreMigration.includes("ALTER TABLE users ADD COLUMN role") &&
      coreMigration.includes("users_role_idx"),
    "user role migration must add users.role and its index.",
  );
  assert(
    coreMigration.includes("ai_advisory_artifacts") &&
      coreMigration.includes("ai_advisory_artifacts_job_idx") &&
      coreMigration.includes("ai_advisory_artifacts_status_idx"),
    "AI advisory migration must include advisory artifacts and query indexes.",
  );
  assert(
    coreMigration.includes("login_attempts") &&
      coreMigration.includes("import_job_events") &&
      coreMigration.includes("security_events") &&
      coreMigration.includes("alert_events"),
    "event foundation migration must include login attempts, import job events, security events, and alert events.",
  );
  assert(
    coreMigration.includes("content_hash"),
    "source file migration must include content_hash.",
  );
  assert(
    coreMigration.includes("failure_reason") && coreMigration.includes("processing_started_at"),
    "import job migration must include failure and processing state fields.",
  );
  assert(
    coreMigration.includes("adapter_id") &&
      coreMigration.includes("idempotency_key") &&
      coreMigration.includes("failure_class"),
    "import job migration must include adapter, idempotency, and structured failure fields.",
  );
  assert(
    coreMigration.includes("import_review_issues") &&
      coreMigration.includes("import_review_decisions") &&
      coreMigration.includes("import_review_record_decisions"),
    "review migration must include core review issue and decision tables.",
  );
  assert(
    coreMigration.includes("example_staged_records") &&
      coreMigration.includes("example_committed_records"),
    "review migration must include example-owned staging and commit tables.",
  );
}
