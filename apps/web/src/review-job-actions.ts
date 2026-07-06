import { drainLocalImportJobs, retryImportJob } from "./api";
import { routePath, type AppNavigationPath } from "./app-routes";
import type { NoticeDescriptor } from "./app-notice";

type ReviewJobActionsOptions = {
  formatStatus: (status: string) => string;
  loadReview: (jobId: string, options?: { updateNotice?: boolean }) => Promise<void>;
  loadWorkspace: (preferredJobId?: string) => Promise<void>;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  runAction: (action: () => Promise<void>) => Promise<void>;
  selectedJobId: string | null;
  setNotice: (notice: NoticeDescriptor) => void;
  setSelectedJobId: (jobId: string | null) => void;
};

export function createReviewJobActions(options: ReviewJobActionsOptions) {
  async function selectJob(jobId: string) {
    options.setSelectedJobId(jobId);
    await options.runAction(async () => {
      await options.loadReview(jobId);
    });
  }

  async function openReviewForJob(jobId: string) {
    options.setSelectedJobId(jobId);
    options.navigate(routePath("reviews"));
    await options.runAction(async () => {
      await options.loadReview(jobId);
    });
  }

  async function processLocalQueue() {
    await options.runAction(async () => {
      const result = await drainLocalImportJobs();
      options.setNotice({
        key: "notice.processedLocalJobs",
        values: { count: result.processedCount },
      });
      await options.loadWorkspace(options.selectedJobId ?? result.processedJobIds[0]);
    });
  }

  async function retrySelectedJob() {
    const selectedJobId = options.selectedJobId;
    if (!selectedJobId) return;

    await options.runAction(async () => {
      const response = await retryImportJob(selectedJobId);
      options.setNotice({
        key: "notice.importJobStatus",
        values: { status: options.formatStatus(response.status) },
      });
      await options.loadWorkspace(selectedJobId);
    });
  }

  return {
    openReviewForJob,
    processLocalQueue,
    retrySelectedJob,
    selectJob,
  };
}
