import { AnimatedIcon, Button, StatusBadge } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { ImportJobListItem } from "../types";
import { importRecoveryGuidance } from "./import-page-helpers";

export function ImportRecoveryPanel(props: {
  canRetry: boolean;
  isBusy: boolean;
  onRetrySelectedJob: () => void;
  selectedJob: ImportJobListItem;
}) {
  const { t } = useI18n();
  const recoveryGuidance = importRecoveryGuidance(props.selectedJob, t);
  if (!recoveryGuidance) return null;

  return (
    <div className="qitu-surface-subtle p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
            {t("imports.recoveryPath")}
          </div>
          <div className="mt-1 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
            {recoveryGuidance.description}
          </div>
        </div>
        <StatusBadge tone={recoveryGuidance.tone}>{recoveryGuidance.label}</StatusBadge>
      </div>
      {props.selectedJob.status === "failed" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            disabled={props.isBusy || !props.canRetry}
            size="sm"
            variant="secondary"
            onClick={props.onRetrySelectedJob}
          >
            <AnimatedIcon name="refresh" size={14} /> {t("action.retryJob")}
          </Button>
          {!props.canRetry ? (
            <span className="text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
              {t("permission.importRetry")}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
