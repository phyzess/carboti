# UI Component Provenance

Status: accepted baseline
Date: 2026-07-02

This ledger records where shared `@carboti/ui` primitives come from and how they are allowed to evolve.
It protects the shadcn/Base UI paved road from drifting into page-local lookalikes.

## Rules

1. Registry-backed primitives are installed or refreshed through the root shadcn workflow, which uses
   `packages/ui/components.json` as the writable target.
2. Direct `@base-ui/react` imports belong inside registry-backed `packages/ui` primitives or a
   recorded migration debt item here.
3. App pages consume `@carboti/ui`; they must not import Base UI directly or recreate common controls
   with page-local Tailwind recipes.
4. Qitu compositions wrap registry-backed primitives while keeping names, props, and copy
   business-neutral.
5. Bespoke primitives require a decision-log entry when no registry-backed primitive or existing qitu
   composition fits.

## Registry-Backed Primitives

| Primitive    | File                                                                             | Source                                                    | Status    |
| ------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------- | --------- |
| AlertDialog  | `packages/ui/src/alert-dialog.tsx` + package-internal `alert-dialog-*` modules   | shadcn Base UI registry over `@base-ui/react/dialog`      | Compliant |
| Badge        | `packages/ui/src/badge.tsx`                                                      | shadcn registry styling pattern                           | Compliant |
| Button       | `packages/ui/src/button.tsx`                                                     | shadcn Base UI registry over `@base-ui/react/button`      | Compliant |
| Calendar     | `packages/ui/src/calendar.tsx` + package-internal `calendar-*` modules           | shadcn calendar over `react-day-picker`                   | Compliant |
| Card         | `packages/ui/src/card.tsx`                                                       | shadcn registry pattern                                   | Compliant |
| Checkbox     | `packages/ui/src/checkbox.tsx`                                                   | shadcn Base UI registry over `@base-ui/react/checkbox`    | Compliant |
| Command      | `packages/ui/src/command.tsx` + package-internal `command-*` modules             | shadcn registry over `cmdk`                               | Compliant |
| Dialog       | `packages/ui/src/dialog.tsx` + package-internal `dialog-*` modules               | shadcn Base UI registry over `@base-ui/react/dialog`      | Compliant |
| Drawer       | `packages/ui/src/drawer.tsx`                                                     | shadcn registry over `vaul`                               | Compliant |
| DropdownMenu | `packages/ui/src/dropdown-menu.tsx` + package-internal `dropdown-menu-*` modules | shadcn Base UI registry over `@base-ui/react/menu`        | Compliant |
| Input        | `packages/ui/src/input.tsx`                                                      | shadcn Base UI registry over `@base-ui/react/input`       | Compliant |
| InputGroup   | `packages/ui/src/input-group.tsx` + package-internal `input-group-*` modules     | shadcn registry composition                               | Compliant |
| Popover      | `packages/ui/src/popover.tsx`                                                    | shadcn Base UI registry over `@base-ui/react/popover`     | Compliant |
| RadioGroup   | `packages/ui/src/radio-group.tsx`                                                | shadcn Base UI registry over `@base-ui/react/radio-group` | Compliant |
| Select       | `packages/ui/src/select.tsx` + package-internal `select-*` modules               | shadcn Base UI registry over `@base-ui/react/select`      | Compliant |
| Separator    | `packages/ui/src/separator.tsx`                                                  | shadcn Base UI registry over `@base-ui/react/separator`   | Compliant |
| Sheet        | `packages/ui/src/sheet.tsx`                                                      | shadcn Base UI registry over `@base-ui/react/dialog`      | Compliant |
| Table        | `packages/ui/src/table.tsx` + package-internal `table-*` modules                 | shadcn registry table pattern                             | Compliant |
| Tabs         | `packages/ui/src/tabs.tsx`                                                       | shadcn Base UI registry over `@base-ui/react/tabs`        | Compliant |
| Textarea     | `packages/ui/src/textarea.tsx`                                                   | shadcn registry pattern                                   | Compliant |

## Qitu Compositions

| Primitive            | File                                                                           | Backing                                   | Status    |
| -------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- | --------- |
| BatchActionBar       | `packages/ui/src/batch-action-bar.tsx`                                         | qitu layout primitive using shared tokens | Compliant |
| CommandSearchFixture | `packages/ui/src/command-search-fixture.tsx`                                   | `Command`                                 | Compliant |
| ConfirmDialog        | `packages/ui/src/confirm-dialog.tsx`                                           | `AlertDialog`                             | Compliant |
| DataToolbar          | `packages/ui/src/data-toolbar.tsx`                                             | qitu layout primitive using shared tokens | Compliant |
| DateField            | `packages/ui/src/date-field.tsx`                                               | `Popover` + `Calendar`                    | Compliant |
| DetailDrawer         | `packages/ui/src/detail-drawer.tsx`                                            | `Drawer`                                  | Compliant |
| FilterBar            | `packages/ui/src/filter-bar.tsx`                                               | qitu layout primitive using shared tokens | Compliant |
| Form fields          | `packages/ui/src/form.tsx`                                                     | Base UI field + qitu `Input` / `Select`   | Compliant |
| ListActionRow        | `packages/ui/src/list-frame.tsx`                                               | qitu list primitive using shared tokens   | Compliant |
| ListFrame            | `packages/ui/src/list-frame.tsx`                                               | qitu list primitive using shared tokens   | Compliant |
| Menu                 | `packages/ui/src/menu.tsx`                                                     | `DropdownMenu` compatibility export       | Compliant |
| SegmentedControl     | `packages/ui/src/segmented-control.tsx`                                        | `Tabs`                                    | Compliant |
| StatusBadge          | `packages/ui/src/status-badge.tsx`                                             | `Badge`                                   | Compliant |
| TableScrollArea      | `packages/ui/src/table.tsx`                                                    | bounded qitu wrapper for `Table`          | Compliant |
| UploadQueue          | `packages/ui/src/upload-queue.tsx` + package-internal `upload-queue-*` modules | qitu file queue composition               | Compliant |

## Qitu-Specific Primitives

| Primitive                                 | File                                                                             | Reason                                         | Status    |
| ----------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------- | --------- |
| AnimatedIcon                              | `packages/ui/src/animated-icon.tsx` + grouped `animated-icon-registry-*` modules | Small semantic icon registry for shell chrome  | Compliant |
| App shell                                 | `packages/ui/src/shell.tsx`                                                      | Business-neutral authenticated workbench shell | Compliant |
| Qitu mark                                 | `packages/ui/src/qitu-mark.tsx`                                                  | Project identity mark                          | Compliant |
| Surface, DataState, Timeline, MetricStrip | `packages/ui/src/primitives.tsx`                                                 | Business-neutral workbench surfaces            | Compliant |

## Maintenance

1. When a primitive is refreshed from the registry, update this ledger in the same change and keep
   `vp run smoke` passing.
2. When app pages need a common interaction or layout primitive, add it here before page-local
   lookalikes become the default.
