import { cn } from "./utils";

export type MetricItem = {
  id: string;
  label: string;
  value: string | number;
  tone?: "neutral" | "positive" | "negative" | "warning" | undefined;
  meta?: string | undefined;
};

export function MetricStrip(props: { items: MetricItem[]; className?: string | undefined }) {
  return (
    <div
      className={cn("grid grid-cols-[repeat(auto-fit,minmax(88px,1fr))] gap-3", props.className)}
    >
      {props.items.map((item) => (
        <div className="qitu-surface-subtle min-h-[86px] p-[var(--qitu-space-o4)]" key={item.id}>
          <div className="text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
            {item.label}
          </div>
          <div
            className={cn(
              "qitu-number mt-[var(--qitu-space-s-1)] text-[length:var(--qitu-text-heading-20)] font-semibold leading-[var(--qitu-leading-heading-20)]",
              item.tone === "positive" && "text-[var(--qitu-chroma-lime-ink)]",
              item.tone === "negative" && "text-[var(--qitu-red)]",
              item.tone === "warning" && "text-[var(--qitu-chroma-pink-ink)]",
              (!item.tone || item.tone === "neutral") && "text-[var(--qitu-text)]",
            )}
          >
            {item.value}
          </div>
          {item.meta ? (
            <div className="mt-[var(--qitu-space-s-3)] truncate text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
              {item.meta}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
