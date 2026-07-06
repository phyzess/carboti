import { apiJson } from "./api-client";
import type { AiAdvisoriesResponse, AiAdvisoryResponse } from "./api-imports-types";

export async function listAiAdvisories(jobId: string): Promise<AiAdvisoriesResponse> {
  return apiJson<AiAdvisoriesResponse>(`/api/import-jobs/${jobId}/advisories`);
}

export async function generateAiAdvisory(jobId: string): Promise<AiAdvisoryResponse> {
  return apiJson<AiAdvisoryResponse>(`/api/import-jobs/${jobId}/advisories`, {
    method: "POST",
  });
}

export async function confirmAiAdvisory(input: {
  jobId: string;
  advisoryId: string;
}): Promise<AiAdvisoryResponse> {
  return apiJson<AiAdvisoryResponse>(
    `/api/import-jobs/${input.jobId}/advisories/${input.advisoryId}/confirm`,
    {
      method: "POST",
    },
  );
}

export async function dismissAiAdvisory(input: {
  jobId: string;
  advisoryId: string;
}): Promise<AiAdvisoryResponse> {
  return apiJson<AiAdvisoryResponse>(
    `/api/import-jobs/${input.jobId}/advisories/${input.advisoryId}/dismiss`,
    {
      method: "POST",
    },
  );
}
