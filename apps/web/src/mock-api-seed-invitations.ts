import { invitation } from "./mock-api-invitation-model";
import { hoursAgo } from "./mock-api-time";
import type { MockState } from "./mock-api-state";

export function createSeedInvitations(): MockState["invitations"] {
  return [
    invitation(
      "demo-invitation-1",
      "pending-operator@example.com",
      "reviewer",
      "pending",
      "demo-invite-token-1",
      hoursAgo(6),
    ),
    {
      ...invitation(
        "demo-invitation-2",
        "mail-failure@example.com",
        "viewer",
        "pending",
        "demo-invite-token-2",
        hoursAgo(12),
      ),
      latestEmailErrorMessage: "Mock delivery failure for demo visibility.",
      latestEmailStatus: "failed",
    },
  ];
}
