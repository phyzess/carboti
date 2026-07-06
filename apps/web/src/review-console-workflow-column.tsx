import type { RefObject } from "react";
import type { ChartDatum } from "@carboti/charts";
import { ReviewConsoleImportJobsPanel } from "./review-console-import-jobs-panel";
import { ReviewConsoleSourcePanel } from "./review-console-source-panel";
import { ReviewConsoleSummaryPanel } from "./review-console-summary-panel";
import type { ReviewCounts } from "./review-console-types";
import type { ApiUser, ImportJobListItem, SourceFile, UploadQueueEntry } from "./types";

export function ReviewConsoleWorkflowColumn(props: {
  canProcessImports: boolean;
  canUploadSources: boolean;
  counts: ReviewCounts;
  error: string | null;
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  notice: string;
  onProcessLocalQueue: () => void;
  onRemoveUploadItem: (itemId: string) => void;
  onRetryUploadItem: (itemId: string) => void;
  onSelectJob: (jobId: string) => void;
  onUploadFilesSelected: (files: FileList | null) => void;
  onUploadSample: () => void;
  onUploadSelected: () => void;
  reviewTrend: ChartDatum[];
  runtimeEnvironment: string;
  selectedJobId: string | null;
  sourceFiles: SourceFile[];
  uploadInputRef: RefObject<HTMLInputElement | null>;
  uploadQueue: UploadQueueEntry[];
  user: ApiUser;
}) {
  return (
    <section className="space-y-[var(--qitu-layout-gutter)]">
      <ReviewConsoleSummaryPanel
        counts={props.counts}
        error={props.error}
        notice={props.notice}
        reviewTrend={props.reviewTrend}
        user={props.user}
      />
      <ReviewConsoleSourcePanel
        canUploadSources={props.canUploadSources}
        importJobs={props.importJobs}
        isBusy={props.isBusy}
        onRemoveUploadItem={props.onRemoveUploadItem}
        onRetryUploadItem={props.onRetryUploadItem}
        onUploadFilesSelected={props.onUploadFilesSelected}
        onUploadSample={props.onUploadSample}
        onUploadSelected={props.onUploadSelected}
        sourceFiles={props.sourceFiles}
        uploadInputRef={props.uploadInputRef}
        uploadQueue={props.uploadQueue}
      />
      <ReviewConsoleImportJobsPanel
        canProcessImports={props.canProcessImports}
        importJobs={props.importJobs}
        isBusy={props.isBusy}
        onProcessLocalQueue={props.onProcessLocalQueue}
        onSelectJob={props.onSelectJob}
        runtimeEnvironment={props.runtimeEnvironment}
        selectedJobId={props.selectedJobId}
      />
    </section>
  );
}
