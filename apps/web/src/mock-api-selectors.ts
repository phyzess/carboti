import type { AiAdvisoryArtifact, ApiUser, ImportJobListItem, SourceFile } from "./types";
import type { MockInvitation } from "./mock-api-invitation-model";
import { shortId } from "./mock-api-identifiers";
import { user } from "./mock-api-model";
import { nowIso } from "./mock-api-time";
import { displayNameFromEmail, normalizedEmail } from "./mock-api-values";
import { requestError } from "./mock-api-http";
import type { MockState } from "./mock-api-state";

export function findOrCreateDemoUser(
  state: MockState,
  emailInput?: string,
  role = "admin",
  displayName?: string,
): ApiUser {
  const email = normalizedEmail(emailInput) ?? "admin@example.com";
  const existing = state.users.find((item) => item.email === email);
  if (existing) {
    return existing;
  }
  const created = user(
    `demo-user-${shortId()}`,
    email,
    role,
    displayName || displayNameFromEmail(email),
    nowIso(),
  );
  state.users = [created, ...state.users];
  return created;
}

export function requireUser(state: MockState): ApiUser {
  const user = currentUser(state);
  if (!user) {
    throw requestError(401, "unauthorized", "Login is required.");
  }
  return user;
}

export function currentUser(state: MockState): ApiUser | null {
  return state.users.find((user) => user.id === state.currentUserId) ?? null;
}

export function requireInvitation(
  state: MockState,
  invitationId: string | undefined,
): MockInvitation {
  const invitation = state.invitations.find((item) => item.id === invitationId);
  if (!invitation) {
    throw requestError(404, "invitation_not_found", "Invitation was not found.");
  }
  return invitation;
}

export function requireJob(state: MockState, jobId: string): ImportJobListItem {
  const job = state.importJobs.find((item) => item.id === jobId);
  if (!job) {
    throw requestError(404, "import_job_not_found", "Import job was not found.");
  }
  return job;
}

export function requireSource(state: MockState, sourceFileId: string): SourceFile {
  const source = state.sourceFiles.find((item) => item.id === sourceFileId);
  if (!source) {
    throw requestError(404, "source_file_not_found", "Source file was not found.");
  }
  return source;
}

export function requireAdvisory(
  state: MockState,
  jobId: string,
  advisoryId: string | undefined,
): AiAdvisoryArtifact {
  const advisory = (state.advisoriesByJobId[jobId] ?? []).find((item) => item.id === advisoryId);
  if (!advisory) {
    throw requestError(404, "advisory_not_found", "Advisory was not found.");
  }
  return advisory;
}
