import type { CommitApprovedContext } from "@carboti/import-pipeline";
import type { CurrentUser } from "./auth-types";
import { authError, type AppContext } from "./http-utils";
import type { WorkerImportAdapter } from "./import-adapters";
import {
  buildCommittedRecordPairs,
  prepareImportReviewCommitStatements,
} from "./import-review-commit-persistence";
import { parseJsonValue } from "./import-review-presenters";
import type { ImportJobReviewRow } from "./import-review-row-types";
import { readImportJobStatusAfterCommit } from "./import-review-status";
import type { StoredCommittedRecordRow, StoredStagedRecordRow } from "./import-review-store";

type CommitApprovedRecordsResult =
  | {
      ok: true;
      committedAt: string;
      committedRecords: StoredCommittedRecordRow[];
      status: string;
    }
  | {
      ok: false;
      response: Response;
    };

export async function commitApprovedRecords(input: {
  adapter: WorkerImportAdapter;
  approvedRecords: StoredStagedRecordRow[];
  context: AppContext;
  current: CurrentUser;
  job: ImportJobReviewRow;
  jobId: string;
}): Promise<CommitApprovedRecordsResult> {
  const { adapter, approvedRecords, context, current, job, jobId } = input;
  const committedAt = new Date().toISOString();
  const commitContext: CommitApprovedContext = {
    importJobId: jobId,
    reviewerId: current.user.id,
    approvedStagedRecordKeys: approvedRecords.map((record) => record.staged_record_key),
    idempotencyKey: `commit:${jobId}`,
  };
  const committedPayloads = await adapter.commitApproved(
    approvedRecords.map((record) => parseJsonValue(record.payload_json)),
    commitContext,
  );

  if (committedPayloads.length !== approvedRecords.length) {
    return {
      ok: false,
      response: authError(
        context,
        "commit_result_mismatch",
        "Import adapter returned a mismatched number of committed records.",
        409,
      ),
    };
  }

  const committedRecordPairs = buildCommittedRecordPairs({
    approvedRecords,
    committedAt,
    committedBy: current.user.id,
    committedPayloads,
  });
  const committedRecords = committedRecordPairs.map(({ committedRecord }) => committedRecord);
  const jobStatusAfterCommit = await readImportJobStatusAfterCommit(
    context.env,
    adapter.reviewStore,
    jobId,
    committedRecords.length,
  );

  await context.env.DB.batch(
    prepareImportReviewCommitStatements(context.env, {
      adapter,
      committedAt,
      committedRecordPairs,
      currentUserId: current.user.id,
      job,
      jobId,
      jobStatusAfterCommit,
    }),
  );

  return {
    ok: true,
    committedAt,
    committedRecords,
    status: jobStatusAfterCommit,
  };
}
