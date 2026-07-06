import { commitImportJob, confirmPendingStagedRecords } from "./api";
import type { AppRoute } from "./app-routes";
import type { NoticeDescriptor } from "./app-notice";
import { selectedJobDataNeededForRoute } from "./workspace-route-data";

export type ReviewCommitActionsOptions = {
  loadWorkspace: (
    preferredJobId?: string,
    options?: {
      loadSelectedJobData?: boolean;
      updateReviewNotice?: boolean;
    },
  ) => Promise<void>;
  route: AppRoute;
  runAction: (action: () => Promise<void>) => Promise<void>;
  selectedJobId: string | null;
  setNotice: (notice: NoticeDescriptor) => void;
};

export function createReviewCommitActions(options: ReviewCommitActionsOptions) {
  async function confirmSourceJobs(jobIds: string[]) {
    const uniqueJobIds = [...new Set(jobIds)];
    if (uniqueJobIds.length === 0) return;

    await options.runAction(async () => {
      let confirmedCount = 0;
      for (const jobId of uniqueJobIds) {
        const response = await confirmPendingStagedRecords({
          jobId,
          note: "Confirmed from source list.",
        });
        confirmedCount += response.confirmedCount;
      }

      options.setNotice({
        key: "notice.sourceJobsConfirmed",
        values: {
          count: String(uniqueJobIds.length),
          records: String(confirmedCount),
        },
      });
      await options.loadWorkspace(uniqueJobIds.at(-1), {
        loadSelectedJobData: selectedJobDataNeededForRoute(options.route),
        updateReviewNotice: options.route === "reviews",
      });
    });
  }

  async function commitApproved() {
    const selectedJobId = options.selectedJobId;
    if (!selectedJobId) return;

    await options.runAction(async () => {
      await commitImportJob(selectedJobId);
      options.setNotice({ key: "notice.recordsCommitted" });
      await options.loadWorkspace(selectedJobId);
    });
  }

  async function commitSourceJobs(jobIds: string[]) {
    const uniqueJobIds = [...new Set(jobIds)];
    if (uniqueJobIds.length === 0) return;

    await options.runAction(async () => {
      for (const jobId of uniqueJobIds) {
        await commitImportJob(jobId);
      }

      options.setNotice({
        key: "notice.sourceJobsCommitted",
        values: { count: String(uniqueJobIds.length) },
      });
      await options.loadWorkspace(uniqueJobIds.at(-1), {
        loadSelectedJobData: selectedJobDataNeededForRoute(options.route),
        updateReviewNotice: options.route === "reviews",
      });
    });
  }

  return {
    commitApproved,
    commitSourceJobs,
    confirmSourceJobs,
  };
}
