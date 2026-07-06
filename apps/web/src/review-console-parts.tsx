import { PanelActionButton, StatusBadge } from "@carboti/ui";
import { ArrowRight, Check, Clock3 } from "lucide-react";
import { useI18n } from "./i18n";
import { statusTone } from "./review-console-helpers";
import type { ImportJobListItem, SourceFile } from "./types";

export function SourceFileItem(props: { file: SourceFile; job: ImportJobListItem | null }) {
  const { formatBytes, formatStatus } = useI18n();
  const status = props.job?.status ?? "stored";

  return (
    <div className="qitu-surface-subtle p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
            {props.file.filename}
          </div>
          <div className="qitu-number mt-1 text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
            {formatBytes(props.file.size)}
          </div>
        </div>
        <StatusBadge tone={statusTone(status)}>{formatStatus(status)}</StatusBadge>
      </div>
    </div>
  );
}

export function JobStep(props: { active: boolean; job: ImportJobListItem; onSelect: () => void }) {
  const { formatStatus, formatTime } = useI18n();

  return (
    <PanelActionButton
      className="w-full"
      data-active={props.active ? "true" : undefined}
      description={formatTime(props.job.updatedAt)}
      icon={props.job.status === "needs_review" ? <Clock3 size={14} /> : <Check size={14} />}
      label={props.job.sourceFile.filename}
      onClick={props.onSelect}
      type="button"
      trailing={
        <>
          <StatusBadge tone={statusTone(props.job.status)}>
            {formatStatus(props.job.status)}
          </StatusBadge>
          <ArrowRight size={14} className="shrink-0 text-[var(--qitu-dim)]" />
        </>
      }
    ></PanelActionButton>
  );
}

export function Guardrail(props: { label: string; state: "active" }) {
  const { formatStatus } = useI18n();

  return (
    <div className="qitu-surface-subtle flex items-center justify-between gap-3 px-3 py-2">
      <div className="text-[length:var(--qitu-text-label-13)] leading-[var(--qitu-leading-label-13)]">
        {props.label}
      </div>
      <StatusBadge tone={props.state}>{formatStatus(props.state)}</StatusBadge>
    </div>
  );
}

export function PermissionHint(props: { label: string }) {
  const { t } = useI18n();

  return (
    <div className="qitu-surface-subtle flex flex-wrap items-center justify-between gap-3 px-3 py-2">
      <div className="text-[length:var(--qitu-text-label-13)] leading-[var(--qitu-leading-label-13)] text-[var(--qitu-muted)]">
        {props.label}
      </div>
      <StatusBadge tone="neutral">{t("permission.readOnly")}</StatusBadge>
    </div>
  );
}
