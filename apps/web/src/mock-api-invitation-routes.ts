import {
  acceptInvitationForState,
  createInvitationForState,
  deleteInvitationForState,
  limited,
  publicInvitation,
  readJsonBody,
  resendInvitationForState,
  respond,
  revokeInvitationForState,
} from "./mock-api-support";
import type { MockRouteContext, MockRouteResult } from "./mock-api-route-context";

export async function handleMockInvitationRoute(context: MockRouteContext): MockRouteResult {
  const { method, options, segments, state, url } = context;

  if (method === "POST" && url.pathname === "/api/bootstrap/invitations") {
    const result = createInvitationForState(state, await readJsonBody(options));
    return respond({
      ...result,
      delivery: "mock",
    });
  }

  if (segments[0] !== "api" || segments[1] !== "invitations") {
    return undefined;
  }

  if (method === "GET" && segments.length === 2) {
    return respond({
      invitations: limited(state.invitations, url).map(publicInvitation),
    });
  }

  if (method === "POST" && segments.length === 2) {
    return respond(createInvitationForState(state, await readJsonBody(options)));
  }

  if (method === "POST" && segments.length === 4 && segments[3] === "revoke") {
    const invitation = revokeInvitationForState(state, segments[2]);
    return respond({ invitation: publicInvitation(invitation) });
  }

  if (method === "POST" && segments.length === 4 && segments[3] === "resend") {
    return respond(resendInvitationForState(state, segments[2]));
  }

  if (method === "DELETE" && segments.length === 3) {
    return respond({
      deletedInvitationId: deleteInvitationForState(state, segments[2]),
      ok: true,
    });
  }

  if (method === "POST" && segments.length === 4 && segments[3] === "accept") {
    const input = await readJsonBody<{ displayName?: string }>(options);
    return respond(acceptInvitationForState(state, segments[2], input));
  }

  return undefined;
}
