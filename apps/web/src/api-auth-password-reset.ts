import { apiJson } from "./api-client";
import type { RequestPasswordResetResponse } from "./api-auth-types";

export async function requestPasswordReset(input: {
  email: string;
}): Promise<RequestPasswordResetResponse> {
  return apiJson<RequestPasswordResetResponse>("/api/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function confirmPasswordReset(input: {
  token: string;
  password: string;
}): Promise<{ ok: true }> {
  return apiJson<{ ok: true }>("/api/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "content-type": "application/json",
    },
  });
}
