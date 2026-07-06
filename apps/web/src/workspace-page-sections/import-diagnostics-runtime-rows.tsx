import { RuntimeRow } from "../app-ui";
import { useI18n } from "../i18n";
import type { ImportJobListItem, SourceFile } from "../types";

export function ImportDiagnosticsRuntimeRows(props: {
  runtimeEnvironment: string;
  selectedJob: ImportJobListItem;
  selectedSource: SourceFile | null;
}) {
  const { formatDateTime, formatStatus, t } = useI18n();

  return (
    <div className="space-y-3">
      <RuntimeRow label={t("common.environment")} value={props.runtimeEnvironment} />
      <RuntimeRow label={t("imports.status")} value={formatStatus(props.selectedJob.status)} />
      <RuntimeRow label={t("imports.source")} value={props.selectedJob.sourceFile.filename} />
      <RuntimeRow
        label={t("imports.adapter")}
        value={props.selectedJob.adapterId ?? props.selectedJob.jobKind ?? t("common.none")}
      />
      <RuntimeRow label={t("imports.attempts")} value={String(props.selectedJob.attemptCount)} />
      <RuntimeRow
        label={t("imports.failureClass")}
        value={props.selectedJob.failureClass ?? t("common.none")}
      />
      <RuntimeRow
        label={t("imports.failureReason")}
        value={props.selectedJob.failureReason ?? t("common.none")}
      />
      <RuntimeRow
        label={t("imports.started")}
        value={
          props.selectedJob.processingStartedAt
            ? formatDateTime(props.selectedJob.processingStartedAt)
            : t("common.none")
        }
      />
      <RuntimeRow
        label={t("imports.completed")}
        value={
          props.selectedJob.completedAt
            ? formatDateTime(props.selectedJob.completedAt)
            : t("common.none")
        }
      />
      <RuntimeRow
        label={t("imports.contentHash")}
        value={props.selectedSource?.contentHash ?? t("common.none")}
      />
    </div>
  );
}
