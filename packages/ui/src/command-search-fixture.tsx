import type { ReactNode } from "react";
import { cn } from "./utils";

export function CommandSearchFixture(props: {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  label: string;
  shortcut?: string;
}) {
  return (
    <span className={cn("qitu-command-search-fixture", props.className)}>
      {props.icon}
      <span className="qitu-command-search-label qitu-command-label">{props.label}</span>
      {props.shortcut ? (
        <kbd className="qitu-command-search-shortcut qitu-command-kbd">{props.shortcut}</kbd>
      ) : null}
      {props.children}
    </span>
  );
}
