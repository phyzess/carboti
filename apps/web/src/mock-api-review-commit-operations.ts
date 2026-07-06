import { pushAudit, pushJobEvent } from "./mock-api-events";
import { shortId } from "./mock-api-identifiers";
import { recalculateJobStatus } from "./mock-api-import-job-status";
import { requireJob } from "./mock-api-selectors";
import type { MockState } from "./mock-api-state";
import { nowIso } from "./mock-api-time";

export function commitJob(state: MockState, jobId: string, userId: string) {
  const job = requireJob(state, jobId);
  const records = state.recordsByJobId[jobId] ?? [];
  const committedRecords = [];
  for (const record of records) {
    if (record.reviewStatus === "approved") {
      record.reviewStatus = "committed";
      record.committedRecordId = `demo-committed-${shortId()}`;
      record.updatedAt = nowIso();
      committedRecords.push(record.payload);
    }
  }
  recalculateJobStatus(state, job, userId);
  pushAudit(
    state,
    "import_job.committed",
    { id: job.id, kind: "import_job" },
    { committedCount: committedRecords.length },
    userId,
  );
  pushJobEvent(state, jobId, "import_job.committed", "Confirmed records committed.", userId);
  return {
    committedRecords,
    importJobId: job.id,
    status: job.status,
  };
}
