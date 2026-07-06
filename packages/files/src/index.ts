import * as v from "valibot";

export const SourceFileSchema = v.object({
  id: v.string(),
  workspaceId: v.string(),
  objectKey: v.string(),
  filename: v.string(),
  contentType: v.string(),
  contentHash: v.string(),
  size: v.optional(v.number()),
  uploadedBy: v.string(),
  uploadedAt: v.string(),
});

export type SourceFile = v.InferOutput<typeof SourceFileSchema>;

export type SourceFileKeyInput = {
  workspaceId: string;
  sourceFileId: string;
  filename: string;
};

export function buildSourceFileKey(input: SourceFileKeyInput): string {
  const safeFilename = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${input.workspaceId}/source-files/${input.sourceFileId}/${safeFilename}`;
}

export async function hashSourceContent(content: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", content);
  const bytes = new Uint8Array(digest);
  return `sha256:${toHex(bytes)}`;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
