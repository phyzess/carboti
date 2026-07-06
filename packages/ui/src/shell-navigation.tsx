import type { ReactNode } from "react";

import { Button } from "./button";
import type { AppShellNavItem } from "./shell-types";
import { cn } from "./utils";

export function SubNavButton(props: { item: AppShellNavItem }) {
  const content = <span>{props.item.label}</span>;

  if (props.item.href) {
    return (
      <a
        aria-current={props.item.active ? "page" : undefined}
        aria-disabled={props.item.disabled ? true : undefined}
        className="qitu-subnav-button"
        data-active={props.item.active ? "true" : "false"}
        data-disabled={props.item.disabled ? "true" : "false"}
        href={props.item.href}
        tabIndex={props.item.disabled ? -1 : undefined}
        onClick={(event) => {
          if (props.item.disabled) {
            event.preventDefault();
            return;
          }

          if (!props.item.onSelect) return;
          event.preventDefault();
          props.item.onSelect();
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <Button
      aria-current={props.item.active ? "page" : undefined}
      className="qitu-subnav-button"
      data-active={props.item.active ? "true" : "false"}
      disabled={props.item.disabled}
      nativeButton
      onClick={props.item.onSelect}
      type="button"
      variant="ghost"
    >
      {content}
    </Button>
  );
}

export function PrimaryNavButton(props: {
  index: number;
  item: AppShellNavItem;
  onFocusIndex: (index: number | null) => void;
  onHoverIndex: (index: number | null) => void;
}) {
  const content: ReactNode = props.item.icon ?? (
    <span aria-hidden="true" className="qitu-primary-fallback">
      {props.item.label.slice(0, 2)}
    </span>
  );
  const className = cn(
    "qitu-primary-button qitu-button-press",
    props.item.disabled && "pointer-events-none opacity-40",
  );

  if (props.item.href) {
    return (
      <a
        aria-current={props.item.active ? "page" : undefined}
        aria-disabled={props.item.disabled ? true : undefined}
        aria-label={props.item.label}
        className={className}
        data-active={props.item.active ? "true" : "false"}
        data-disabled={props.item.disabled ? "true" : "false"}
        href={props.item.href}
        tabIndex={props.item.disabled ? -1 : undefined}
        onBlur={() => props.onFocusIndex(null)}
        onClick={(event) => {
          if (props.item.disabled) {
            event.preventDefault();
            return;
          }

          if (!props.item.onSelect) return;
          event.preventDefault();
          props.item.onSelect();
        }}
        onFocus={() => props.onFocusIndex(props.index)}
        onMouseEnter={() => props.onHoverIndex(props.index)}
        title={props.item.label}
      >
        <span aria-hidden="true" className="qitu-primary-icon">
          {content}
        </span>
      </a>
    );
  }

  return (
    <Button
      aria-current={props.item.active ? "page" : undefined}
      aria-label={props.item.label}
      className={className}
      data-active={props.item.active ? "true" : "false"}
      disabled={props.item.disabled}
      nativeButton
      onBlur={() => props.onFocusIndex(null)}
      onFocus={() => props.onFocusIndex(props.index)}
      onMouseEnter={() => props.onHoverIndex(props.index)}
      onClick={props.item.onSelect}
      size="icon"
      title={props.item.label}
      type="button"
      variant="ghost"
    >
      <span aria-hidden="true" className="qitu-primary-icon">
        {content}
      </span>
    </Button>
  );
}
