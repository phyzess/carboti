export function assertWorkerIntegrationCoverageGuards(context) {
  const { assert, workerIntegration } = context;

  assert(
    workerIntegration.includes("/api/bootstrap/invitations") &&
      workerIntegration.includes("viewer@example.com") &&
      workerIntegration.includes("source_file:upload") &&
      workerIntegration.includes("rbac.denied") &&
      workerIntegration.includes("/api/users") &&
      workerIntegration.includes("/api/auth/login") &&
      workerIntegration.includes("/api/auth/password-reset/request") &&
      workerIntegration.includes("/api/auth/password-reset/confirm") &&
      workerIntegration.includes("/api/source-files") &&
      workerIntegration.includes("/api/carboti/ingest/http") &&
      workerIntegration.includes("/api/carboti/messages/") &&
      workerIntegration.includes("not_a_real_artifact") &&
      workerIntegration.includes("external.ledger.summary.v1") &&
      workerIntegration.includes("carboti_api_clients") &&
      workerIntegration.includes("raw-http/") &&
      workerIntegration.includes("fixture-invalid-number.txt") &&
      workerIntegration.includes("invalid_number") &&
      workerIntegration.includes("/api/bootstrap/local-reviewer") &&
      workerIntegration.includes("/api/bootstrap/local-admin") &&
      workerIntegration.includes("local demo credentials log in") &&
      workerIntegration.includes("local demo admin can list users") &&
      workerIntegration.includes("fixture-json-records.json") &&
      workerIntegration.includes("starter.json-records") &&
      workerIntegration.includes("commitKey") &&
      workerIntegration.includes("/advisories") &&
      workerIntegration.includes("ai_advisory.generated") &&
      workerIntegration.includes("ai_advisory.confirmed") &&
      workerIntegration.includes("/retry") &&
      workerIntegration.includes("/review") &&
      workerIntegration.includes("/review/confirm-pending") &&
      workerIntegration.includes("/approve") &&
      workerIntegration.includes("/commit") &&
      workerIntegration.includes("admin can list invitations") &&
      workerIntegration.includes("/api/audit-events"),
    "Worker integration must exercise invite, member and invitation management, login, password reset, text adapter, JSON adapter, Carboti HTTP ingest/artifact/replay APIs, AI advisory, retry, review, approve, commit, and audit visibility.",
  );
  assert(
    workerIntegration.includes("DatabaseSync") &&
      workerIntegration.includes("FakeEmailSender") &&
      workerIntegration.includes("FakeR2Bucket") &&
      workerIntegration.includes("FakeQueue"),
    "Worker integration must provide local D1, Email, R2, and Queue fakes.",
  );
}
