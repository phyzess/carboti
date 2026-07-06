import type { ReactNode } from "react";
import { cn } from "./utils";

export function DataToolbar(props: {
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  meta?: ReactNode;
}) {
  return (
    <div className={cn("qitu-data-toolbar", props.className)}>
      {props.children ? <div className="qitu-data-toolbar-main">{props.children}</div> : null}
      {props.meta ? <div className="qitu-data-toolbar-meta">{props.meta}</div> : null}
      {props.actions ? <div className="qitu-data-toolbar-actions">{props.actions}</div> : null}
    </div>
  );
}
