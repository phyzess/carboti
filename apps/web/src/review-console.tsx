import { AppShell } from "@carboti/ui";
import { useI18n } from "./i18n";
import {
  ReviewConsoleSidebar,
  ReviewConsoleWorkflowColumn,
  ReviewRecordsPanel,
} from "./review-console-sections";
import type { ReviewConsoleProps } from "./review-console-types";

export type { ReviewConsoleProps, ReviewCounts } from "./review-console-types";

export function ReviewConsole(props: ReviewConsoleProps) {
  const { t } = useI18n();

  return (
    <AppShell
      actions={props.actions}
      brand="qitu"
      commandLabel={t("command.findSourceJobRecord")}
      commandShortcutLabel="Cmd K"
      eyebrow={props.notice}
      navigation={props.navigation}
      subNavigation={props.subNavigation}
      onCommand={props.onCommand}
    >
      <div className="grid gap-[var(--qitu-layout-gutter)] xl:grid-cols-[minmax(240px,0.7fr)_minmax(0,1.7fr)_minmax(280px,0.85fr)]">
        <ReviewConsoleWorkflowColumn
          canProcessImports={props.canProcessImports}
          canUploadSources={props.canUploadSources}
          counts={props.counts}
          error={props.error}
          importJobs={props.importJobs}
          isBusy={props.isBusy}
          notice={props.notice}
          onProcessLocalQueue={props.onProcessLocalQueue}
          onRemoveUploadItem={props.onRemoveUploadItem}
          onRetryUploadItem={props.onRetryUploadItem}
          onSelectJob={props.onSelectJob}
          onUploadFilesSelected={props.onUploadFilesSelected}
          onUploadSample={props.onUploadSample}
          onUploadSelected={props.onUploadSelected}
          reviewTrend={props.reviewTrend}
          runtimeEnvironment={props.runtimeEnvironment}
          selectedJobId={props.selectedJobId}
          sourceFiles={props.sourceFiles}
          uploadInputRef={props.uploadInputRef}
          uploadQueue={props.uploadQueue}
          user={props.user}
        />
        <ReviewRecordsPanel
          canCommit={props.canCommit}
          canDecideReviews={props.canDecideReviews}
          canRetry={props.canRetry}
          counts={props.counts}
          isBusy={props.isBusy}
          onCommitApproved={props.onCommitApproved}
          onConfirmPendingRecords={props.onConfirmPendingRecords}
          onDecide={props.onDecide}
          onRetrySelectedJob={props.onRetrySelectedJob}
          retryAvailable={props.retryAvailable}
          reviewIssues={props.reviewIssues}
          reviewRecords={props.reviewRecords}
          selectedJob={props.selectedJob}
          selectedJobId={props.selectedJobId}
        />
        <ReviewConsoleSidebar
          aiAdvisories={props.aiAdvisories}
          auditEvents={props.auditEvents}
          canWriteAiAdvisories={props.canWriteAiAdvisories}
          importJobEvents={props.importJobEvents}
          isBusy={props.isBusy}
          onConfirmAdvisory={props.onConfirmAdvisory}
          onDismissAdvisory={props.onDismissAdvisory}
          onGenerateAdvisory={props.onGenerateAdvisory}
          selectedJobId={props.selectedJobId}
        />
      </div>
    </AppShell>
  );
}
