import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "./button";
import { cn } from "./utils";

export function PanelActionButton(
  props: {
    children?: ReactNode | undefined;
    className?: string | undefined;
    description?: string | undefined;
    icon?: ReactNode | undefined;
    label: string;
    trailing?: ReactNode | undefined;
  } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
) {
  const { children, className, description, icon, label, trailing, ...buttonProps } = props;

  return (
    <Button
      className={cn(
        "qitu-panel-action h-auto min-h-9 w-full justify-start px-[var(--qitu-space-o3)] py-[var(--qitu-space-o3)] text-left",
        className,
      )}
      nativeButton
      variant="ghost"
      {...buttonProps}
    >
      {icon ? <span className="qitu-icon-chip size-8">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
          {label}
        </span>
        {description ? (
          <span className="block truncate text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
            {description}
          </span>
        ) : null}
        {children}
      </span>
      {trailing}
    </Button>
  );
}
