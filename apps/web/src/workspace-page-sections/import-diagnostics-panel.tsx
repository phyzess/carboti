import { AnimatedIcon, DataState, SectionHeader, Surface } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { ImportJobEvent, ImportJobListItem, SourceFile } from "../types";
import { ImportDiagnosticsDetails } from "./import-diagnostics-details";

export function ImportDiagnosticsPanel(props: {
  canRetry: boolean;
  importJobEvents: ImportJobEvent[];
  isBusy: boolean;
  onRetrySelectedJob: () => void;
  runtimeEnvironment: string;
  selectedJob: ImportJobListItem | null;
  selectedSource: SourceFile | null;
}) {
  const { t } = useI18n();

  return (
    <Surface as="aside" className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        icon={<AnimatedIcon name="activity" size={16} />}
        title={t("imports.diagnostics")}
      />
      {props.selectedJob ? (
        <ImportDiagnosticsDetails
          canRetry={props.canRetry}
          importJobEvents={props.importJobEvents}
          isBusy={props.isBusy}
          runtimeEnvironment={props.runtimeEnvironment}
          selectedJob={props.selectedJob}
          selectedSource={props.selectedSource}
          onRetrySelectedJob={props.onRetrySelectedJob}
        />
      ) : (
        <DataState
          className="mt-[var(--qitu-space-s1)]"
          description={t("imports.selectJobDescription")}
          state="empty"
          title={t("imports.noSelectedJob")}
        />
      )}
    </Surface>
  );
}
