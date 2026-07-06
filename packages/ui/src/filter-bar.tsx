import type { FormEventHandler, ReactNode } from "react";
import { cn } from "./utils";

export function FilterBar(props: {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form className={cn("qitu-filter-bar", props.className)} onSubmit={props.onSubmit}>
      <div className="qitu-filter-bar-fields">{props.children}</div>
      {props.actions ? <div className="qitu-filter-bar-actions">{props.actions}</div> : null}
    </form>
  );
}
