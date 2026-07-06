import type { WorkerImportAdapter } from "./import-adapters";
import { prepareImportJobCommittedStatements } from "./import-review-commit-job-statements";
import { prepareCommittedRecordStatements } from "./import-review-commit-record-statements";
import type { CommittedRecordPair } from "./import-review-commit-types";
import type { ImportJobReviewRow } from "./import-review-row-types";
import type { StoredStagedRecordRow } from "./import-review-store";

export type { CommittedRecordPair } from "./import-review-commit-types";

export function buildCommittedRecordPairs(input: {
  approvedRecords: StoredStagedRecordRow[];
  committedAt: string;
  committedBy: string;
  committedPayloads: unknown[];
}): CommittedRecordPair[] {
  return input.approvedRecords.map((record, index) => ({
    record,
    committedRecord: {
      id: crypto.randomUUID(),
      import_job_id: record.import_job_id,
      source_file_id: record.source_file_id,
      staged_record_key: record.staged_record_key,
      payload_json: JSON.stringify(input.committedPayloads[index]),
      committed_by: input.committedBy,
      committed_at: input.committedAt,
    },
  }));
}

export function prepareImportReviewCommitStatements(
  env: Env,
  input: {
    adapter: WorkerImportAdapter;
    committedAt: string;
    committedRecordPairs: CommittedRecordPair[];
    currentUserId: string;
    job: ImportJobReviewRow;
    jobId: string;
    jobStatusAfterCommit: string;
  },
): D1PreparedStatement[] {
  const committedCount = input.committedRecordPairs.length;
  return [
    ...input.committedRecordPairs.flatMap((pair) =>
      prepareCommittedRecordStatements(env, {
        adapter: input.adapter,
        committedAt: input.committedAt,
        currentUserId: input.currentUserId,
        jobId: input.jobId,
        pair,
      }),
    ),
    ...prepareImportJobCommittedStatements(env, {
      adapter: input.adapter,
      committedAt: input.committedAt,
      committedCount,
      currentUserId: input.currentUserId,
      job: input.job,
      jobId: input.jobId,
      jobStatusAfterCommit: input.jobStatusAfterCommit,
    }),
  ];
}
