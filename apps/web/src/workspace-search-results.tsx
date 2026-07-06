import { AnimatedIcon, PanelActionButton } from "@carboti/ui";
import { ArrowRight } from "lucide-react";
import { useI18n } from "./i18n";
import type { SearchEntry } from "./workspace-search-types";

export function WorkspaceSearchResults(props: {
  entries: SearchEntry[];
  onSelectEntry: (entry: SearchEntry) => void;
}) {
  const { t } = useI18n();

  if (props.entries.length === 0) {
    return (
      <div className="grid min-h-28 place-items-center px-4 py-6 text-center text-[length:var(--qitu-text-copy-13)] text-[var(--qitu-muted)]">
        {t("search.empty")}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {props.entries.map((entry) => (
        <PanelActionButton
          data-search-entry-id={entry.id}
          icon={<AnimatedIcon name="search" size={14} />}
          key={entry.id}
          label={entry.label}
          trailing={<ArrowRight className="shrink-0 text-[var(--qitu-dim)]" size={14} />}
          onClick={() => props.onSelectEntry(entry)}
        >
          <span className="block truncate text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
            {t("search.descriptionSeparator", {
              description: entry.description,
              group: entry.group,
            })}
          </span>
        </PanelActionButton>
      ))}
    </div>
  );
}
