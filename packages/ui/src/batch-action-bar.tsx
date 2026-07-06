import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "./utils";

export type BatchAction = {
  disabled?: boolean | undefined;
  icon?: ReactNode | undefined;
  id: string;
  label: string;
  onSelect: () => void;
  variant?: ButtonProps["variant"] | undefined;
};

export function BatchActionBar(props: {
  actions: BatchAction[];
  className?: string | undefined;
  clearLabel?: string | undefined;
  onClear?: (() => void) | undefined;
  selectedCount: number;
  summary: string;
}) {
  return (
    <div className={cn("qitu-batch-action-bar", props.className)}>
      <div className="min-w-0">
        <div className="qitu-batch-action-summary">{props.summary}</div>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {props.onClear && props.selectedCount > 0 ? (
          <Button size="sm" variant="ghost" onClick={props.onClear}>
            {props.clearLabel}
          </Button>
        ) : null}
        {props.actions.map((action) => (
          <Button
            disabled={action.disabled}
            key={action.id}
            size="sm"
            variant={action.variant ?? "secondary"}
            onClick={action.onSelect}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
