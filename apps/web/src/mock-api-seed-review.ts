import { jobEvent, stagedRecord } from "./mock-api-model";
import { hoursAgo } from "./mock-api-time";
import type { MockSeedGraph } from "./mock-api-seed-graph";
import type { MockState } from "./mock-api-state";

export type MockSeedReview = Pick<
  MockState,
  "advisoriesByJobId" | "importJobEventsByJobId" | "issuesByJobId" | "recordsByJobId"
>;

export function createSeedReview(graph: MockSeedGraph): MockSeedReview {
  const { jobA, jobB, jobC } = graph;

  return {
    advisoriesByJobId: {
      [jobA.id]: [
        {
          confirmedAt: null,
          confirmedBy: null,
          createdAt: hoursAgo(1.8),
          createdBy: "demo-reviewer",
          dismissedAt: null,
          dismissedBy: null,
          id: "demo-advisory-1",
          importJobId: jobA.id,
          kind: "import_review",
          model: "deterministic-demo",
          output: {
            recommendation: "confirm_valid_rows",
            reviewNotes: ["One row has a validation issue and should stay visible for review."],
          },
          promptVersion: "demo-v1",
          provider: "mock",
          status: "suggested",
          summary:
            "Two rows look ready for confirmation. One row should stay under human review because its numeric value is outside the starter rule.",
        },
      ],
      [jobB.id]: [],
      [jobC.id]: [],
    },
    importJobEventsByJobId: {
      [jobA.id]: [
        jobEvent(jobA, "source_file.uploaded", null, "queued", "Source accepted.", hoursAgo(8.9)),
        jobEvent(
          jobA,
          "import_job.queued",
          "queued",
          "processing",
          "Import job queued.",
          hoursAgo(8.8),
        ),
        jobEvent(
          jobA,
          "import_job.needs_review",
          "processing",
          "needs_review",
          "Three staged records are ready for confirmation.",
          hoursAgo(8.4),
        ),
      ],
      [jobB.id]: [
        jobEvent(jobB, "source_file.uploaded", null, "queued", "Source accepted.", hoursAgo(4.8)),
        jobEvent(
          jobB,
          "import_review.records_approved",
          "needs_review",
          "approved",
          "All staged records confirmed.",
          hoursAgo(4.1),
        ),
      ],
      [jobC.id]: [
        jobEvent(jobC, "source_file.uploaded", null, "queued", "Source accepted.", hoursAgo(2.5)),
        jobEvent(
          jobC,
          "import_job.failed",
          "processing",
          "failed",
          "Adapter registration is missing in this mock scenario.",
          hoursAgo(2.1),
        ),
      ],
    },
    issuesByJobId: {
      [jobA.id]: [
        {
          code: "value_out_of_range",
          createdAt: hoursAgo(8.3),
          id: "demo-issue-1",
          importJobId: jobA.id,
          message: "Value is outside the starter adapter's accepted range.",
          severity: "warning",
          stagedRecordKey: "row:3",
          status: "open",
        },
      ],
      [jobB.id]: [],
      [jobC.id]: [],
    },
    recordsByJobId: {
      [jobA.id]: [
        stagedRecord(jobA, "demo-record-1", "row:1", { label: "Alpha", value: 1.12 }, "pending"),
        stagedRecord(jobA, "demo-record-2", "row:2", { label: "Beta", value: 0.87 }, "approved"),
        stagedRecord(jobA, "demo-record-3", "row:3", { label: "Gamma", value: 99.2 }, "pending"),
      ],
      [jobB.id]: [
        stagedRecord(jobB, "demo-record-4", "row:1", { label: "Delta", value: 2.41 }, "approved"),
        stagedRecord(jobB, "demo-record-5", "row:2", { label: "Epsilon", value: 3.02 }, "approved"),
      ],
      [jobC.id]: [],
    },
  };
}
