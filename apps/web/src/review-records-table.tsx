import { Table, TableBody, TableHead, TableHeader, TableRow, TableScrollArea } from "@carboti/ui";
import { useI18n } from "./i18n";
import { issueForRecord } from "./review-console-helpers";
import { ReviewRecordRow } from "./review-record-row";
import { ReviewRecordsEmptyState } from "./review-records-empty-state";
import type { ReviewIssue, StagedRecord } from "./types";

export function ReviewRecordsTable(props: {
  canDecideReviews: boolean;
  onDecide: (recordId: string, status: "approved" | "rejected") => void;
  reviewIssues: ReviewIssue[];
  reviewRecords: StagedRecord[];
}) {
  const { t } = useI18n();

  return (
    <TableScrollArea variant="bounded">
      <Table>
        <colgroup>
          <col className="w-[22%]" />
          <col className="w-[24%]" />
          <col className="w-[28%]" />
          <col className="w-[12%]" />
          <col className="w-[14%]" />
        </colgroup>
        <TableHeader>
          <TableRow className="text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
            <TableHead>{t("review.record")}</TableHead>
            <TableHead>{t("review.payload")}</TableHead>
            <TableHead>{t("review.issue")}</TableHead>
            <TableHead>{t("review.status")}</TableHead>
            <TableHead className="text-right">{t("review.decision")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.reviewRecords.length === 0 ? (
            <ReviewRecordsEmptyState />
          ) : (
            props.reviewRecords.map((record) => (
              <ReviewRecordRow
                canDecide={props.canDecideReviews}
                issue={issueForRecord(record, props.reviewIssues)}
                key={record.id}
                onApprove={() => props.onDecide(record.id, "approved")}
                onReject={() => props.onDecide(record.id, "rejected")}
                record={record}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableScrollArea>
  );
}
