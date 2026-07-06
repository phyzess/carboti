import type { ImportJobEvent, ImportJobListItem, SourceFile } from "../types";
import { ImportDiagnosticsRuntimeRows } from "./import-diagnostics-runtime-rows";
import { ImportEventTimeline } from "./import-event-timeline";
import { ImportRecoveryPanel } from "./import-recovery-panel";

export function ImportDiagnosticsDetails(props: {
  canRetry: boolean;
  importJobEvents: ImportJobEvent[];
  isBusy: boolean;
  onRetrySelectedJob: () => void;
  runtimeEnvironment: string;
  selectedJob: ImportJobListItem;
  selectedSource: SourceFile | null;
}) {
  return (
    <div className="mt-[var(--qitu-space-s1)] space-y-4">
      <ImportDiagnosticsRuntimeRows
        runtimeEnvironment={props.runtimeEnvironment}
        selectedJob={props.selectedJob}
        selectedSource={props.selectedSource}
      />
      <ImportRecoveryPanel
        canRetry={props.canRetry}
        isBusy={props.isBusy}
        selectedJob={props.selectedJob}
        onRetrySelectedJob={props.onRetrySelectedJob}
      />
      <ImportEventTimeline importJobEvents={props.importJobEvents} />
    </div>
  );
}
