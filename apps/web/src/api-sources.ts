import { apiJson, withSearch } from "./api-client";
import type { SourceFile } from "./types";

export type SourceFilesResponse = {
  sourceFiles: SourceFile[];
};

export async function listSourceFiles(
  input: {
    workspaceId?: string;
    limit?: number;
  } = {},
): Promise<SourceFilesResponse> {
  const search = new URLSearchParams();
  if (input.workspaceId) search.set("workspaceId", input.workspaceId);
  if (input.limit) search.set("limit", String(input.limit));
  return apiJson<SourceFilesResponse>(withSearch("/api/source-files", search));
}

export async function uploadSourceFile(input: { file: File; workspaceId?: string }): Promise<{
  sourceFileId: string;
  importJobId: string;
  objectKey: string;
  status: string;
  duplicate?: boolean;
}> {
  return apiJson("/api/source-files", {
    method: "POST",
    body: input.file,
    headers: {
      "content-type": input.file.type || "application/octet-stream",
      "x-filename": input.file.name,
      "x-workspace-id": input.workspaceId ?? "default",
    },
  });
}
