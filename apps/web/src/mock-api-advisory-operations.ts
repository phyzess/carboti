import type { AiAdvisoryArtifact } from "./types";
import { pushAudit, pushJobEvent } from "./mock-api-events";
import { shortId } from "./mock-api-identifiers";
import { requireAdvisory, requireUser } from "./mock-api-selectors";
import { writeState, type MockState } from "./mock-api-state";
import { nowIso } from "./mock-api-time";

export function generateAdvisoryForState(state: MockState, jobId: string) {
  const user = requireUser(state);
  const existing = (state.advisoriesByJobId[jobId] ?? []).find(
    (item) => item.status === "suggested",
  );
  if (existing) {
    return { advisory: existing, duplicate: true };
  }

  const advisory = createAdvisory(state, jobId, user.id);
  writeState(state);
  return { advisory };
}

export function createAdvisory(
  state: MockState,
  jobId: string,
  userId: string,
): AiAdvisoryArtifact {
  const records = state.recordsByJobId[jobId] ?? [];
  const pending = records.filter((record) => record.reviewStatus === "pending").length;
  const approved = records.filter((record) => record.reviewStatus === "approved").length;
  const advisory: AiAdvisoryArtifact = {
    confirmedAt: null,
    confirmedBy: null,
    createdAt: nowIso(),
    createdBy: userId,
    dismissedAt: null,
    dismissedBy: null,
    id: `demo-advisory-${shortId()}`,
    importJobId: jobId,
    kind: "import_review",
    model: "deterministic-demo",
    output: {
      approved,
      pending,
      recommendation: pending > 0 ? "review_pending_rows" : "commit_confirmed_rows",
    },
    promptVersion: "demo-v1",
    provider: "mock",
    status: "suggested",
    summary:
      pending > 0
        ? `${pending} pending row(s) still need human confirmation before commit.`
        : `${approved} confirmed row(s) look ready to commit.`,
  };
  state.advisoriesByJobId[jobId] = [advisory, ...(state.advisoriesByJobId[jobId] ?? [])];
  pushAudit(
    state,
    "ai_advisory.generated",
    { id: advisory.id, kind: "ai_advisory" },
    { importJobId: jobId, provider: "mock" },
    userId,
  );
  pushJobEvent(state, jobId, "ai_advisory.generated", "Mock advisory generated.", userId);
  return advisory;
}

export function confirmAdvisoryForState(
  state: MockState,
  jobId: string,
  advisoryId: string | undefined,
) {
  const user = requireUser(state);
  const advisory = requireAdvisory(state, jobId, advisoryId);
  advisory.status = "confirmed";
  advisory.confirmedAt = nowIso();
  advisory.confirmedBy = user.id;
  pushAudit(
    state,
    "ai_advisory.confirmed",
    { id: advisory.id, kind: "ai_advisory" },
    { importJobId: jobId },
    user.id,
  );
  pushJobEvent(state, jobId, "ai_advisory.confirmed", "Advisory confirmed.", user.id);
  writeState(state);
  return advisory;
}

export function dismissAdvisoryForState(
  state: MockState,
  jobId: string,
  advisoryId: string | undefined,
) {
  const user = requireUser(state);
  const advisory = requireAdvisory(state, jobId, advisoryId);
  advisory.status = "dismissed";
  advisory.dismissedAt = nowIso();
  advisory.dismissedBy = user.id;
  pushAudit(
    state,
    "ai_advisory.dismissed",
    { id: advisory.id, kind: "ai_advisory" },
    { importJobId: jobId },
    user.id,
  );
  pushJobEvent(state, jobId, "ai_advisory.dismissed", "Advisory dismissed.", user.id);
  writeState(state);
  return advisory;
}
