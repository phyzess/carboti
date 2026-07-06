import { DataState } from "./data-state";
import { cn } from "./utils";

export type TimelineItem = {
  id: string;
  time: string;
  title: string;
  description?: string | undefined;
  tone?: "neutral" | "success" | "warning" | "error" | "info" | undefined;
};

export function Timeline(props: {
  items: TimelineItem[];
  emptyLabel?: string | undefined;
  emptyTitle?: string | undefined;
  className?: string | undefined;
}) {
  if (props.items.length === 0) {
    return (
      <DataState
        className={props.className}
        description={props.emptyLabel ?? "No events have been recorded yet."}
        state="empty"
        title={props.emptyTitle ?? "No events"}
      />
    );
  }

  return (
    <div className={cn("space-y-[var(--qitu-space-o3)]", props.className)}>
      {props.items.map((item) => (
        <div className="qitu-surface-subtle p-[var(--qitu-space-o4)]" key={item.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  item.tone === "success" && "bg-[var(--qitu-chroma-lime-ink)]",
                  item.tone === "warning" && "bg-[var(--qitu-chroma-pink-ink)]",
                  item.tone === "error" && "bg-[var(--qitu-red)]",
                  item.tone === "info" && "bg-[var(--qitu-chroma-lilac-ink)]",
                  (!item.tone || item.tone === "neutral") && "bg-[var(--qitu-dim)]",
                )}
              />
              <div className="min-w-0">
                <div className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)] text-[var(--qitu-text)]">
                  {item.title}
                </div>
                {item.description ? (
                  <div className="mt-1 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
                    {item.description}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="qitu-number shrink-0 text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
              {item.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
