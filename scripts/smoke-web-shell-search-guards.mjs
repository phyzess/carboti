export function assertWebShellSearchGuards(context) {
  const {
    assert,
    exists,
    webShellControls,
    webWorkspaceSearchDialog,
    webWorkspaceSearchFilter,
    webWorkspaceSearchResults,
    webWorkspaceSearchTypes,
  } = context;

  assert(
    exists("apps/web/src/workspace-search-filter.ts") &&
      exists("apps/web/src/workspace-search-results.tsx") &&
      exists("apps/web/src/workspace-search-types.ts") &&
      webShellControls.includes('from "./workspace-search-types"') &&
      webWorkspaceSearchTypes.includes("export type SearchEntry") &&
      webWorkspaceSearchDialog.includes("WorkspaceSearchResults") &&
      webWorkspaceSearchDialog.includes("filterSearchEntries") &&
      !webWorkspaceSearchDialog.includes("PanelActionButton") &&
      !webWorkspaceSearchDialog.includes("search.descriptionSeparator") &&
      webWorkspaceSearchFilter.includes("function filterSearchEntries") &&
      webWorkspaceSearchFilter.includes("SEARCH_RESULT_LIMIT") &&
      webWorkspaceSearchFilter.includes("function entryMatchesQuery") &&
      webWorkspaceSearchResults.includes("function WorkspaceSearchResults") &&
      webWorkspaceSearchResults.includes("PanelActionButton") &&
      webWorkspaceSearchResults.includes("search.empty") &&
      webWorkspaceSearchResults.includes("search.descriptionSeparator"),
    "workspace search dialog must keep filtering, result rendering, and shared entry type split.",
  );
}
