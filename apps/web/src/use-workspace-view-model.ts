import { useMemo } from "react";
import type { ChartDatum } from "@carboti/charts";
import type { AppRoute } from "./app-routes";
import type { ReviewCounts } from "./review-console-types";
import type { ImportJobListItem, StagedRecord } from "./types";
import type { WebPermissions } from "./web-permissions";

type WorkspaceReviewCounts = {
  approvedForCommit: number;
  failed: number;
  reviewQueue: number;
};

export function useWorkspaceViewModel(options: {
  formatStatus: (status: string) => string;
  hasLoadedUserManagement: boolean;
  importJobs: ImportJobListItem[];
  permissions: WebPermissions;
  reviewRecords: StagedRecord[];
  route: AppRoute;
  selectedJobId: string | null;
}) {
  const {
    formatStatus,
    hasLoadedUserManagement,
    importJobs,
    permissions,
    reviewRecords,
    route,
    selectedJobId,
  } = options;
  const counts = useMemo<ReviewCounts>(() => {
    return reviewRecords.reduce(
      (accumulator, record) => {
        if (record.reviewStatus === "pending") accumulator.pending += 1;
        if (record.reviewStatus === "approved") accumulator.approved += 1;
        if (record.reviewStatus === "rejected") accumulator.rejected += 1;
        if (record.reviewStatus === "committed") accumulator.committed += 1;
        return accumulator;
      },
      {
        pending: 0,
        approved: 0,
        rejected: 0,
        committed: 0,
      },
    );
  }, [reviewRecords]);
  const workspaceReviewCounts = useMemo<WorkspaceReviewCounts>(() => {
    return importJobs.reduce(
      (accumulator, job) => {
        if (job.status === "needs_review") accumulator.reviewQueue += 1;
        if (job.status === "approved") accumulator.approvedForCommit += 1;
        if (job.status === "failed") accumulator.failed += 1;
        return accumulator;
      },
      {
        approvedForCommit: 0,
        failed: 0,
        reviewQueue: 0,
      },
    );
  }, [importJobs]);
  const reviewTrend: ChartDatum[] = useMemo(
    () => [
      { x: 0, y: counts.pending, label: formatStatus("pending") },
      { x: 1, y: counts.approved, label: formatStatus("approved") },
      { x: 2, y: counts.rejected, label: formatStatus("rejected") },
      { x: 3, y: counts.committed, label: formatStatus("committed") },
    ],
    [counts, formatStatus],
  );
  const selectedJob = importJobs.find((job) => job.id === selectedJobId) ?? null;
  const retryAvailable = Boolean(selectedJobId && selectedJob?.status === "failed");
  const canCommit = Boolean(selectedJobId && counts.approved > 0 && permissions.canCommitImports);
  const canRetry = Boolean(retryAvailable && permissions.canRetryImports);
  const isInitialUserManagementLoad = Boolean(
    route === "users" && permissions.canManageUsers && !hasLoadedUserManagement,
  );

  return {
    canCommit,
    canRetry,
    counts,
    isInitialUserManagementLoad,
    retryAvailable,
    reviewTrend,
    selectedJob,
    workspaceReviewCounts,
  };
}
