import type { MockState } from "./mock-api-state";
import { createSeedAuditEvents } from "./mock-api-seed-audit";
import { createSeedGraph } from "./mock-api-seed-graph";
import { createSeedInvitations } from "./mock-api-seed-invitations";
import { createSeedReview } from "./mock-api-seed-review";

export function seedState(): MockState {
  const graph = createSeedGraph();
  const review = createSeedReview(graph);

  return {
    ...review,
    auditEvents: createSeedAuditEvents(graph),
    currentUserId: graph.admin.id,
    importJobs: [graph.jobC, graph.jobB, graph.jobA],
    invitations: createSeedInvitations(),
    sourceFiles: [graph.sourceC, graph.sourceB, graph.sourceA],
    users: [graph.admin, graph.reviewer, graph.viewer],
  };
}
