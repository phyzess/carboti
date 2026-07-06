import { confirmAiAdvisory, dismissAiAdvisory, generateAiAdvisory } from "./api";
import type { NoticeDescriptor } from "./app-notice";

type ReviewAdvisoryActionsOptions = {
  loadWorkspace: (preferredJobId?: string) => Promise<void>;
  runAction: (action: () => Promise<void>) => Promise<void>;
  selectedJobId: string | null;
  setNotice: (notice: NoticeDescriptor) => void;
};

export function createReviewAdvisoryActions(options: ReviewAdvisoryActionsOptions) {
  async function generateAdvisory() {
    const selectedJobId = options.selectedJobId;
    if (!selectedJobId) return;

    await options.runAction(async () => {
      await generateAiAdvisory(selectedJobId);
      options.setNotice({ key: "notice.advisoryGenerated" });
      await options.loadWorkspace(selectedJobId);
    });
  }

  async function confirmAdvisory(advisoryId: string) {
    const selectedJobId = options.selectedJobId;
    if (!selectedJobId) return;

    await options.runAction(async () => {
      await confirmAiAdvisory({
        jobId: selectedJobId,
        advisoryId,
      });
      options.setNotice({ key: "notice.advisoryConfirmed" });
      await options.loadWorkspace(selectedJobId);
    });
  }

  async function dismissAdvisory(advisoryId: string) {
    const selectedJobId = options.selectedJobId;
    if (!selectedJobId) return;

    await options.runAction(async () => {
      await dismissAiAdvisory({
        jobId: selectedJobId,
        advisoryId,
      });
      options.setNotice({ key: "notice.advisoryDismissed" });
      await options.loadWorkspace(selectedJobId);
    });
  }

  return {
    confirmAdvisory,
    dismissAdvisory,
    generateAdvisory,
  };
}
