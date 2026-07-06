import { apiJson } from "./api-client";
import type { LocalUserBootstrapResponse } from "./api-auth-types";

export async function bootstrapLocalReviewer(input: {
  email: string;
  displayName?: string;
  password: string;
}): Promise<LocalUserBootstrapResponse> {
  return apiJson<LocalUserBootstrapResponse>("/api/bootstrap/local-reviewer", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function bootstrapLocalAdmin(input: {
  email: string;
  displayName?: string;
  password: string;
}): Promise<LocalUserBootstrapResponse> {
  return apiJson<LocalUserBootstrapResponse>("/api/bootstrap/local-admin", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "content-type": "application/json",
    },
  });
}
