import { authError, type AppContext } from "./http-utils";
import { commitApprovedRecords } from "./import-review-commit-records";
import { readImportReviewCommitTarget } from "./import-review-commit-target";
import { publicCommittedRecord } from "./import-review-presenters";

export async function commitApprovedReviewRecordsResponse(context: AppContext): Promise<Response> {
  const target = await readImportReviewCommitTarget(context);
  if (!target.ok) return target.response;
  const { adapter, current, job, jobId } = target;

  const approvedRecords = await adapter.reviewStore.readApprovedStagedRecords(context.env, jobId);
  if (approvedRecords.length === 0) {
    const committedRecords = await adapter.reviewStore.readCommittedRecords(context.env, jobId);

    if (committedRecords.length > 0) {
      return context.json({
        importJobId: jobId,
        status: job.status,
        duplicate: true,
        committedRecords: committedRecords.map(publicCommittedRecord),
      });
    }

    return authError(
      context,
      "no_approved_records",
      "No approved staged records are available to commit.",
      409,
    );
  }

  const commitResult = await commitApprovedRecords({
    adapter,
    approvedRecords,
    context,
    current,
    job,
    jobId,
  });
  if (!commitResult.ok) return commitResult.response;

  return context.json({
    importJobId: jobId,
    status: commitResult.status,
    committedRecords: commitResult.committedRecords.map(publicCommittedRecord),
  });
}
