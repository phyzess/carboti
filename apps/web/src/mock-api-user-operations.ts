import { pushAudit } from "./mock-api-events";
import { requestError } from "./mock-api-http";
import { requireUser } from "./mock-api-selectors";
import { writeState, type MockState } from "./mock-api-state";

export function deleteUserForState(state: MockState, targetId: string) {
  const user = requireUser(state);
  if (targetId === user.id) {
    throw requestError(409, "current_user_delete", "The current demo user cannot be deleted.");
  }

  state.users = state.users.filter((item) => item.id !== targetId);
  pushAudit(state, "user.deleted", { id: targetId, kind: "user" }, { demo: true }, user.id);
  writeState(state);
  return { deletedUserId: targetId, ok: true };
}
