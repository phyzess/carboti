export function assertWebSourcePageGuards(context) {
  const {
    assert,
    webSourceDetailsContent,
    webSourceDetailsDrawer,
    webSourceBatchActions,
    webSourceFileRow,
    webSourceFilesPanel,
    webSourceSelection,
    webSourcesPage,
    webSourceUploadActions,
    webSourceUploadPanel,
    webSourceUploadQueueItems,
  } = context;

  assert(
    webSourcesPage.includes("useSourceSelection") &&
      !webSourcesPage.includes("useState") &&
      !webSourcesPage.includes("useEffect") &&
      !webSourcesPage.includes("function groupJobsBySourceId") &&
      webSourceSelection.includes("function useSourceSelection") &&
      webSourceSelection.includes("function groupJobsBySourceId") &&
      webSourceSelection.includes("setSelectedSourceIds") &&
      webSourceSelection.includes("selectedSourceIdSet") &&
      webSourceSelection.includes("detailsOpen") &&
      webSourceDetailsDrawer.includes("SourceDetailsContent") &&
      !webSourceDetailsDrawer.includes("<RuntimeRow") &&
      !webSourceDetailsDrawer.includes("<StatusBadge") &&
      !webSourceDetailsDrawer.includes("function SourceDetailsContent") &&
      webSourceDetailsContent.includes("function SourceDetailsContent") &&
      webSourceDetailsContent.includes("<RuntimeRow") &&
      webSourceDetailsContent.includes("function SourceImportJobRow") &&
      webSourceDetailsContent.includes("<StatusBadge") &&
      webSourceUploadPanel.includes("SourceCompactUploadActions") &&
      webSourceUploadPanel.includes("SourceUploadActions") &&
      webSourceUploadPanel.includes("sourceUploadQueueItems") &&
      !webSourceUploadPanel.includes("<Button") &&
      !webSourceUploadPanel.includes("FileUp") &&
      !webSourceUploadPanel.includes("function uploadQueueItems") &&
      webSourceUploadActions.includes("function SourceCompactUploadActions") &&
      webSourceUploadActions.includes("function SourceUploadActions") &&
      webSourceUploadActions.includes("<Button") &&
      webSourceUploadActions.includes("FileUp") &&
      webSourceUploadQueueItems.includes("function sourceUploadQueueItems") &&
      webSourceUploadQueueItems.includes("UploadQueueItem") &&
      webSourceFilesPanel.includes("SourceBatchActions") &&
      webSourceFilesPanel.includes("SourceFileRow") &&
      !webSourceFilesPanel.includes("BatchActionBar") &&
      !webSourceFilesPanel.includes("function jobIdsForSources") &&
      !webSourceFilesPanel.includes("function SourceFileRow") &&
      webSourceBatchActions.includes("function SourceBatchActions") &&
      webSourceBatchActions.includes("BatchActionBar") &&
      webSourceBatchActions.includes("function jobIdsForSources") &&
      webSourceBatchActions.includes("function jobIdsByStatus") &&
      webSourceFileRow.includes("function SourceFileRow") &&
      webSourceFileRow.includes("<Checkbox") &&
      webSourceFileRow.includes("statusTone"),
    "source page selection, details, upload actions, queue rows, and file rows must stay split.",
  );
}
