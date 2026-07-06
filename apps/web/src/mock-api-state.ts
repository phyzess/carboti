import type {
  AiAdvisoryArtifact,
  ApiUser,
  AuditEvent,
  ImportJobEvent,
  ImportJobListItem,
  ReviewIssue,
  SourceFile,
  StagedRecord,
} from "./types";
import type { MockInvitation } from "./mock-api-invitation-model";
import { seedState } from "./mock-api-seed-state";
import { isRecord } from "./mock-api-values";

export { seedState } from "./mock-api-seed-state";

export type MockState = {
  advisoriesByJobId: Record<string, AiAdvisoryArtifact[]>;
  auditEvents: AuditEvent[];
  currentUserId: string | null;
  importJobEventsByJobId: Record<string, ImportJobEvent[]>;
  importJobs: ImportJobListItem[];
  invitations: MockInvitation[];
  issuesByJobId: Record<string, ReviewIssue[]>;
  recordsByJobId: Record<string, StagedRecord[]>;
  sourceFiles: SourceFile[];
  users: ApiUser[];
};

export const storageKey = "qitu.demo.mockState.v1";

export function readState(): MockState {
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) {
    const seeded = seedState();
    writeState(seeded);
    return seeded;
  }

  try {
    return normalizeState(JSON.parse(stored));
  } catch {
    const seeded = seedState();
    writeState(seeded);
    return seeded;
  }
}

export function writeState(state: MockState): void {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function normalizeState(value: unknown): MockState {
  if (!isRecord(value)) return seedState();
  const seeded = seedState();
  return {
    advisoriesByJobId: isRecord(value.advisoriesByJobId)
      ? (value.advisoriesByJobId as MockState["advisoriesByJobId"])
      : seeded.advisoriesByJobId,
    auditEvents: Array.isArray(value.auditEvents) ? value.auditEvents : seeded.auditEvents,
    currentUserId:
      typeof value.currentUserId === "string" || value.currentUserId === null
        ? value.currentUserId
        : seeded.currentUserId,
    importJobEventsByJobId: isRecord(value.importJobEventsByJobId)
      ? (value.importJobEventsByJobId as MockState["importJobEventsByJobId"])
      : seeded.importJobEventsByJobId,
    importJobs: Array.isArray(value.importJobs) ? value.importJobs : seeded.importJobs,
    invitations: Array.isArray(value.invitations) ? value.invitations : seeded.invitations,
    issuesByJobId: isRecord(value.issuesByJobId)
      ? (value.issuesByJobId as MockState["issuesByJobId"])
      : seeded.issuesByJobId,
    recordsByJobId: isRecord(value.recordsByJobId)
      ? (value.recordsByJobId as MockState["recordsByJobId"])
      : seeded.recordsByJobId,
    sourceFiles: Array.isArray(value.sourceFiles) ? value.sourceFiles : seeded.sourceFiles,
    users: Array.isArray(value.users) ? value.users : seeded.users,
  };
}
