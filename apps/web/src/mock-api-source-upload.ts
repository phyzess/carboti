import type { ApiUser } from "./types";
import { pushAudit } from "./mock-api-events";
import { bodySize, bodyText, type RequestOptions } from "./mock-api-http";
import { hashString, shortId } from "./mock-api-identifiers";
import {
  demoWorkspaceId,
  importJob,
  jobEvent,
  recordsFromContent,
  sourceFile,
} from "./mock-api-model";
import { requireUser } from "./mock-api-selectors";
import { writeState, type MockState } from "./mock-api-state";
import { nowIso } from "./mock-api-time";

export async function uploadSourceFileForState(state: MockState, options: RequestOptions) {
  const user = requireUser(state);
  const result = await uploadSourceFile(state, options, user);
  writeState(state);
  return result;
}

export async function uploadSourceFile(state: MockState, options: RequestOptions, user: ApiUser) {
  const headers = new Headers(options.headers);
  const body = options.body;
  const filename = headers.get("x-filename")?.trim() || `demo-upload-${shortId()}.txt`;
  const contentType = headers.get("content-type") || "application/octet-stream";
  const workspaceId = headers.get("x-workspace-id") || demoWorkspaceId;
  const contentText = await bodyText(body);
  const size = bodySize(body, contentText);
  const contentHash = `mock-${hashString(`${filename}:${size}:${contentText}`)}`;
  const duplicate = state.sourceFiles.find((file) => file.contentHash === contentHash);
  if (duplicate) {
    const existingJob = state.importJobs.find((job) => job.sourceFileId === duplicate.id);
    pushAudit(
      state,
      "source_file.duplicate_detected",
      { id: duplicate.id, kind: "source_file" },
      { contentHash, filename },
      user.id,
    );
    return {
      duplicate: true,
      importJobId: existingJob?.id ?? "",
      objectKey: duplicate.objectKey,
      sourceFileId: duplicate.id,
      status: existingJob?.status ?? "stored",
    };
  }

  const source = sourceFile(
    `demo-source-${shortId()}`,
    filename,
    `mock/source-files/${Date.now()}-${filename}`,
    contentHash,
    size,
    user.id,
    nowIso(),
    contentType,
    workspaceId,
  );
  const job = importJob(`demo-job-${shortId()}`, source, "needs_review", user.id, nowIso());
  const records = recordsFromContent(job, contentText);
  state.sourceFiles = [source, ...state.sourceFiles];
  state.importJobs = [job, ...state.importJobs];
  state.recordsByJobId[job.id] = records;
  state.issuesByJobId[job.id] = records
    .filter((record) => record.reviewStatus === "pending")
    .slice(0, 1)
    .map((record) => ({
      code: "demo_review_required",
      createdAt: nowIso(),
      id: `demo-issue-${shortId()}`,
      importJobId: job.id,
      message: "Demo upload created a visible review item.",
      severity: "info",
      stagedRecordKey: record.stagedRecordKey,
      status: "open",
    }));
  state.advisoriesByJobId[job.id] = [];
  state.importJobEventsByJobId[job.id] = [
    jobEvent(job, "source_file.uploaded", null, "queued", "Source accepted by mock API.", nowIso()),
    jobEvent(
      job,
      "import_job.needs_review",
      "queued",
      "needs_review",
      "Mock parser staged records for confirmation.",
      nowIso(),
    ),
  ];
  pushAudit(
    state,
    "source_file.uploaded",
    { id: source.id, kind: "source_file" },
    { contentHash, filename, mode: "mock" },
    user.id,
  );
  return {
    importJobId: job.id,
    objectKey: source.objectKey,
    sourceFileId: source.id,
    status: job.status,
  };
}
