import {
  stagedStatusForReviewAction,
  type ReviewRecordDecisionAction,
} from "@carboti/import-pipeline";
import { parseRequestJson, type AppContext } from "./http-utils";
import { ReviewDecisionInputSchema } from "./import-review-decision-input";
import { writeReviewRecordDecision } from "./import-review-decision-record";
import { readReviewDecisionTarget } from "./import-review-decision-target";
import { publicStagedRecord } from "./import-review-presenters";

export async function recordReviewDecisionResponse(
  context: AppContext,
  action: ReviewRecordDecisionAction,
): Promise<Response> {
  const input = await parseRequestJson(context, ReviewDecisionInputSchema);
  if (!input.ok) return input.response;

  const target = await readReviewDecisionTarget(context);
  if (!target.ok) return target.response;
  const { adapter, current, jobId, record } = target;

  const targetStatus = stagedStatusForReviewAction(action);
  if (record.review_status === targetStatus) {
    return context.json({
      record: publicStagedRecord(record),
      duplicate: true,
    });
  }

  const note = input.value.note ?? null;
  const decision = await writeReviewRecordDecision({
    action,
    adapter,
    context,
    current,
    jobId,
    note,
    record,
    targetStatus,
  });

  return context.json({
    record: publicStagedRecord(decision.record),
  });
}
