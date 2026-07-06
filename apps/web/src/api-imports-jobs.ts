import { apiJson, withSearch } from "./api-client";
import type {
  DrainLocalImportJobsResponse,
  ImportJobEventsResponse,
  ImportJobsResponse,
} from "./api-imports-types";

export async function listImportJobs(
  input: {
    workspaceId?: string;
    status?: string;
    limit?: number;
  } = {},
): Promise<ImportJobsResponse> {
  const search = new URLSearchParams();
  if (input.workspaceId) search.set("workspaceId", input.workspaceId);
  if (input.status) search.set("status", input.status);
  if (input.limit) search.set("limit", String(input.limit));
  return apiJson<ImportJobsResponse>(withSearch("/api/import-jobs", search));
}

export async function drainLocalImportJobs(): Promise<DrainLocalImportJobsResponse> {
  return apiJson<DrainLocalImportJobsResponse>("/api/dev/import-jobs/drain", {
    method: "POST",
  });
}

export async function listImportJobEvents(
  jobId: string,
  input: {
    limit?: number;
  } = {},
): Promise<ImportJobEventsResponse> {
  const search = new URLSearchParams();
  if (input.limit) search.set("limit", String(input.limit));
  return apiJson<ImportJobEventsResponse>(withSearch(`/api/import-jobs/${jobId}/events`, search));
}

export async function commitImportJob(jobId: string): Promise<{
  importJobId: string;
  status: string;
  committedRecords: unknown[];
}> {
  return apiJson(`/api/import-jobs/${jobId}/commit`, {
    method: "POST",
  });
}

export async function retryImportJob(jobId: string): Promise<{
  importJobId: string;
  status: string;
}> {
  return apiJson(`/api/import-jobs/${jobId}/retry`, {
    method: "POST",
  });
}
