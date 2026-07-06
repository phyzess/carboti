import type { UploadQueueItem } from "@carboti/ui";
import type { UploadQueueEntry } from "../types";

export function sourceUploadQueueItems(
  queue: UploadQueueEntry[],
  formatBytes: (value: number | null) => string,
): UploadQueueItem[] {
  return queue.map((item) => ({
    error: item.error,
    id: item.id,
    meta: formatBytes(item.file.size),
    name: item.file.name,
    status: item.status,
  }));
}
