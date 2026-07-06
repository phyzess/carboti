export function assertUiPrimitiveDataFacadeGuards(context) {
  const { assert, exists, text } = context;

  assert(
    exists("packages/ui/src/table-cells.tsx") &&
      exists("packages/ui/src/table-root.tsx") &&
      exists("packages/ui/src/table-sections.tsx") &&
      text("packages/ui/src/table.tsx").includes("table-cells") &&
      text("packages/ui/src/table.tsx").includes("table-root") &&
      text("packages/ui/src/table.tsx").includes("table-sections") &&
      !text("packages/ui/src/table.tsx").includes("function TableCell") &&
      text("packages/ui/src/table-root.tsx").includes("function Table") &&
      text("packages/ui/src/table-root.tsx").includes("function TableScrollArea") &&
      text("packages/ui/src/table-sections.tsx").includes("function TableHeader") &&
      text("packages/ui/src/table-sections.tsx").includes("function TableRow") &&
      text("packages/ui/src/table-cells.tsx").includes("function TableCell") &&
      text("packages/ui/src/table-cells.tsx").includes('edge === "start"') &&
      exists("packages/ui/src/upload-queue-empty.tsx") &&
      exists("packages/ui/src/upload-queue-items.tsx") &&
      exists("packages/ui/src/upload-queue-root.tsx") &&
      exists("packages/ui/src/upload-queue-types.ts") &&
      text("packages/ui/src/upload-queue.tsx").includes("upload-queue-root") &&
      text("packages/ui/src/upload-queue.tsx").includes("upload-queue-types") &&
      !text("packages/ui/src/upload-queue.tsx").includes("uploadStatusTone") &&
      text("packages/ui/src/upload-queue-root.tsx").includes("export function UploadQueue") &&
      text("packages/ui/src/upload-queue-root.tsx").includes("handleDrop") &&
      text("packages/ui/src/upload-queue-empty.tsx").includes("function UploadQueueCompactEmpty") &&
      text("packages/ui/src/upload-queue-empty.tsx").includes("function UploadQueueEmpty") &&
      text("packages/ui/src/upload-queue-items.tsx").includes("function UploadQueueRows") &&
      text("packages/ui/src/upload-queue-items.tsx").includes("function uploadStatusTone"),
    "@carboti/ui data/list facade primitives must keep split package-internal implementations.",
  );
}
