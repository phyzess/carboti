export function assertUiPrimitiveCompositionGuards(context) {
  const { assert, exists, text, uiSources, uiStyles } = context;

  assert(
    text("packages/ui/src/segmented-control.tsx").includes("TabsTrigger") &&
      text("packages/ui/src/confirm-dialog.tsx").includes("AlertDialog") &&
      text("packages/ui/src/status-badge.tsx").includes("Badge") &&
      text("packages/ui/src/date-field.tsx").includes("Calendar") &&
      text("packages/ui/src/date-field.tsx").includes('captionLayout="dropdown"') &&
      text("packages/ui/src/date-field.tsx").includes("startMonth") &&
      text("packages/ui/src/date-field.tsx").includes("endMonth") &&
      !text("packages/ui/src/date-field.tsx").includes("qitu-calendar-grid") &&
      !text("packages/ui/src/form.tsx").includes("@base-ui/react/input") &&
      !text("packages/ui/src/form.tsx").includes("@base-ui/react/select") &&
      !text("packages/ui/src/list-frame.tsx").includes("@base-ui/react/button") &&
      !text("packages/ui/src/shell.tsx").includes("<button") &&
      text("packages/ui/src/styles.css").includes('@import "./styles/theme.css";') &&
      text("packages/ui/src/styles.css").includes('@import "./styles/responsive.css";') &&
      exists("packages/ui/src/shell-app.tsx") &&
      exists("packages/ui/src/shell-navigation.tsx") &&
      exists("packages/ui/src/shell-types.ts") &&
      exists("packages/ui/src/shell-icons.tsx") &&
      exists("packages/ui/src/surface.tsx") &&
      exists("packages/ui/src/section-header.tsx") &&
      exists("packages/ui/src/data-state.tsx") &&
      exists("packages/ui/src/metric-strip.tsx") &&
      exists("packages/ui/src/timeline.tsx") &&
      exists("packages/ui/src/panel-action-button.tsx") &&
      exists("packages/ui/src/animated-icon-registry.tsx") &&
      exists("packages/ui/src/animated-icon-registry-shell.tsx") &&
      exists("packages/ui/src/animated-icon-registry-workflow.tsx") &&
      exists("packages/ui/src/animated-icon-registry-types.ts") &&
      exists("packages/ui/src/animated-icon-types.ts") &&
      exists("packages/ui/src/styles/animated-icon.css") &&
      exists("packages/ui/src/styles/surfaces.css") &&
      uiSources.includes("export const iconRegistry") &&
      uiSources.includes("export const shellIconRegistry") &&
      uiSources.includes("export const workflowIconRegistry") &&
      uiSources.includes("export type IconDefinition") &&
      uiStyles.includes("--qitu-icon-primary-transform") &&
      uiStyles.includes("--qitu-icon-box-left-transform") &&
      uiStyles.includes(".qitu-animated-icon .qitu-icon-primary") &&
      uiStyles.includes("@media (prefers-reduced-motion: reduce)") &&
      uiStyles.includes("@theme inline") &&
      uiStyles.includes("--color-popover: var(--qitu-color-popover);") &&
      uiSources.includes("function Table") &&
      uiSources.includes("function TableCell") &&
      uiSources.includes("function TableScrollArea") &&
      uiSources.includes("qitu-table-scroll-area") &&
      uiSources.includes("function Calendar") &&
      uiSources.includes("function CalendarDayButton") &&
      uiSources.includes("export function DateField") &&
      uiSources.includes("export function SegmentedControl") &&
      uiSources.includes("export function ConfirmDialog") &&
      uiSources.includes("export function CommandSearchFixture") &&
      uiSources.includes("export function BatchActionBar") &&
      uiSources.includes("export function DataToolbar") &&
      uiSources.includes("export function DetailDrawer") &&
      uiSources.includes("export function FilterBar") &&
      uiSources.includes("export function ListFrame") &&
      uiSources.includes("export function ListActionRow") &&
      uiSources.includes("export function UploadQueue") &&
      uiSources.includes("qitu-command-search-fixture") &&
      uiSources.includes("qitu-data-toolbar") &&
      uiSources.includes("qitu-filter-bar") &&
      uiSources.includes("qitu-list-frame") &&
      uiSources.includes("qitu-list-state-row") &&
      uiSources.includes("qitu-upload-compact"),
    "@carboti/ui must expose qitu-composed primitives, shell pieces, icons, and token-backed styles.",
  );
}
