import type { StagedRecord } from "./types";
import { pushAudit, pushJobEvent } from "./mock-api-events";
import { requestError } from "./mock-api-http";
import { recalculateJobStatus } from "./mock-api-import-job-status";
import { requireJob, requireUser } from "./mock-api-selectors";
import { writeState, type MockState } from "./mock-api-state";
import { nowIso } from "./mock-api-time";

export function confirmPendingRecordsForState(state: MockState, jobId: string) {
  const user = requireUser(state);
  const result = confirmPendingRecords(state, jobId, user.id);
  writeState(state);
  return result;
}

export function confirmPendingRecords(state: MockState, jobId: string, userId: string) {
  const job = requireJob(state, jobId);
  const records = state.recordsByJobId[jobId] ?? [];
  let confirmedCount = 0;
  for (const record of records) {
    if (record.reviewStatus === "pending") {
      record.reviewStatus = "approved";
      record.updatedAt = nowIso();
      confirmedCount += 1;
    }
  }
  recalculateJobStatus(state, job, userId);
  pushAudit(
    state,
    "import_review.records_approved",
    { id: job.id, kind: "import_job" },
    { confirmedCount },
    userId,
  );
  pushJobEvent(
    state,
    jobId,
    "import_review.records_approved",
    "Pending records approved in demo.",
    userId,
  );
  return {
    confirmedCount,
    importJobId: job.id,
    records,
    status: job.status,
  };
}

export function decideRecordForState(
  state: MockState,
  jobId: string,
  recordId: string,
  reviewStatus: "approved" | "rejected",
) {
  const user = requireUser(state);
  const record = decideRecord(state, jobId, recordId, reviewStatus, user.id);
  writeState(state);
  return record;
}

export function decideRecord(
  state: MockState,
  jobId: string,
  recordId: string,
  reviewStatus: "approved" | "rejected",
  userId: string,
): StagedRecord {
  const job = requireJob(state, jobId);
  const record = (state.recordsByJobId[jobId] ?? []).find((item) => item.id === recordId);
  if (!record) {
    throw requestError(404, "staged_record_not_found", "Staged record was not found.");
  }
  record.reviewStatus = reviewStatus;
  record.updatedAt = nowIso();
  recalculateJobStatus(state, job, userId);
  pushAudit(
    state,
    `import_review.record_${reviewStatus}`,
    { id: record.id, kind: "example_staged_record" },
    { importJobId: jobId, stagedRecordKey: record.stagedRecordKey },
    userId,
  );
  pushJobEvent(
    state,
    jobId,
    `import_review.record_${reviewStatus}`,
    `Staged record ${reviewStatus}.`,
    userId,
  );
  return record;
}
