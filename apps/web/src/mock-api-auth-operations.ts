import { pushAudit } from "./mock-api-events";
import { mockEmailDelivery } from "./mock-api-invitation-model";
import { shortId } from "./mock-api-identifiers";
import { currentUser, findOrCreateDemoUser } from "./mock-api-selectors";
import { writeState, type MockState } from "./mock-api-state";
import { oneDayFromNow } from "./mock-api-time";
import { normalizedEmail } from "./mock-api-values";

export function bootstrapDemoUser(
  state: MockState,
  input: { displayName?: string; email?: string },
  role: string,
) {
  const email = normalizedEmail(input.email) ?? "admin@example.com";
  const created = !state.users.some((item) => item.email === email);
  const user = findOrCreateDemoUser(state, input.email, role, input.displayName);
  state.currentUserId = user.id;
  pushAudit(state, "auth.local_bootstrap", { id: user.id, kind: "user" }, { role });
  writeState(state);
  return {
    created,
    session: {
      expiresAt: oneDayFromNow(),
      id: "demo-session",
    },
    user,
  };
}

export function currentDemoSession(state: MockState) {
  const user = currentUser(state);
  return {
    user,
    ...(user ? { session: demoSession() } : {}),
  };
}

export function loginDemoUser(state: MockState, input: { email?: string }) {
  const user = findOrCreateDemoUser(state, input.email);
  state.currentUserId = user.id;
  pushAudit(state, "auth.login_succeeded", { id: user.id, kind: "user" }, { demo: true });
  writeState(state);
  return {
    session: demoSession(),
    user,
  };
}

export function logoutDemoUser(state: MockState) {
  const user = currentUser(state);
  if (user) {
    pushAudit(state, "auth.logout", { id: user.id, kind: "user" }, { demo: true });
  }
  state.currentUserId = null;
  writeState(state);
  return { ok: true };
}

export function requestDemoPasswordReset(state: MockState, input: { email?: string }) {
  const resetToken = `demo-reset-${shortId()}`;
  const email = normalizedEmail(input.email);
  pushAudit(
    state,
    "password_reset.requested",
    { id: email ?? "unknown", kind: "user" },
    { delivery: "mock", email },
  );
  writeState(state);
  return {
    delivery: "mock",
    emailDelivery: mockEmailDelivery("stored"),
    ok: true,
    resetToken,
    resetUrl: new URL(`/reset-password/${resetToken}`, window.location.origin).toString(),
  };
}

export function confirmDemoPasswordReset(state: MockState) {
  pushAudit(state, "password_reset.confirmed", { id: "demo-reset", kind: "user" }, { demo: true });
  writeState(state);
  return { ok: true };
}

function demoSession() {
  return {
    expiresAt: oneDayFromNow(),
    id: "demo-session",
  };
}
