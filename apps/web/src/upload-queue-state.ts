import type { UploadQueueEntry } from "./types";

export function createUploadQueueEntries(files: File[]): UploadQueueEntry[] {
  return files.map((file) => ({
    file,
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    status: "queued",
  }));
}
