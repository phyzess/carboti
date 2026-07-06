import { auditEvent } from "./mock-api-model";
import type { MockSeedGraph } from "./mock-api-seed-graph";
import type { MockState } from "./mock-api-state";

export function createSeedAuditEvents(graph: MockSeedGraph): MockState["auditEvents"] {
  const { admin, jobA, jobC, reviewer, sourceA } = graph;

  return [
    auditEvent(
      "audit-demo-1",
      "ai_advisory.generated",
      admin.id,
      "ai_advisory",
      "demo-advisory-1",
      {
        importJobId: jobA.id,
        mode: "mock",
      },
    ),
    auditEvent(
      "audit-demo-2",
      "import_review.record_approved",
      reviewer.id,
      "example_staged_record",
      "demo-record-2",
      {
        importJobId: jobA.id,
        stagedRecordKey: "row:2",
      },
    ),
    auditEvent("audit-demo-3", "import_job.failed", reviewer.id, "import_job", jobC.id, {
      failureClass: "adapter_missing",
    }),
    auditEvent("audit-demo-4", "source_file.uploaded", admin.id, "source_file", sourceA.id, {
      contentHash: sourceA.contentHash,
    }),
    auditEvent(
      "audit-demo-5",
      "invitation.email_requested",
      admin.id,
      "invitation",
      "demo-invitation-1",
      {
        delivery: "mock",
      },
    ),
  ];
}
