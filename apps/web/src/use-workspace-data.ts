import { useState } from "react";
import { listAuditEvents, listImportJobs, listSourceFiles } from "./api";
import {
  auditFilterQuery,
  defaultAuditFilters,
  hasAuditFilters,
  type AuditFilters,
} from "./audit-filters";
import type { NoticeDescriptor } from "./app-notice";
import type { AuditEvent, ImportJobListItem, SourceFile } from "./types";
import { useWorkspaceReviewData } from "./use-workspace-review-data";

type WorkspaceDataOptions = {
  setError: (message: string | null) => void;
  setNotice: (notice: NoticeDescriptor) => void;
};

export function useWorkspaceData(options: WorkspaceDataOptions) {
  const { setError, setNotice } = options;
  const [sourceFiles, setSourceFiles] = useState<SourceFile[]>([]);
  const [importJobs, setImportJobs] = useState<ImportJobListItem[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [auditPageEvents, setAuditPageEvents] = useState<AuditEvent[]>([]);
  const [auditFilters, setAuditFilters] = useState<AuditFilters>(defaultAuditFilters);
  const [auditFilterDraft, setAuditFilterDraft] = useState<AuditFilters>(defaultAuditFilters);
  const [selectedAuditEventId, setSelectedAuditEventId] = useState<string | null>(null);
  const reviewData = useWorkspaceReviewData({ setError, setNotice });

  async function loadWorkspace(
    preferredJobId?: string,
    options: {
      loadSelectedJobData?: boolean;
      updateReviewNotice?: boolean;
    } = {},
  ) {
    const loadSelectedJobData = options.loadSelectedJobData ?? true;
    const updateReviewNotice = options.updateReviewNotice ?? true;
    const [sourceFileResponse, importJobResponse, auditResponse] = await Promise.all([
      listSourceFiles({ limit: 20 }),
      listImportJobs({ limit: 20 }),
      listAuditEvents({ limit: 20 }),
    ]);

    setSourceFiles(sourceFileResponse.sourceFiles);
    setImportJobs(importJobResponse.importJobs);
    setAuditEvents(auditResponse.auditEvents);
    if (!hasAuditFilters(auditFilters)) {
      setAuditPageEvents(auditResponse.auditEvents);
      setSelectedAuditEventId((current) =>
        current && auditResponse.auditEvents.some((event) => event.id === current)
          ? current
          : (auditResponse.auditEvents[0]?.id ?? null),
      );
    }

    const nextJobId =
      preferredJobId ?? reviewData.selectedJobId ?? importJobResponse.importJobs[0]?.id ?? null;
    reviewData.setSelectedJobId(nextJobId);

    if (nextJobId && loadSelectedJobData) {
      await reviewData.loadReview(nextJobId, { updateNotice: updateReviewNotice });
    } else {
      reviewData.clearSelectedJobData();
    }
  }

  async function loadAuditPageEvents(filters: AuditFilters) {
    const response = await listAuditEvents({
      ...auditFilterQuery(filters),
      limit: 50,
    });
    setAuditPageEvents(response.auditEvents);
    setSelectedAuditEventId(response.auditEvents[0]?.id ?? null);
  }

  function resetWorkspaceData() {
    setSourceFiles([]);
    setImportJobs([]);
    setAuditEvents([]);
    setAuditPageEvents([]);
    setAuditFilters(defaultAuditFilters);
    setAuditFilterDraft(defaultAuditFilters);
    setSelectedAuditEventId(null);
    reviewData.resetReviewData();
  }

  return {
    aiAdvisories: reviewData.aiAdvisories,
    auditEvents,
    auditFilterDraft,
    auditFilters,
    auditPageEvents,
    importJobEvents: reviewData.importJobEvents,
    importJobs,
    isReviewLoaded: reviewData.isReviewLoaded,
    loadAuditPageEvents,
    loadReview: reviewData.loadReview,
    loadWorkspace,
    resetWorkspaceData,
    reviewIssues: reviewData.reviewIssues,
    reviewRecords: reviewData.reviewRecords,
    selectedAuditEventId,
    selectedJobId: reviewData.selectedJobId,
    setAuditFilterDraft,
    setAuditFilters,
    setReviewRecords: reviewData.setReviewRecords,
    setSelectedAuditEventId,
    setSelectedJobId: reviewData.setSelectedJobId,
    sourceFiles,
  };
}
