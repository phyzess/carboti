import type { ReactNode } from "react";

import { cn } from "./utils";

export function SectionHeader(props: {
  title: string;
  description?: string | undefined;
  icon?: ReactNode | undefined;
  action?: ReactNode | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("flex min-w-0 items-start justify-between gap-3", props.className)}>
      <div className="flex min-w-0 items-start gap-2">
        {props.icon ? (
          <span className="mt-0.5 text-[var(--qitu-brand-accent)]" aria-hidden="true">
            {props.icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)] text-[var(--qitu-text)]">
            {props.title}
          </h2>
          {props.description ? (
            <p className="mt-[var(--qitu-space-s-3)] text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-dim)]">
              {props.description}
            </p>
          ) : null}
        </div>
      </div>
      {props.action ? <div className="shrink-0">{props.action}</div> : null}
    </div>
  );
}
