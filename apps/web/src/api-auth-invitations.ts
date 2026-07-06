import { apiJson, withSearch } from "./api-client";
import type {
  BootstrapInvitationResponse,
  CreateInvitationResponse,
  DeleteInvitationResponse,
  InvitationsResponse,
  ResendInvitationResponse,
  RevokeInvitationResponse,
} from "./api-auth-types";

export async function createLocalInvitation(input: {
  email: string;
  role?: string;
}): Promise<BootstrapInvitationResponse> {
  return apiJson<BootstrapInvitationResponse>("/api/bootstrap/invitations", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function createInvitation(input: {
  email: string;
  role?: string;
}): Promise<CreateInvitationResponse> {
  return apiJson<CreateInvitationResponse>("/api/invitations", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function revokeInvitation(invitationId: string): Promise<RevokeInvitationResponse> {
  return apiJson<RevokeInvitationResponse>(`/api/invitations/${invitationId}/revoke`, {
    method: "POST",
  });
}

export async function resendInvitation(invitationId: string): Promise<ResendInvitationResponse> {
  return apiJson<ResendInvitationResponse>(`/api/invitations/${invitationId}/resend`, {
    method: "POST",
  });
}

export async function deleteInvitation(invitationId: string): Promise<DeleteInvitationResponse> {
  return apiJson<DeleteInvitationResponse>(`/api/invitations/${invitationId}`, {
    method: "DELETE",
  });
}

export async function listInvitations(
  input: { limit?: number } = {},
): Promise<InvitationsResponse> {
  const search = new URLSearchParams();
  if (input.limit) search.set("limit", String(input.limit));
  return apiJson<InvitationsResponse>(withSearch("/api/invitations", search));
}
