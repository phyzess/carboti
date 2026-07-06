import { useEffect, useMemo, useRef } from "react";
import { AnimatedIcon, Button, DialogClose, DialogContent, DialogRoot, Input } from "@carboti/ui";
import { X } from "lucide-react";
import { useI18n } from "./i18n";
import { filterSearchEntries } from "./workspace-search-filter";
import { WorkspaceSearchResults } from "./workspace-search-results";
import type { SearchEntry } from "./workspace-search-types";

export function WorkspaceSearchDialog(props: {
  entries: SearchEntry[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const filteredEntries = useMemo(
    () => filterSearchEntries(props.entries, props.query),
    [props.entries, props.query],
  );

  useEffect(() => {
    if (!props.open) return;

    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [props.open]);

  return (
    <DialogRoot open={props.open} onOpenChange={(open) => props.onOpenChange(open)}>
      <DialogContent
        aria-label={t("search.title")}
        className="fixed left-1/2 top-[10vh] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 overflow-hidden"
        initialFocus={inputRef}
      >
        <div className="flex items-center gap-3 bg-[var(--qitu-surface-row)] px-[var(--qitu-space-s1)] py-[var(--qitu-space-s0)]">
          <AnimatedIcon className="shrink-0 text-[var(--qitu-dim)]" name="search" size={16} />
          <Input
            ref={inputRef}
            className="qitu-command-input"
            placeholder={t("search.placeholder")}
            value={props.query}
            onChange={(event) => props.onQueryChange(event.currentTarget.value)}
          />
          <DialogClose
            render={
              <Button
                aria-label={t("action.closeSearch")}
                className="size-8 px-0"
                size="sm"
                title={t("action.closeSearch")}
                variant="ghost"
              >
                <X size={15} />
              </Button>
            }
          />
        </div>
        <div className="max-h-[min(520px,62vh)] overflow-y-auto p-2">
          <WorkspaceSearchResults
            entries={filteredEntries}
            onSelectEntry={(entry) => {
              props.onOpenChange(false);
              props.onQueryChange("");
              entry.onSelect();
            }}
          />
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
