import type {
  AuthenticatedWorkspaceAudit,
  AuthenticatedWorkspaceData,
  AuthenticatedWorkspaceReview,
  AuthenticatedWorkspaceSession,
  AuthenticatedWorkspaceShell,
  AuthenticatedWorkspaceUpload,
  AuthenticatedWorkspaceUserManagement,
} from "./authenticated-workspace-props";
import type { BuildAuthenticatedWorkspacePropsOptions } from "./app-controller-workspace-prop-types";

export function buildAuthenticatedWorkspaceAuditProps({
  workspaceActions,
  workspaceData,
}: Pick<
  BuildAuthenticatedWorkspacePropsOptions,
  "workspaceActions" | "workspaceData"
>): AuthenticatedWorkspaceAudit {
  return {
    filterDraft: workspaceData.auditFilterDraft,
    onApplyFilters: workspaceActions.handleApplyAuditFilters,
    onClearFilters: workspaceActions.handleClearAuditFilters,
    onFilterDraftChange: workspaceData.setAuditFilterDraft,
    onSelectedEventChange: workspaceData.setSelectedAuditEventId,
    pageEvents: workspaceData.auditPageEvents,
    selectedEventId: workspaceData.selectedAuditEventId,
  };
}

export function buildAuthenticatedWorkspaceReviewProps({
  reviewActions,
  viewModel,
  workspaceData,
}: Pick<
  BuildAuthenticatedWorkspacePropsOptions,
  "reviewActions" | "viewModel" | "workspaceData"
>): AuthenticatedWorkspaceReview {
  return {
    aiAdvisories: workspaceData.aiAdvisories,
    auditEvents: workspaceData.auditEvents,
    canCommit: viewModel.canCommit,
    canRetry: viewModel.canRetry,
    commitApproved: reviewActions.commitApproved,
    commitSourceJobs: reviewActions.commitSourceJobs,
    confirmAdvisory: reviewActions.confirmAdvisory,
    confirmPendingRecords: reviewActions.confirmPendingRecords,
    confirmSourceJobs: reviewActions.confirmSourceJobs,
    counts: viewModel.counts,
    decide: reviewActions.decide,
    dismissAdvisory: reviewActions.dismissAdvisory,
    generateAdvisory: reviewActions.generateAdvisory,
    importJobEvents: workspaceData.importJobEvents,
    issues: workspaceData.reviewIssues,
    onOpenReviewForJob: reviewActions.openReviewForJob,
    processLocalQueue: reviewActions.processLocalQueue,
    records: workspaceData.reviewRecords,
    retryAvailable: viewModel.retryAvailable,
    retrySelectedJob: reviewActions.retrySelectedJob,
    selectJob: reviewActions.selectJob,
    selectedJob: viewModel.selectedJob,
    selectedJobId: workspaceData.selectedJobId,
    trend: viewModel.reviewTrend,
  };
}

export function buildAuthenticatedWorkspaceSessionProps({
  actionRunner,
  authSession,
  noticeText,
  permissions,
  user,
}: Pick<
  BuildAuthenticatedWorkspacePropsOptions,
  "actionRunner" | "authSession" | "noticeText" | "permissions" | "user"
>): AuthenticatedWorkspaceSession {
  return {
    error: actionRunner.error,
    isBusy: actionRunner.isBusy,
    noticeText,
    onLogout: authSession.handleLogout,
    permissions,
    runtimeEnvironment: authSession.runtimeEnvironment,
    user,
  };
}

export function buildAuthenticatedWorkspaceShellProps({
  shellController,
}: Pick<BuildAuthenticatedWorkspacePropsOptions, "shellController">): AuthenticatedWorkspaceShell {
  return {
    actions: shellController.shellActions,
    closeOverlays: shellController.closeShellOverlays,
    navigationModel: shellController.navigationModel,
    onCommand: shellController.openSearch,
    overlays: shellController.shellOverlays,
  };
}

export function buildAuthenticatedWorkspaceUploadProps({
  uploadController,
}: Pick<
  BuildAuthenticatedWorkspacePropsOptions,
  "uploadController"
>): AuthenticatedWorkspaceUpload {
  return {
    inputRef: uploadController.uploadInputRef,
    onFilesSelected: uploadController.handleUploadFilesSelected,
    onRemoveItem: uploadController.removeUploadItem,
    onRetryItem: uploadController.retryUploadItem,
    onUploadSample: uploadController.handleUploadSample,
    onUploadSelected: uploadController.handleUploadSelected,
    queue: uploadController.uploadQueue,
  };
}

export function buildAuthenticatedWorkspaceUserManagementProps({
  userManagement,
  viewModel,
}: Pick<
  BuildAuthenticatedWorkspacePropsOptions,
  "userManagement" | "viewModel"
>): AuthenticatedWorkspaceUserManagement {
  return {
    adminError: userManagement.adminError,
    createdInvitationUrl: userManagement.createdInvitationUrl,
    invitationForm: userManagement.invitationForm,
    invitations: userManagement.invitations,
    isInitialLoad: viewModel.isInitialUserManagementLoad,
    isLoading: userManagement.isLoadingUserManagement,
    onCreateInvitation: userManagement.handleCreateInvitation,
    onDeleteInvitation: userManagement.handleDeleteInvitation,
    onDeleteUser: userManagement.handleDeleteUser,
    onInvitationFormChange: userManagement.setInvitationForm,
    onRefresh: userManagement.loadUserManagement,
    onResendInvitation: userManagement.handleResendInvitation,
    onRevokeInvitation: userManagement.handleRevokeInvitation,
    users: userManagement.users,
  };
}

export function buildAuthenticatedWorkspaceDataProps({
  viewModel,
  workspaceData,
}: Pick<
  BuildAuthenticatedWorkspacePropsOptions,
  "viewModel" | "workspaceData"
>): AuthenticatedWorkspaceData {
  return {
    importJobs: workspaceData.importJobs,
    sourceFiles: workspaceData.sourceFiles,
    workspaceReviewCounts: viewModel.workspaceReviewCounts,
  };
}
