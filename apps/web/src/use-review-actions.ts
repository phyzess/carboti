import type { Dispatch, SetStateAction } from "react";
import type { AppNavigationPath, AppRoute } from "./app-routes";
import type { NoticeDescriptor } from "./app-notice";
import { createReviewAdvisoryActions } from "./review-advisory-actions";
import { createReviewJobActions } from "./review-job-actions";
import { createReviewRecordActions } from "./review-record-actions";
import type { StagedRecord } from "./types";

type ReviewActionsOptions = {
  formatStatus: (status: string) => string;
  loadReview: (jobId: string, options?: { updateNotice?: boolean }) => Promise<void>;
  loadWorkspace: (
    preferredJobId?: string,
    options?: {
      loadSelectedJobData?: boolean;
      updateReviewNotice?: boolean;
    },
  ) => Promise<void>;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  reviewRecords: StagedRecord[];
  route: AppRoute;
  runAction: (action: () => Promise<void>) => Promise<void>;
  selectedJobId: string | null;
  setNotice: (notice: NoticeDescriptor) => void;
  setReviewRecords: Dispatch<SetStateAction<StagedRecord[]>>;
  setSelectedJobId: (jobId: string | null) => void;
};

export function useReviewActions(options: ReviewActionsOptions) {
  const {
    formatStatus,
    loadReview,
    loadWorkspace,
    navigate,
    reviewRecords,
    route,
    runAction,
    selectedJobId,
    setNotice,
    setReviewRecords,
    setSelectedJobId,
  } = options;

  const jobActions = createReviewJobActions({
    formatStatus,
    loadReview,
    loadWorkspace,
    navigate,
    runAction,
    selectedJobId,
    setNotice,
    setSelectedJobId,
  });
  const recordActions = createReviewRecordActions({
    loadWorkspace,
    reviewRecords,
    route,
    runAction,
    selectedJobId,
    setNotice,
    setReviewRecords,
  });
  const advisoryActions = createReviewAdvisoryActions({
    loadWorkspace,
    runAction,
    selectedJobId,
    setNotice,
  });

  return {
    ...recordActions,
    ...advisoryActions,
    ...jobActions,
  };
}
