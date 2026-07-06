import type { ImportJobEvent, ImportJobListItem, SourceFile } from "../types";
import { ImportDiagnosticsPanel } from "./import-diagnostics-panel";
import { ImportJobsPanel } from "./import-jobs-panel";

export function ImportsPage(props: {
  canProcessImports: boolean;
  canRetry: boolean;
  importJobEvents: ImportJobEvent[];
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  retryAvailable: boolean;
  onOpenReview: (jobId: string) => void;
  onProcessLocalQueue: () => void;
  onRetrySelectedJob: () => void;
  onSelectJob: (jobId: string) => void;
  runtimeEnvironment: string;
  selectedJob: ImportJobListItem | null;
  selectedJobId: string | null;
  sourceFiles: SourceFile[];
}) {
  const selectedJob =
    props.selectedJob ??
    props.importJobs.find((job) => job.id === props.selectedJobId) ??
    props.importJobs[0] ??
    null;
  const selectedSource = selectedJob
    ? (props.sourceFiles.find((source) => source.id === selectedJob.sourceFileId) ?? null)
    : null;

  return (
    <div className="grid gap-[var(--qitu-layout-gutter)] xl:grid-cols-[minmax(0,1fr)_360px]">
      <ImportJobsPanel
        canProcessImports={props.canProcessImports}
        canRetry={props.canRetry}
        importJobs={props.importJobs}
        isBusy={props.isBusy}
        retryAvailable={props.retryAvailable}
        runtimeEnvironment={props.runtimeEnvironment}
        selectedJobId={props.selectedJobId}
        onOpenReview={props.onOpenReview}
        onProcessLocalQueue={props.onProcessLocalQueue}
        onRetrySelectedJob={props.onRetrySelectedJob}
        onSelectJob={props.onSelectJob}
      />

      <ImportDiagnosticsPanel
        canRetry={props.canRetry}
        importJobEvents={props.importJobEvents}
        isBusy={props.isBusy}
        runtimeEnvironment={props.runtimeEnvironment}
        selectedJob={selectedJob}
        selectedSource={selectedSource}
        onRetrySelectedJob={props.onRetrySelectedJob}
      />
    </div>
  );
}
