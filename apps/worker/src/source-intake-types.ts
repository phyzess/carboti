export type SourceIntakeActor = {
  id: string;
  kind: "system" | "user";
};

export type SourceIntakeInput = {
  actor: SourceIntakeActor;
  content: ArrayBuffer;
  contentType: string;
  filename: string;
  metadata?: Record<string, unknown>;
  requestId?: string | null | undefined;
  workspaceId: string;
};

export type SourceIntakeSuccessResult = {
  duplicate: boolean;
  importJobId: string | null;
  objectKey: string;
  ok: true;
  sourceFileId: string;
  status: string | null;
};

export type UnsupportedSourceFileFailure = {
  code: "unsupported_source_file";
  importJobId?: string;
  message: string;
  objectKey?: string;
  ok: false;
  sourceFileId?: string;
  status: 415;
};

export type SourceImportDispatchFailure = {
  code: "queue_dispatch_failed";
  importJobId: string;
  message: string;
  objectKey: string;
  ok: false;
  sourceFileId: string;
  status: 503;
};

export type SourceIntakeResult =
  | SourceIntakeSuccessResult
  | UnsupportedSourceFileFailure
  | SourceImportDispatchFailure;
