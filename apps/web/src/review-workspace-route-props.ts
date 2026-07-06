import type { AuthenticatedWorkspaceProps } from "./authenticated-workspace-props";
import type { ReviewConsoleProps } from "./review-console-types";

export type ReviewWorkspaceRouteProps = Pick<
  AuthenticatedWorkspaceProps,
  "review" | "session" | "shell" | "upload" | "workspace"
>;

export function buildReviewConsoleProps({
  review,
  session,
  shell,
  upload,
  workspace,
}: ReviewWorkspaceRouteProps): ReviewConsoleProps {
  return {
    actions: shell.actions,
    aiAdvisories: review.aiAdvisories,
    auditEvents: review.auditEvents,
    canCommit: review.canCommit,
    canDecideReviews: session.permissions.canDecideReviews,
    canProcessImports: session.permissions.canProcessImports,
    canRetry: review.canRetry,
    canUploadSources: session.permissions.canUploadSources,
    canWriteAiAdvisories: session.permissions.canWriteAiAdvisories,
    counts: review.counts,
    error: session.error,
    importJobEvents: review.importJobEvents,
    importJobs: workspace.importJobs,
    isBusy: session.isBusy,
    navigation: shell.navigationModel.primaryNavigation,
    notice: session.noticeText,
    onCommand: shell.onCommand,
    onCommitApproved: () => void review.commitApproved(),
    onConfirmAdvisory: (advisoryId) => void review.confirmAdvisory(advisoryId),
    onConfirmPendingRecords: () => void review.confirmPendingRecords(),
    onDecide: (recordId, status) => void review.decide(recordId, status),
    onDismissAdvisory: (advisoryId) => void review.dismissAdvisory(advisoryId),
    onGenerateAdvisory: () => void review.generateAdvisory(),
    onProcessLocalQueue: () => void review.processLocalQueue(),
    onRemoveUploadItem: upload.onRemoveItem,
    onRetrySelectedJob: () => void review.retrySelectedJob(),
    onRetryUploadItem: (itemId) => upload.onRetryItem(itemId),
    onSelectJob: (jobId) => void review.selectJob(jobId),
    onUploadFilesSelected: upload.onFilesSelected,
    onUploadSample: () => void upload.onUploadSample(),
    onUploadSelected: () => void upload.onUploadSelected(),
    reviewIssues: review.issues,
    reviewRecords: review.records,
    reviewTrend: review.trend,
    retryAvailable: review.retryAvailable,
    runtimeEnvironment: session.runtimeEnvironment,
    selectedJob: review.selectedJob,
    selectedJobId: review.selectedJobId,
    sourceFiles: workspace.sourceFiles,
    subNavigation: shell.navigationModel.subNavigation,
    uploadInputRef: upload.inputRef,
    uploadQueue: upload.queue,
    user: session.user,
  };
}
