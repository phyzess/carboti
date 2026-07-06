import { importJob, sourceFile, user } from "./mock-api-model";
import { hoursAgo } from "./mock-api-time";
import type { ApiUser, ImportJobListItem, SourceFile } from "./types";

export type MockSeedGraph = {
  admin: ApiUser;
  jobA: ImportJobListItem;
  jobB: ImportJobListItem;
  jobC: ImportJobListItem;
  reviewer: ApiUser;
  sourceA: SourceFile;
  sourceB: SourceFile;
  sourceC: SourceFile;
  viewer: ApiUser;
};

export function createSeedGraph(): MockSeedGraph {
  const admin = user("demo-admin", "admin@example.com", "admin", "Demo Admin", hoursAgo(72));
  const reviewer = user(
    "demo-reviewer",
    "reviewer@example.com",
    "reviewer",
    "Demo Operator",
    hoursAgo(70),
  );
  const viewer = user("demo-viewer", "viewer@example.com", "viewer", "Demo Viewer", hoursAgo(68));
  const sourceA = sourceFile(
    "demo-source-1",
    "demo-intake-alpha.txt",
    "mock/source-files/demo-intake-alpha.txt",
    "mock-hash-alpha",
    1420,
    admin.id,
    hoursAgo(9),
  );
  const sourceB = sourceFile(
    "demo-source-2",
    "demo-intake-beta.json",
    "mock/source-files/demo-intake-beta.json",
    "mock-hash-beta",
    2088,
    reviewer.id,
    hoursAgo(5),
    "application/json",
  );
  const sourceC = sourceFile(
    "demo-source-3",
    "demo-intake-needs-adapter.csv",
    "mock/source-files/demo-intake-needs-adapter.csv",
    "mock-hash-gamma",
    912,
    reviewer.id,
    hoursAgo(2),
    "text/csv",
  );
  const jobA = importJob("demo-job-1", sourceA, "needs_review", admin.id, hoursAgo(8));
  const jobB = importJob("demo-job-2", sourceB, "approved", reviewer.id, hoursAgo(4));
  const jobC = importJob("demo-job-3", sourceC, "failed", reviewer.id, hoursAgo(2), {
    failureClass: "adapter_missing",
    failureReason: "No app-owned adapter was registered for this mock content type.",
  });

  return { admin, jobA, jobB, jobC, reviewer, sourceA, sourceB, sourceC, viewer };
}
