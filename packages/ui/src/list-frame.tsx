import { AlertCircle, CheckCircle2, CircleDashed } from "lucide-react";
import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "./utils";

export type ListFrameState = "loading" | "empty" | "error" | "partial" | "ready";

export function ListFrame(props: {
  action?: ReactNode | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  description?: string | undefined;
  rowCount?: number | undefined;
  state: ListFrameState;
  title?: string | undefined;
}) {
  if (props.state === "ready") {
    return (
      <div className={cn("qitu-list-frame", props.className)} data-state="ready">
        {props.children}
      </div>
    );
  }

  if (props.state === "loading") {
    return (
      <div className={cn("qitu-list-frame", props.className)} data-state="loading">
        {Array.from({ length: props.rowCount ?? 3 }, (_, index) => (
          <div className="qitu-list-state-row" key={index}>
            <span className="qitu-skeleton size-8 rounded-[var(--qitu-radius-md)]" />
            <span className="min-w-0 flex-1">
              <span className="qitu-skeleton block h-4 w-[38%] rounded-[var(--qitu-radius-sm)]" />
              <span className="qitu-skeleton mt-2 block h-3 w-[62%] rounded-[var(--qitu-radius-sm)]" />
            </span>
            <span className="qitu-skeleton h-6 w-20 rounded-[var(--qitu-radius-sm)]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("qitu-list-frame", props.className)} data-state={props.state}>
      <div className="qitu-list-state-row">
        <span className="qitu-list-state-icon">{stateIcon(props.state)}</span>
        <span className="min-w-0 flex-1">
          {props.title ? <span className="qitu-list-state-title">{props.title}</span> : null}
          {props.description ? (
            <span className="qitu-list-state-description">{props.description}</span>
          ) : null}
        </span>
        {props.action ? <span className="shrink-0">{props.action}</span> : null}
      </div>
    </div>
  );
}

export type ListActionRowProps = Omit<ButtonProps, "variant"> & {
  active?: boolean | undefined;
  variant?: "surface" | "card" | "inline" | undefined;
};

export function ListActionRow(props: ListActionRowProps) {
  const { active, className, variant = "surface", ...buttonProps } = props;

  return (
    <Button
      className={cn("qitu-list-action-row", active && "qitu-row-card-active", className)}
      data-active={active ? "true" : undefined}
      data-variant={variant}
      nativeButton
      {...buttonProps}
    />
  );
}

function stateIcon(state: Exclude<ListFrameState, "loading" | "ready">): ReactNode {
  if (state === "error") return <AlertCircle aria-hidden="true" size={16} />;
  if (state === "partial") return <CheckCircle2 aria-hidden="true" size={16} />;
  return <CircleDashed aria-hidden="true" size={16} />;
}
