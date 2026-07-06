export function assertOperationsRecoveryGuards(context) {
  const {
    assert,
    cleanupLocalSmoke,
    deployment,
    dlqRunbook,
    emailDeliverabilityDoc,
    operatorAdminInvitation,
    opsFailedJobs,
  } = context;

  assert(
    opsFailedJobs.includes("wrangler") &&
      opsFailedJobs.includes("d1") &&
      opsFailedJobs.includes("execute") &&
      opsFailedJobs.includes("status IN ('failed', 'queued', 'processing')") &&
      opsFailedJobs.includes("failure_class") &&
      opsFailedJobs.includes("--remote"),
    "ops:failed-jobs must provide a read-only D1 snapshot for failed and suspicious import jobs.",
  );
  assert(
    deployment.includes("docs/operations/dlq-remediation.md") &&
      deployment.includes("vp run ops:failed-jobs") &&
      deployment.includes("does not attach an automatic DLQ consumer"),
    "deployment docs must point to the DLQ remediation runbook and avoid automatic DLQ replay in the starter.",
  );
  assert(
    deployment.includes("docs/operations/email-deliverability.md") &&
      emailDeliverabilityDoc.includes("SPF") &&
      emailDeliverabilityDoc.includes("DKIM") &&
      emailDeliverabilityDoc.includes("DMARC") &&
      emailDeliverabilityDoc.includes("workers.dev") &&
      emailDeliverabilityDoc.includes("MAIL_FROM") &&
      emailDeliverabilityDoc.includes("PUBLIC_APP_URL"),
    "deployment docs must link the email deliverability runbook covering DNS auth, sender config, and temporary-domain avoidance.",
  );
  assert(
    dlqRunbook.includes("Cloudflare sends messages to a DLQ") &&
      dlqRunbook.includes("vp run ops:failed-jobs") &&
      dlqRunbook.includes("import_job:retry") &&
      dlqRunbook.includes("Do not update `import_jobs.status` manually") &&
      dlqRunbook.includes("carboti-import-jobs-production-dlq"),
    "DLQ remediation runbook must document triage, retry permissions, no direct SQL updates, and queue names.",
  );
  assert(
    opsFailedJobs.includes("spawn(") &&
      !opsFailedJobs.includes("spawnSync") &&
      opsFailedJobs.includes('"success": true'),
    "ops:failed-jobs must release Wrangler D1 execute after the success marker.",
  );
  assert(
    cleanupLocalSmoke.includes("carboti-dev") &&
      cleanupLocalSmoke.includes("--local") &&
      cleanupLocalSmoke.includes("browser-smoke-%") &&
      cleanupLocalSmoke.includes("reviewer-%@example.com") &&
      cleanupLocalSmoke.includes("--dry-run") &&
      !cleanupLocalSmoke.includes("production"),
    "ops:cleanup-local-smoke must only clean local smoke/demo rows and support dry-run.",
  );
  assert(
    operatorAdminInvitation.includes("carboti-preview") &&
      operatorAdminInvitation.includes("carboti-production") &&
      operatorAdminInvitation.includes("QITU_PRODUCTION_APP_URL") &&
      operatorAdminInvitation.includes("INSERT INTO invitations") &&
      operatorAdminInvitation.includes("INSERT INTO audit_events") &&
      operatorAdminInvitation.includes('role: "admin"') &&
      operatorAdminInvitation.includes("hashSecret") &&
      operatorAdminInvitation.includes("--dry-run") &&
      operatorAdminInvitation.includes("publicAppUrlValidationError") &&
      operatorAdminInvitation.includes("workers.dev") &&
      !operatorAdminInvitation.includes("password_credentials") &&
      !operatorAdminInvitation.includes("INSERT INTO users"),
    "ops:create-admin-invite must create an audited admin invitation without directly creating users or passwords.",
  );
}
