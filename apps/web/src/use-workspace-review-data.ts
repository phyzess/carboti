import { useRef, useState } from "react";
import { getImportJobReview, listAiAdvisories, listImportJobEvents } from "./api";
import type { NoticeDescriptor } from "./app-notice";
import { errorMessage } from "./app-session";
import type { AiAdvisoryArtifact, ImportJobEvent, ReviewIssue, StagedRecord } from "./types";

type WorkspaceReviewDataOptions = {
  setError: (message: string | null) => void;
  setNotice: (notice: NoticeDescriptor) => void;
};

export function useWorkspaceReviewData(options: WorkspaceReviewDataOptions) {
  const { setError, setNotice } = options;
  const loadedJobDataIdRef = useRef<string | null>(null);
  const loadingJobDataIdRef = useRef<string | null>(null);
  const [importJobEvents, setImportJobEvents] = useState<ImportJobEvent[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [reviewRecords, setReviewRecords] = useState<StagedRecord[]>([]);
  const [reviewIssues, setReviewIssues] = useState<ReviewIssue[]>([]);
  const [aiAdvisories, setAiAdvisories] = useState<AiAdvisoryArtifact[]>([]);

  async function loadReview(
    jobId: string,
    options: {
      updateNotice?: boolean;
    } = {},
  ) {
    if (loadingJobDataIdRef.current === jobId) return;
    loadingJobDataIdRef.current = jobId;
    const updateNotice = options.updateNotice ?? true;
    try {
      const [reviewResult, advisoryResult, eventResult] = await Promise.allSettled([
        getImportJobReview(jobId),
        listAiAdvisories(jobId),
        listImportJobEvents(jobId, { limit: 30 }),
      ]);

      if (eventResult.status === "fulfilled") {
        setImportJobEvents(eventResult.value.events);
      } else {
        setImportJobEvents([]);
        if (!String(eventResult.reason).includes("404")) {
          setError(errorMessage(eventResult.reason));
        }
      }

      if (advisoryResult.status === "fulfilled") {
        setAiAdvisories(advisoryResult.value.advisories);
      } else {
        setAiAdvisories([]);
      }

      if (reviewResult.status === "fulfilled") {
        const review = reviewResult.value;
        setReviewRecords(review.records);
        setReviewIssues(review.issues);
        loadedJobDataIdRef.current = jobId;
        if (updateNotice) {
          setNotice({
            key: "notice.reviewLoaded",
            values: { filename: review.job.sourceFile.filename },
          });
        }
        return;
      }

      loadedJobDataIdRef.current = null;
      setReviewRecords([]);
      setReviewIssues([]);
      if (updateNotice) {
        setNotice({ key: "notice.reviewWaiting" });
      }
      if (!String(reviewResult.reason).includes("404")) {
        setError(errorMessage(reviewResult.reason));
      }
    } finally {
      if (loadingJobDataIdRef.current === jobId) {
        loadingJobDataIdRef.current = null;
      }
    }
  }

  function isReviewLoaded(jobId: string): boolean {
    return loadedJobDataIdRef.current === jobId;
  }

  function clearSelectedJobData() {
    loadedJobDataIdRef.current = null;
    setReviewRecords([]);
    setReviewIssues([]);
    setAiAdvisories([]);
    setImportJobEvents([]);
  }

  function resetReviewData() {
    clearSelectedJobData();
    setSelectedJobId(null);
    loadingJobDataIdRef.current = null;
  }

  return {
    aiAdvisories,
    clearSelectedJobData,
    importJobEvents,
    isReviewLoaded,
    loadReview,
    resetReviewData,
    reviewIssues,
    reviewRecords,
    selectedJobId,
    setReviewRecords,
    setSelectedJobId,
  };
}
