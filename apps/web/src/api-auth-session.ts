import { apiJson } from "./api-client";
import type { LoginResponse, MeResponse } from "./api-auth-types";

export async function me(): Promise<MeResponse> {
  return apiJson<MeResponse>("/api/auth/me");
}

export async function login(input: { email: string; password: string }): Promise<LoginResponse> {
  return apiJson<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function logout(): Promise<{ ok: true }> {
  return apiJson<{ ok: true }>("/api/auth/logout", {
    method: "POST",
  });
}
