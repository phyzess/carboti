import { assert } from "./worker-integration-http.mjs";

const expectedAuditActions = [
  "invitation.created",
  "invitation.accepted",
  "auth.login_succeeded",
  "auth.password_reset_requested",
  "auth.password_reset_succeeded",
  "source_file.uploaded",
  "import_job.queued",
  "import_review.record_staged",
  "import_review.record_approved",
  "import_review.record_committed",
  "import_job.committed",
  "import_job.source_missing",
  "import_job.retry_queued",
  "ai_advisory.generated",
  "ai_advisory.confirmed",
  "rbac.denied",
];

export async function assertAuditActionCoverage({ audit, client }) {
  const actions = new Set(audit.auditEvents.map((event) => event.action));
  for (const action of expectedAuditActions) {
    assert(actions.has(action), `audit list includes ${action}`);
  }

  const committedAudit = await client.json("/api/audit-events?action=import_job.committed");
  assert(
    committedAudit.auditEvents.length > 0 &&
      committedAudit.auditEvents.every((event) => event.action === "import_job.committed"),
    "audit list can filter by action",
  );
}
