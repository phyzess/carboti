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
      workerIntegration.includes("/api/carboti/openapi.json") &&
      workerIntegration.includes("/api/carboti/ingest/http") &&
      workerIntegration.includes("/api/carboti/api-clients") &&
      workerIntegration.includes("API client management creates") &&
      workerIntegration.includes("/api/carboti/secrets") &&
      workerIntegration.includes("secret refs can store connector credentials") &&
      workerIntegration.includes("/api/carboti/connectors/manifests") &&
      workerIntegration.includes("/api/carboti/connectors/sources") &&
      workerIntegration.includes("/api/carboti/connectors/sinks") &&
      workerIntegration.includes("connector_secret_inline_not_allowed") &&
      workerIntegration.includes("connector_secret_ref_not_found") &&
      workerIntegration.includes("raw-connectors/r2/") &&
      workerIntegration.includes("/download-url") &&
      workerIntegration.includes("/trace") &&
      workerIntegration.includes("/api/carboti/agent/artifacts/search") &&
      workerIntegration.includes("/api/carboti/mcp") &&
      workerIntegration.includes("/api/carboti/messages/") &&
      workerIntegration.includes("not_a_real_artifact") &&
      workerIntegration.includes("external.ledger.summary.v1") &&
      workerIntegration.includes("/api/carboti/processor-runtimes") &&
      workerIntegration.includes("/api/carboti/processors/external") &&
      workerIntegration.includes("/api/carboti/processors/hosted") &&
      workerIntegration.includes("/api/carboti/processor-deliveries/") &&
      workerIntegration.includes("x-carboti-signature") &&
      workerIntegration.includes("capabilityManifest") &&
      workerIntegration.includes("egress_allowlist") &&
      workerIntegration.includes("Hosted ledger extractor") &&
      workerIntegration.includes("processor_capability_violation") &&
      workerIntegration.includes("agent_context_bundle") &&
      workerIntegration.includes("carboti.retrieve_context") &&
      workerIntegration.includes("carboti.agent.context_bundle.created") &&
      workerIntegration.includes("signingSecretRef") &&
      workerIntegration.includes("carboti_secret_refs") &&
      workerIntegration.includes("processor_response_failed") &&
      workerIntegration.includes("delivery_not_retryable") &&
      workerIntegration.includes("retry_of_delivery_id") &&
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
    "Worker integration must exercise invite, member and invitation management, login, password reset, text adapter, JSON adapter, Carboti HTTP ingest/artifact/outbound processor/delivery retry/replay APIs, AI advisory, retry, review, approve, commit, and audit visibility.",
  );
  assert(
    workerIntegration.includes("DatabaseSync") &&
      workerIntegration.includes("FakeEmailSender") &&
      workerIntegration.includes("FakeR2Bucket") &&
      workerIntegration.includes("FakeQueue"),
    "Worker integration must provide local D1, Email, R2, and Queue fakes.",
  );
}
