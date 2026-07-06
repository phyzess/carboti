import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

import { cn } from "./utils";

export type DataStateKind = "loading" | "empty" | "error" | "partial" | "ready";

export function DataState(props: {
  state: DataStateKind;
  title?: string | undefined;
  description?: string | undefined;
  action?: ReactNode | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}) {
  if (props.state === "ready") {
    return <>{props.children}</>;
  }

  const icon = {
    loading: <Loader2 aria-hidden="true" className="animate-spin" size={16} />,
    empty: <CircleDashed aria-hidden="true" size={16} />,
    error: <AlertCircle aria-hidden="true" size={16} />,
    partial: <CheckCircle2 aria-hidden="true" size={16} />,
  }[props.state];

  return (
    <div
      className={cn(
        "qitu-surface-subtle grid min-h-28 place-items-center px-[var(--qitu-space-o4)] py-[var(--qitu-space-o5)] text-center",
        props.className,
      )}
    >
      <div className="max-w-[34rem]">
        <div className="mx-auto mb-3 grid size-8 place-items-center rounded-[var(--qitu-radius-md)] bg-[var(--qitu-surface-row-active)] text-[var(--qitu-muted)]">
          {icon}
        </div>
        {props.title ? (
          <div className="text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)] text-[var(--qitu-text)]">
            {props.title}
          </div>
        ) : null}
        {props.description ? (
          <div className="mt-1 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
            {props.description}
          </div>
        ) : null}
        {props.action ? <div className="mt-4 flex justify-center">{props.action}</div> : null}
      </div>
    </div>
  );
}
