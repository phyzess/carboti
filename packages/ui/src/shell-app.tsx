import { useState } from "react";

import { AnimatedIcon } from "./animated-icon";
import { Button } from "./button";
import { CommandSearchFixture } from "./command-search-fixture";
import { QituMark } from "./qitu-mark";
import { PrimaryNavButton, SubNavButton } from "./shell-navigation";
import type { AppShellProps } from "./shell-types";

export function AppShell({
  actions,
  brand,
  children,
  commandLabel = "Search workspace",
  commandShortcutLabel = "K",
  eyebrow,
  navigation,
  onCommand,
  subNavigation = [],
}: AppShellProps) {
  const activePrimaryIndex = Math.max(
    navigation.findIndex((item) => item.active),
    0,
  );
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const targetIndex = hoverIndex ?? focusIndex ?? activePrimaryIndex;
  const targetPrimaryItem =
    navigation[targetIndex] ?? navigation[activePrimaryIndex] ?? navigation[0];
  const activeItem =
    subNavigation.find((item) => item.active) ?? targetPrimaryItem ?? navigation[0];
  const commandContent = (
    <CommandSearchFixture
      icon={<AnimatedIcon name="search" size={15} />}
      label={commandLabel}
      shortcut={commandShortcutLabel}
    />
  );

  return (
    <div className="qitu-workbench">
      <header className="qitu-topbar">
        <div className="qitu-topbar-main">
          <div className="qitu-brand-lockup">
            <div aria-hidden="true" className="qitu-brand-mark">
              <QituMark />
            </div>
            <div className="qitu-brand-copy">
              <strong className="qitu-brand-name">{brand}</strong>
              <span className="qitu-brand-context">
                {activeItem?.label ?? "Workspace"}
                {eyebrow ? ` / ${eyebrow}` : ""}
              </span>
            </div>
          </div>

          <div className="qitu-navigation-stack">
            <nav aria-label="Primary navigation" className="qitu-primary-nav">
              <div className="qitu-primary-nav-track" onMouseLeave={() => setHoverIndex(null)}>
                {navigation.map((item, index) => (
                  <PrimaryNavButton
                    index={index}
                    item={item}
                    key={item.label}
                    onFocusIndex={setFocusIndex}
                    onHoverIndex={setHoverIndex}
                  />
                ))}
                {navigation.length > 0 ? (
                  <>
                    <span aria-hidden="true" className="qitu-primary-divider" />
                    <span aria-live="polite" className="qitu-primary-live-label">
                      {targetPrimaryItem?.label}
                    </span>
                  </>
                ) : null}
              </div>
            </nav>

            {subNavigation.length > 1 ? (
              <nav aria-label="Section navigation" className="qitu-subnav">
                {subNavigation.map((item) => (
                  <SubNavButton item={item} key={item.label} />
                ))}
              </nav>
            ) : null}
          </div>

          <div className="qitu-topbar-actions">
            {onCommand ? (
              <Button
                aria-label={commandLabel}
                className="qitu-command"
                nativeButton
                onClick={onCommand}
                title={commandLabel}
                type="button"
                variant="ghost"
              >
                {commandContent}
              </Button>
            ) : (
              <div className="qitu-command" role="search" title={commandLabel}>
                {commandContent}
              </div>
            )}
            {actions}
          </div>
        </div>
      </header>
      <main className="qitu-main">{children}</main>
    </div>
  );
}
