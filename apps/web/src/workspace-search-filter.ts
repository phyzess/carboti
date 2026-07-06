import type { SearchEntry } from "./workspace-search-types";

const SEARCH_RESULT_LIMIT = 12;

export function filterSearchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return entries.slice(0, SEARCH_RESULT_LIMIT);

  return entries
    .filter((entry) => entryMatchesQuery(entry, normalizedQuery))
    .slice(0, SEARCH_RESULT_LIMIT);
}

function entryMatchesQuery(entry: SearchEntry, query: string): boolean {
  return [entry.label, entry.description, entry.group].some((value) =>
    value.toLowerCase().includes(query),
  );
}
