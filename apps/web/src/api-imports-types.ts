import type {
  AiAdvisoryArtifact,
  ImportJobEvent,
  ImportJobListItem,
  ImportJobReview,
  ReviewIssue,
  StagedRecord,
} from "./types";

export type ImportJobsResponse = {
  importJobs: ImportJobListItem[];
};

export type ImportJobEventsResponse = {
  events: ImportJobEvent[];
};

export type ReviewResponse = {
  job: ImportJobReview;
  records: StagedRecord[];
  issues: ReviewIssue[];
};

export type AiAdvisoriesResponse = {
  advisories: AiAdvisoryArtifact[];
};

export type AiAdvisoryResponse = {
  advisory: AiAdvisoryArtifact;
  duplicate?: boolean;
};

export type DrainLocalImportJobsResponse = {
  processedCount: number;
  processedJobIds: string[];
};
