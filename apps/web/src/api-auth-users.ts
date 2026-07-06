import { apiJson, withSearch } from "./api-client";
import type { DeleteUserResponse, UsersResponse } from "./api-auth-types";

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
  return apiJson<DeleteUserResponse>(`/api/users/${userId}`, {
    method: "DELETE",
  });
}

export async function listUsers(input: { limit?: number } = {}): Promise<UsersResponse> {
  const search = new URLSearchParams();
  if (input.limit) search.set("limit", String(input.limit));
  return apiJson<UsersResponse>(withSearch("/api/users", search));
}
