import type { Dispatch, SetStateAction } from "react";
import { approveStagedRecord, confirmPendingStagedRecords, rejectStagedRecord } from "./api";
import type { NoticeDescriptor } from "./app-notice";
import type { StagedRecord } from "./types";

export type ReviewDecisionActionsOptions = {
  loadWorkspace: (preferredJobId?: string) => Promise<void>;
  reviewRecords: StagedRecord[];
  runAction: (action: () => Promise<void>) => Promise<void>;
  selectedJobId: string | null;
  setNotice: (notice: NoticeDescriptor) => void;
  setReviewRecords: Dispatch<SetStateAction<StagedRecord[]>>;
};

export function createReviewDecisionActions(options: ReviewDecisionActionsOptions) {
  async function decide(recordId: string, status: "approved" | "rejected") {
    const selectedJobId = options.selectedJobId;
    if (!selectedJobId) return;

    await options.runAction(async () => {
      const response =
        status === "approved"
          ? await approveStagedRecord({
              jobId: selectedJobId,
              recordId,
              note: "Approved in web console.",
            })
          : await rejectStagedRecord({
              jobId: selectedJobId,
              recordId,
              note: "Rejected in web console.",
            });

      options.setReviewRecords((current) =>
        current.map((record) => (record.id === recordId ? response.record : record)),
      );
      options.setNotice({
        key: status === "approved" ? "notice.recordApproved" : "notice.recordRejected",
      });
      await options.loadWorkspace(selectedJobId);
    });
  }

  async function confirmPendingRecords() {
    const selectedJobId = options.selectedJobId;
    if (!selectedJobId) return;

    const pendingRecords = options.reviewRecords.filter(
      (record) => record.reviewStatus === "pending",
    );
    if (pendingRecords.length === 0) return;

    await options.runAction(async () => {
      const response = await confirmPendingStagedRecords({
        jobId: selectedJobId,
        note: "Confirmed in web console.",
      });
      const updatedRecords = new Map(response.records.map((record) => [record.id, record]));

      options.setReviewRecords((current) =>
        current.map((record) => updatedRecords.get(record.id) ?? record),
      );
      options.setNotice({
        key: "notice.recordsConfirmed",
        values: { count: String(response.confirmedCount) },
      });
      await options.loadWorkspace(selectedJobId);
    });
  }

  return {
    confirmPendingRecords,
    decide,
  };
}
