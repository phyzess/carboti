import { apiJson } from "./api-client";
import type { LoginResponse } from "./api-auth-types";

export async function acceptInvitation(input: {
  token: string;
  displayName?: string;
  password: string;
}): Promise<LoginResponse> {
  return apiJson<LoginResponse>(`/api/invitations/${input.token}/accept`, {
    method: "POST",
    body: JSON.stringify({
      displayName: input.displayName,
      password: input.password,
    }),
    headers: {
      "content-type": "application/json",
    },
  });
}
