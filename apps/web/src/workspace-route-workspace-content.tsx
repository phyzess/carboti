import type { WorkspaceShellRouteContentProps } from "./workspace-shell-route-content-types";
import { WorkspaceHomeSlot } from "./workspace-home";
import { ImportsPage, SourcesPage } from "./workspace-pages";

export function WorkspaceOverviewRouteContent({
  navigate,
  workspace,
}: WorkspaceShellRouteContentProps) {
  return (
    <WorkspaceHomeSlot
      importJobs={workspace.importJobs}
      onNavigate={(path) => navigate(path)}
      sourceFiles={workspace.sourceFiles}
      workspaceReviewCounts={workspace.workspaceReviewCounts}
    />
  );
}

export function WorkspaceSourcesRouteContent({
  review,
  session,
  upload,
  workspace,
}: WorkspaceShellRouteContentProps) {
  return (
    <SourcesPage
      canCommitImports={session.permissions.canCommitImports}
      canDecideReviews={session.permissions.canDecideReviews}
      canUploadSources={session.permissions.canUploadSources}
      importJobs={workspace.importJobs}
      isBusy={session.isBusy}
      onCommitSourceJobs={(jobIds) => void review.commitSourceJobs(jobIds)}
      onConfirmSourceJobs={(jobIds) => void review.confirmSourceJobs(jobIds)}
      onRemoveUploadItem={upload.onRemoveItem}
      onRetryUploadItem={(itemId) => upload.onRetryItem(itemId)}
      onUploadFilesSelected={upload.onFilesSelected}
      onUploadSample={() => void upload.onUploadSample()}
      onUploadSelected={() => void upload.onUploadSelected()}
      sourceFiles={workspace.sourceFiles}
      uploadInputRef={upload.inputRef}
      uploadQueue={upload.queue}
    />
  );
}

export function WorkspaceImportsRouteContent({
  review,
  session,
  workspace,
}: WorkspaceShellRouteContentProps) {
  return (
    <ImportsPage
      canProcessImports={session.permissions.canProcessImports}
      canRetry={review.canRetry}
      importJobEvents={review.importJobEvents}
      importJobs={workspace.importJobs}
      isBusy={session.isBusy}
      onOpenReview={(jobId) => void review.onOpenReviewForJob(jobId)}
      onProcessLocalQueue={() => void review.processLocalQueue()}
      onRetrySelectedJob={() => void review.retrySelectedJob()}
      onSelectJob={(jobId) => void review.selectJob(jobId)}
      retryAvailable={review.retryAvailable}
      runtimeEnvironment={session.runtimeEnvironment}
      selectedJob={review.selectedJob}
      selectedJobId={review.selectedJobId}
      sourceFiles={workspace.sourceFiles}
    />
  );
}
