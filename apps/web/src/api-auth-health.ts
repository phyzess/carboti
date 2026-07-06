import { apiJson } from "./api-client";
import type { HealthResponse } from "./api-auth-types";

export async function health(): Promise<HealthResponse> {
  return apiJson<HealthResponse>("/health");
}
