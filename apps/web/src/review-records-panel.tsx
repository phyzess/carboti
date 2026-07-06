import { AnimatedIcon, Button, SectionHeader, Surface } from "@carboti/ui";
import { Check } from "lucide-react";
import { useI18n } from "./i18n";
import { PermissionHint } from "./review-console-parts";
import type { ReviewCounts } from "./review-console-types";
import { ReviewRecordsTable } from "./review-records-table";
import type { ImportJobListItem, ReviewIssue, StagedRecord } from "./types";

export function ReviewRecordsPanel(props: {
  canCommit: boolean;
  canDecideReviews: boolean;
  canRetry: boolean;
  counts: ReviewCounts;
  isBusy: boolean;
  onCommitApproved: () => void;
  onConfirmPendingRecords: () => void;
  onDecide: (recordId: string, status: "approved" | "rejected") => void;
  onRetrySelectedJob: () => void;
  retryAvailable: boolean;
  reviewIssues: ReviewIssue[];
  reviewRecords: StagedRecord[];
  selectedJob: ImportJobListItem | null;
  selectedJobId: string | null;
}) {
  const { t } = useI18n();

  return (
    <Surface className="min-h-[640px] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-[var(--qitu-space-s1)] py-[var(--qitu-space-s0)]">
        <SectionHeader
          description={
            props.selectedJob ? props.selectedJob.sourceFile.filename : t("review.noJobSelected")
          }
          icon={<AnimatedIcon name="reviews" size={16} />}
          title={t("review.stagedRecords")}
        />
        <div className="flex flex-wrap gap-2">
          {props.retryAvailable ? (
            <Button
              disabled={props.isBusy || !props.canRetry}
              size="sm"
              variant="secondary"
              onClick={props.onRetrySelectedJob}
            >
              <AnimatedIcon name="refresh" size={14} /> {t("action.retryJob")}
            </Button>
          ) : null}
          <Button
            disabled={!props.canCommit || props.isBusy}
            size="sm"
            onClick={props.onCommitApproved}
          >
            <AnimatedIcon name="database" size={14} /> {t("action.commitApproved")}
          </Button>
          <Button
            disabled={!props.canDecideReviews || props.counts.pending === 0 || props.isBusy}
            size="sm"
            variant="secondary"
            onClick={props.onConfirmPendingRecords}
          >
            <Check size={14} /> {t("action.confirmPending")}
          </Button>
        </div>
      </div>
      {!props.canCommit && props.selectedJobId && props.counts.approved > 0 ? (
        <div className="px-[var(--qitu-space-s1)] pb-[var(--qitu-space-s0)]">
          <PermissionHint label={t("permission.importCommit")} />
        </div>
      ) : null}
      {!props.canDecideReviews && props.reviewRecords.length > 0 ? (
        <div className="px-[var(--qitu-space-s1)] pb-[var(--qitu-space-s0)]">
          <PermissionHint label={t("permission.reviewDecide")} />
        </div>
      ) : null}

      <ReviewRecordsTable
        canDecideReviews={props.canDecideReviews}
        onDecide={props.onDecide}
        reviewIssues={props.reviewIssues}
        reviewRecords={props.reviewRecords}
      />
    </Surface>
  );
}
