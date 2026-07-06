import { Button, ListActionRow, StatusBadge } from "@carboti/ui";
import { ArrowRight, Check, Clock3 } from "lucide-react";
import { useI18n } from "../i18n";
import type { ImportJobListItem } from "../types";
import { statusTone } from "./status-tone";

export function ImportJobRow(props: {
  active: boolean;
  job: ImportJobListItem;
  onOpenReview: () => void;
  onSelect: () => void;
}) {
  const { formatDateTime, formatStatus, t } = useI18n();

  return (
    <div
      className={[
        "qitu-surface-subtle flex flex-wrap items-center gap-3 p-3",
        props.active ? "qitu-row-card-active" : "",
      ].join(" ")}
    >
      <ListActionRow
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        onClick={props.onSelect}
        type="button"
        variant="inline"
      >
        <div className="qitu-icon-chip size-8">
          {props.job.status === "needs_review" ? <Clock3 size={14} /> : <Check size={14} />}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
            {props.job.sourceFile.filename}
          </div>
          <div className="qitu-number text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
            {formatDateTime(props.job.updatedAt)}
          </div>
        </div>
      </ListActionRow>
      <StatusBadge tone={statusTone(props.job.status)}>
        {formatStatus(props.job.status)}
      </StatusBadge>
      <Button size="sm" variant="ghost" onClick={props.onOpenReview}>
        <ArrowRight size={14} /> {t("nav.reviews")}
      </Button>
    </div>
  );
}
