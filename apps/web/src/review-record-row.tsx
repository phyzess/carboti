import { Button, StatusBadge, TableCell, TableRow } from "@carboti/ui";
import { Check, X } from "lucide-react";
import { useI18n } from "./i18n";
import { payloadSummary, statusTone } from "./review-console-helpers";
import type { ReviewIssue, StagedRecord } from "./types";

export function ReviewRecordRow(props: {
  canDecide: boolean;
  issue: ReviewIssue | null;
  record: StagedRecord;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { formatStatus, t } = useI18n();
  const disabled = props.record.reviewStatus === "committed" || !props.canDecide;

  return (
    <TableRow>
      <TableCell edge="start">
        <div className="text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
          {props.record.sourceRowKey}
        </div>
        <div className="mt-1 max-w-[180px] truncate text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
          {props.record.stagedRecordKey}
        </div>
      </TableCell>
      <TableCell>
        <div className="qitu-number max-w-[160px] truncate text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)]">
          {payloadSummary(props.record.payload)}
        </div>
      </TableCell>
      <TableCell className="max-w-[190px]">
        <div className="text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
          {props.issue?.message ?? t("review.noIssue")}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge tone={statusTone(props.record.reviewStatus)}>
          {formatStatus(props.record.reviewStatus)}
        </StatusBadge>
      </TableCell>
      <TableCell className="text-right" edge="end">
        <div className="flex justify-end gap-2">
          <Button
            aria-label={t("action.rejectRecord")}
            className="size-8 px-0"
            disabled={disabled}
            size="sm"
            title={t("action.rejectRecord")}
            variant="ghost"
            onClick={props.onReject}
          >
            <X size={14} />
          </Button>
          <Button
            aria-label={t("action.approveRecord")}
            className="size-8 px-0"
            disabled={disabled}
            size="sm"
            title={t("action.approveRecord")}
            variant="secondary"
            onClick={props.onApprove}
          >
            <Check size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
