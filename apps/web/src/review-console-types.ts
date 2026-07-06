import type { ReactNode, RefObject } from "react";
import type { ChartDatum } from "@carboti/charts";
import type { AppShellNavItem } from "@carboti/ui";
import type {
  AiAdvisoryArtifact,
  ApiUser,
  AuditEvent,
  ImportJobEvent,
  ImportJobListItem,
  ReviewIssue,
  SourceFile,
  StagedRecord,
  UploadQueueEntry,
} from "./types";

export type ReviewCounts = {
  pending: number;
  approved: number;
  rejected: number;
  committed: number;
};

export type ReviewConsoleProps = {
  actions: ReactNode;
  aiAdvisories: AiAdvisoryArtifact[];
  auditEvents: AuditEvent[];
  canDecideReviews: boolean;
  canCommit: boolean;
  canProcessImports: boolean;
  canRetry: boolean;
  canUploadSources: boolean;
  canWriteAiAdvisories: boolean;
  counts: ReviewCounts;
  error: string | null;
  importJobEvents: ImportJobEvent[];
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  navigation: AppShellNavItem[];
  notice: string;
  onCommitApproved: () => void;
  onConfirmPendingRecords: () => void;
  onConfirmAdvisory: (advisoryId: string) => void;
  onCommand: () => void;
  onDecide: (recordId: string, status: "approved" | "rejected") => void;
  onDismissAdvisory: (advisoryId: string) => void;
  onGenerateAdvisory: () => void;
  onProcessLocalQueue: () => void;
  onRemoveUploadItem: (itemId: string) => void;
  onRetrySelectedJob: () => void;
  onRetryUploadItem: (itemId: string) => void;
  onSelectJob: (jobId: string) => void;
  onUploadFilesSelected: (files: FileList | null) => void;
  onUploadSample: () => void;
  onUploadSelected: () => void;
  reviewIssues: ReviewIssue[];
  reviewRecords: StagedRecord[];
  reviewTrend: ChartDatum[];
  runtimeEnvironment: string;
  retryAvailable: boolean;
  selectedJob: ImportJobListItem | null;
  selectedJobId: string | null;
  sourceFiles: SourceFile[];
  subNavigation: AppShellNavItem[];
  uploadQueue: UploadQueueEntry[];
  uploadInputRef: RefObject<HTMLInputElement | null>;
  user: ApiUser;
};
