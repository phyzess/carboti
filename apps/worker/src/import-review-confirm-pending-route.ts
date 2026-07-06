import { parseRequestJson, type AppContext } from "./http-utils";
import { writeConfirmPendingReviewRecords } from "./import-review-confirm-pending-records";
import {
  readConfirmPendingReviewer,
  readConfirmPendingTarget,
} from "./import-review-confirm-pending-target";
import { ReviewDecisionInputSchema } from "./import-review-decision-input";
import { publicStagedRecord } from "./import-review-presenters";

export async function confirmPendingReviewRecordsResponse(context: AppContext): Promise<Response> {
  const reviewer = await readConfirmPendingReviewer(context);
  if (!reviewer.ok) return reviewer.response;

  const input = await parseRequestJson(context, ReviewDecisionInputSchema);
  if (!input.ok) return input.response;

  const target = await readConfirmPendingTarget(context);
  if (!target.ok) return target.response;
  const { adapter, job, jobId, pendingRecords } = target;

  if (pendingRecords.length === 0) {
    return context.json({
      importJobId: jobId,
      status: job.status,
      confirmedCount: 0,
      records: [],
      duplicate: true,
    });
  }

  const confirmation = await writeConfirmPendingReviewRecords({
    adapter,
    context,
    current: reviewer.current,
    job,
    jobId,
    note: input.value.note ?? null,
    pendingRecords,
  });

  return context.json({
    importJobId: jobId,
    status: confirmation.status,
    confirmedCount: confirmation.confirmedCount,
    records: confirmation.records.map(publicStagedRecord),
  });
}
