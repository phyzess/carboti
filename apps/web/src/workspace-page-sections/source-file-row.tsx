import { Button, Checkbox, StatusBadge } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { ImportJobListItem, SourceFile } from "../types";
import { statusTone } from "./status-tone";

export function SourceFileRow(props: {
  file: SourceFile;
  jobs: ImportJobListItem[];
  onOpenDetails: () => void;
  onSelectedChange: (selected: boolean) => void;
  selected: boolean;
}) {
  const { formatBytes, formatDateTime, formatStatus, t } = useI18n();
  const latestJob = props.jobs[0] ?? null;
  const status = latestJob?.status ?? "stored";

  return (
    <div className="qitu-surface-subtle flex flex-wrap items-start gap-3 p-3">
      <Checkbox
        aria-label={t("sources.selectSource", { filename: props.file.filename })}
        checked={props.selected}
        onCheckedChange={(checked) => props.onSelectedChange(checked === true)}
      />
      <div className="min-w-0 flex-1">
        <div className="min-w-0">
          <div className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
            {props.file.filename}
          </div>
          <div className="qitu-number mt-1 text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
            {formatBytes(props.file.size)} · {formatDateTime(props.file.uploadedAt)}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
          <StatusBadge tone="neutral">
            {t("sources.jobCount", { count: String(props.jobs.length) })}
          </StatusBadge>
          <span>
            {latestJob ? t("sources.latestJob", { id: latestJob.id }) : t("sources.noImportJob")}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-2">
        <StatusBadge tone={statusTone(status)}>{formatStatus(status)}</StatusBadge>
        <Button size="sm" variant="ghost" onClick={props.onOpenDetails}>
          {t("action.viewDetails")}
        </Button>
      </div>
    </div>
  );
}
