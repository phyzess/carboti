import type { ReactNode, RefObject } from "react";
import type { ChartDatum } from "@carboti/charts";
import type { AuditFilters } from "./audit-filters";
import type { AppNavigationModel } from "./app-navigation";
import type { AppNavigationPath, AppRoute } from "./app-routes";
import type { ReviewCounts } from "./review-console";
import type {
  AiAdvisoryArtifact,
  ApiUser,
  AuditEvent,
  ImportJobEvent,
  ImportJobListItem,
  InvitationSummary,
  ReviewIssue,
  SourceFile,
  StagedRecord,
  UploadQueueEntry,
} from "./types";
import type { WebPermissions } from "./web-permissions";
import type { WorkspaceHomeProps } from "./workspace-home";
import type { InvitationForm } from "./workspace-page-sections/user-management-types";

export type AuthenticatedWorkspaceProps = {
  audit: AuthenticatedWorkspaceAudit;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  review: AuthenticatedWorkspaceReview;
  route: AppRoute;
  session: AuthenticatedWorkspaceSession;
  shell: AuthenticatedWorkspaceShell;
  upload: AuthenticatedWorkspaceUpload;
  userManagement: AuthenticatedWorkspaceUserManagement;
  workspace: AuthenticatedWorkspaceData;
};

export type AuthenticatedWorkspaceSession = {
  error: string | null;
  isBusy: boolean;
  noticeText: string;
  onLogout: () => Promise<void>;
  permissions: WebPermissions;
  runtimeEnvironment: string;
  user: ApiUser;
};

export type AuthenticatedWorkspaceShell = {
  actions: ReactNode;
  closeOverlays: () => void;
  navigationModel: AppNavigationModel;
  onCommand: () => void;
  overlays: ReactNode;
};

export type AuthenticatedWorkspaceData = {
  importJobs: ImportJobListItem[];
  sourceFiles: SourceFile[];
  workspaceReviewCounts: WorkspaceHomeProps["workspaceReviewCounts"];
};

export type AuthenticatedWorkspaceUpload = {
  inputRef: RefObject<HTMLInputElement | null>;
  onFilesSelected: (files: FileList | null) => void;
  onRemoveItem: (itemId: string) => void;
  onRetryItem: (itemId: string) => void;
  onUploadSample: () => Promise<void>;
  onUploadSelected: () => Promise<void>;
  queue: UploadQueueEntry[];
};

export type AuthenticatedWorkspaceReview = {
  aiAdvisories: AiAdvisoryArtifact[];
  auditEvents: AuditEvent[];
  canCommit: boolean;
  canRetry: boolean;
  commitApproved: () => Promise<void>;
  commitSourceJobs: (jobIds: string[]) => Promise<void>;
  confirmAdvisory: (advisoryId: string) => Promise<void>;
  confirmPendingRecords: () => Promise<void>;
  confirmSourceJobs: (jobIds: string[]) => Promise<void>;
  counts: ReviewCounts;
  decide: (recordId: string, status: "approved" | "rejected") => Promise<void>;
  dismissAdvisory: (advisoryId: string) => Promise<void>;
  generateAdvisory: () => Promise<void>;
  importJobEvents: ImportJobEvent[];
  onOpenReviewForJob: (jobId: string) => Promise<void>;
  processLocalQueue: () => Promise<void>;
  records: StagedRecord[];
  retryAvailable: boolean;
  retrySelectedJob: () => Promise<void>;
  selectJob: (jobId: string) => Promise<void>;
  selectedJob: ImportJobListItem | null;
  selectedJobId: string | null;
  issues: ReviewIssue[];
  trend: ChartDatum[];
};

export type AuthenticatedWorkspaceAudit = {
  filterDraft: AuditFilters;
  onApplyFilters: () => Promise<void>;
  onClearFilters: () => Promise<void>;
  onFilterDraftChange: (value: AuditFilters) => void;
  onSelectedEventChange: (eventId: string | null) => void;
  pageEvents: AuditEvent[];
  selectedEventId: string | null;
};

export type AuthenticatedWorkspaceUserManagement = {
  adminError: string | null;
  createdInvitationUrl: string | null;
  invitationForm: InvitationForm;
  invitations: InvitationSummary[];
  isInitialLoad: boolean;
  isLoading: boolean;
  onCreateInvitation: () => Promise<void>;
  onDeleteInvitation: (invitationId: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onInvitationFormChange: (value: InvitationForm) => void;
  onRefresh: () => Promise<void>;
  onResendInvitation: (invitationId: string) => Promise<void>;
  onRevokeInvitation: (invitationId: string) => Promise<void>;
  users: ApiUser[];
};
