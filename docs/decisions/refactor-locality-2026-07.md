# 2026-07 Refactor Locality Decision Details

This record contains detailed accepted decisions moved out of `docs/decisions/decision-log.md` to keep the main decision index short. Start from the main decision log first; use this record when reviewing the July 2026 UI, package, Web, Worker, smoke, and mock API locality refactors.

### 2026-07-05: UI Stylesheet Implementation Modules

Decision:

Keep `packages/ui/src/styles.css` as the stable `@carboti/ui/styles.css` package stylesheet entrypoint,
and move reusable visual implementation rules into focused CSS modules under
`packages/ui/src/styles/*`.

Rules:

1. The package stylesheet entrypoint owns import order only.
2. Theme mapping, shell frame, data tools, animated icons, shell controls, overlays, form controls,
   upload/list rows, shared controls, surfaces, and responsive rules live in focused CSS modules.
3. Smoke context reads the entrypoint and focused modules together so token and primitive guards
   continue checking the complete `@carboti/ui` visual surface.
4. New reusable visual selectors should extend the module that owns their selector family instead
   of growing `packages/ui/src/styles.css`.

Reason:

`packages/ui/src/styles.css` had become a 1700-line implementation file behind a small package
interface. Keeping the public stylesheet entrypoint stable while splitting implementation modules
improves locality for visual changes without changing app imports or package exports.

### 2026-07-06: UI Shell Interface Facade

Decision:

Keep `packages/ui/src/shell.tsx` as the stable shell interface facade, and move reusable shell
implementation into focused package-internal modules.

Rules:

1. App-owned pages continue importing `AppShell`, `SystemActivityIcon`, and `AppShellNavItem` from
   `@carboti/ui`.
2. `shell.tsx` owns exports only.
3. AppShell frame/rendering, primary and secondary navigation controls, shell props/types, and small
   system icons live in separate package-internal modules.
4. UI smoke reads all `packages/ui/src` files so guards continue checking shell primitives after the
   interface facade becomes thin.

Reason:

The shell package interface is useful and stable, but the implementation mixed frame rendering,
navigation button behavior, exported props, and utility icons in one file. Splitting those modules
improves locality for shell changes while preserving the `@carboti/ui` import seam used by Web app
surfaces.

### 2026-07-06: UI Shared Primitive Facade

Decision:

Keep `packages/ui/src/primitives.tsx` as the stable shared primitive interface facade, and move
reusable primitive implementations into focused package-internal modules.

Rules:

1. App-owned pages continue importing `Surface`, `SectionHeader`, `DataState`, `MetricStrip`,
   `Timeline`, `PanelActionButton`, and their exported types from `@carboti/ui`.
2. `primitives.tsx` owns exports only.
3. Surface, section-header, data-state, metric-strip, timeline, and panel-action-button rendering
   live in separate package-internal modules.
4. UI smoke reads all `packages/ui/src` files so primitive guards continue checking the complete
   shared primitive surface after the facade becomes thin.

Reason:

The shared primitive interface is useful, but one implementation file mixed layout surfaces,
headers, loading/empty/error states, metrics, timelines, and action rows. Splitting those modules
improves locality for reusable UI work while preserving the `@carboti/ui` import seam used by Web app
surfaces.

### 2026-07-06: Alert Dialog Package-Internal Modules

Decision:

Keep `packages/ui/src/alert-dialog.tsx` as the registry-backed `AlertDialog` primitive facade, and
move Base UI root/trigger/portal, overlay/content, layout text/media, and action/cancel wrappers
into focused package-internal modules.

Rules:

1. App, composition, and template callers continue importing alert-dialog primitives from
   `@carboti/ui` or `packages/ui/src/alert-dialog.tsx`.
2. `alert-dialog.tsx` owns re-exports only.
3. `alert-dialog-base.tsx` owns the root, trigger, and portal wrappers.
4. `alert-dialog-content.tsx` owns overlay/backdrop styling, popup positioning, animation classes,
   and default portal composition.
5. `alert-dialog-layout.tsx` owns header, footer, media, title, and description wrappers.
6. `alert-dialog-actions.tsx` owns action and cancel button wrappers.
7. UI smoke guards read the facade and internal modules so alert-dialog content, layout, and action
   behavior does not drift back into a mixed single-file implementation unnoticed.

Reason:

The alert-dialog primitive remains a single useful interface, but its implementation mixed Base UI
entrypoints, overlay/popup animation policy, title/media layout, footer layout, and action-button
adaptation. Splitting package-internal modules improves locality for destructive-confirmation
changes while preserving the existing `@carboti/ui` primitive seam used by `ConfirmDialog` and app
pages.

### 2026-07-06: Dialog Package-Internal Modules

Decision:

Keep `packages/ui/src/dialog.tsx` as the registry-backed `Dialog` primitive facade, and move Base UI
root/trigger/portal/close, overlay/content, and layout wrappers into focused package-internal
modules.

Rules:

1. App, shell, composition, and template callers continue importing dialog primitives from
   `@carboti/ui` or `packages/ui/src/dialog.tsx`.
2. `dialog.tsx` owns re-exports only.
3. `dialog-base.tsx` owns root, `DialogRoot`, trigger, portal, and close wrappers.
4. `dialog-content.tsx` owns overlay/backdrop styling, popup positioning, animation classes, and
   the optional top-right close affordance.
5. `dialog-layout.tsx` owns header, footer, title, description, and optional footer close behavior.
6. UI smoke guards read the facade and internal modules so dialog content and layout behavior does
   not drift back into a mixed single-file implementation unnoticed.

Reason:

The dialog primitive remains a single useful interface, but its implementation mixed Base UI
entrypoints, overlay/popup animation policy, top-right close affordance, footer layout, and text
wrappers. Splitting package-internal modules improves locality for overlay and shell-panel changes
while preserving the existing `@carboti/ui` primitive seam used by command search, user panels, and app
pages.

### 2026-07-06: Input Group Package-Internal Modules

Decision:

Keep `packages/ui/src/input-group.tsx` as the shadcn-pattern `InputGroup` primitive facade, and move
the group container, addon alignment, button size adapter, and input/textarea control adapters into
focused package-internal modules.

Rules:

1. App, command, form, and template callers continue importing input-group primitives from
   `@carboti/ui` or `packages/ui/src/input-group.tsx`.
2. `input-group.tsx` owns re-exports only.
3. `input-group-base.tsx` owns the group container, focus, invalid, disabled, and block/inline
   layout state classes.
4. `input-group-addon.tsx` owns addon alignment variants and the input-focus-on-addon-click
   behavior.
5. `input-group-button.tsx` owns button size variants and the qitu `Button` adapter.
6. `input-group-controls.tsx` owns text, input, and textarea control adapters.
7. UI smoke guards read the facade and internal modules so input-group addon, button, and control
   behavior does not drift back into a mixed single-file implementation unnoticed.

Reason:

The input-group primitive remains a single useful interface, but its implementation mixed container
state policy, addon alignment, button adaptation, and input/textarea control adaptation. Splitting
package-internal modules improves locality for form-control changes while preserving the existing
`@carboti/ui` primitive seam used by command input, forms, and app pages.

### 2026-07-06: Upload Queue Package-Internal Modules

Decision:

Keep `packages/ui/src/upload-queue.tsx` as the qitu `UploadQueue` primitive facade, and move public
queue item types, dropzone/root behavior, empty and compact states, and row/action rendering into
focused package-internal modules.

Rules:

1. App, review, source page, and template callers continue importing `UploadQueue`,
   `UploadQueueItem`, and `UploadQueueItemStatus` from `@carboti/ui` or
   `packages/ui/src/upload-queue.tsx`.
2. `upload-queue.tsx` owns re-exports only.
3. `upload-queue-types.ts` owns the public queue item/status model and internal props type.
4. `upload-queue-root.tsx` owns drag/drop handling, empty/non-empty branching, compact-mode
   selection, and dropzone wrapper classes.
5. `upload-queue-empty.tsx` owns empty and compact empty-state rendering.
6. `upload-queue-items.tsx` owns upload row rendering, retry/remove actions, and status-tone
   projection.
7. UI smoke guards read the facade and internal modules so upload queue root, empty-state, row, and
   status behavior does not drift back into a mixed single-file implementation unnoticed.

Reason:

The upload queue primitive remains a single useful interface for source and review surfaces, but its
implementation mixed public queue item types, drag/drop orchestration, compact empty-state layout,
ordinary empty-state layout, row metadata rendering, retry/remove actions, and status-tone
projection. Splitting package-internal modules improves locality for file-intake UI changes while
preserving the existing `@carboti/ui` primitive seam used by app-owned upload controllers.

### 2026-07-06: Table Package-Internal Modules

Decision:

Keep `packages/ui/src/table.tsx` as the shadcn-pattern `Table` primitive facade, and move table root
and scroll-area behavior, table section wrappers, and cell/head/caption wrappers into focused
package-internal modules.

Rules:

1. App, review, source, audit, and template callers continue importing table primitives from
   `@carboti/ui` or `packages/ui/src/table.tsx`.
2. `table.tsx` owns re-exports only.
3. `table-root.tsx` owns the table container wrapper and the `TableScrollArea` bounded-scroll
   contract.
4. `table-sections.tsx` owns header, body, footer, and row wrappers.
5. `table-cells.tsx` owns head, cell edge rounding, caption, and `TableCellProps`.
6. UI smoke guards read the facade and internal modules so table scroll-area, section, and cell
   behavior does not drift back into a mixed single-file implementation unnoticed.

Reason:

The table primitive remains a single useful interface, but its implementation mixed the bounded
scroll-area contract with native table section and cell wrappers. Splitting package-internal modules
improves locality for dense-table and scroll behavior changes while preserving the existing
`@carboti/ui` primitive seam used across review, source, and audit surfaces.

### 2026-07-06: Dropdown Menu Package-Internal Modules

Decision:

Keep `packages/ui/src/dropdown-menu.tsx` as the registry-backed `DropdownMenu` primitive facade, and
move Base UI menu root/content/item, choice item, and submenu implementations into focused
package-internal modules.

Rules:

1. App, template, and compatibility callers continue importing dropdown primitives from `@carboti/ui`,
   `packages/ui/src/index.ts`, or `packages/ui/src/menu.tsx`.
2. `dropdown-menu.tsx` owns re-exports only.
3. `dropdown-menu-base.tsx` owns root, portal, trigger, content, group, label, item, separator, and
   shortcut wrappers.
4. `dropdown-menu-choice-items.tsx` owns checkbox/radio item indicators and radio group wiring.
5. `dropdown-menu-submenu.tsx` owns submenu root, trigger, and submenu content composition.
6. UI smoke guards read the facade and internal modules so registry-backed menu behavior does not
   drift back into a mixed single-file implementation unnoticed.

Reason:

The dropdown primitive remains a single useful interface, but its implementation had three distinct
modification rhythms: base popup positioning, choice item indicator behavior, and submenu
composition. Splitting package-internal modules improves locality for menu changes while preserving
the existing `@carboti/ui` primitive seam.

### 2026-07-06: Calendar Package-Internal Modules

Decision:

Keep `packages/ui/src/calendar.tsx` as the registry-backed `Calendar` primitive facade, and move
DayPicker class-name mapping, custom calendar parts, and day-button behavior into focused
package-internal modules.

Rules:

1. App and template callers continue importing `Calendar` and `CalendarDayButton` from `@carboti/ui`.
2. `calendar.tsx` owns the public `Calendar` wrapper, DayPicker wiring, month dropdown formatting,
   locale handoff, and re-export of `CalendarDayButton`.
3. `calendar-class-names.ts` owns the `react-day-picker` class-name map, previous/next button
   variants, caption layout classes, range/today/outside state classes, and caller class overrides.
4. `calendar-parts.tsx` owns the custom root, chevron, and week-number renderers.
5. `calendar-day-button.tsx` owns focused-day ref behavior and selected/range data attributes.
6. UI smoke guards read the facade and internal modules so calendar layout, part overrides, and day
   behavior do not drift back into a mixed single-file implementation unnoticed.

Reason:

The calendar primitive remains a single useful interface, but its implementation mixed DayPicker
styling policy, component overrides, and day-cell focus/selection behavior. Splitting
package-internal modules improves locality for date-picker changes while preserving the existing
`@carboti/ui` primitive seam.

### 2026-07-06: Select Package-Internal Modules

Decision:

Keep `packages/ui/src/select.tsx` as the registry-backed `Select` primitive facade, and move Base UI
select trigger/value/group, popup/scroll controls, and item/indicator implementations into focused
package-internal modules.

Rules:

1. App, form, and template callers continue importing select primitives from `@carboti/ui` or
   `packages/ui/src/select.tsx`.
2. `select.tsx` owns re-exports only.
3. `select-base.tsx` owns the root alias, group, value, and trigger wrappers.
4. `select-content.tsx` owns popup positioning, popup animation classes, list wiring, and scroll
   arrows.
5. `select-items.tsx` owns labels, item text, item indicator, and separator wrappers.
6. UI smoke guards read the facade and internal modules so select trigger/content/item behavior does
   not drift back into a mixed single-file implementation unnoticed.

Reason:

The select primitive remains a single useful interface, but its implementation mixed trigger
rendering, popup positioning/scroll behavior, and option item indicator behavior. Splitting
package-internal modules improves locality for select changes while preserving the existing
`@carboti/ui` primitive seam used by form fields and app pages.

### 2026-07-06: Command Package-Internal Modules

Decision:

Keep `packages/ui/src/command.tsx` as the registry-backed `Command` primitive facade, and move cmdk
root/list/group, dialog wrapper, input wrapper, and item/shortcut implementations into focused
package-internal modules.

Rules:

1. App, shell, and template callers continue importing command primitives from `@carboti/ui` or
   `packages/ui/src/command.tsx`.
2. `command.tsx` owns re-exports only.
3. `command-base.tsx` owns the root, list, empty, group, and separator wrappers.
4. `command-dialog.tsx` owns the dialog wrapper, visually hidden title/description, dialog content
   positioning, and close-button default.
5. `command-input.tsx` owns the input group wrapper, cmdk input, and search icon affordance.
6. `command-item.tsx` owns item state classes, selected-item check indicator, and shortcut wrapper.
7. UI smoke guards read the facade and internal modules so command dialog/input/item behavior does
   not drift back into a mixed single-file implementation unnoticed.

Reason:

The command primitive remains a single useful interface, but its implementation mixed palette
container behavior, dialog overlay wiring, input adornment, list/group wrappers, and item indicator
behavior. Splitting package-internal modules improves locality for command-search changes while
preserving the existing `@carboti/ui` primitive seam used by shell search and command fixtures.

### 2026-07-05: Charts Package Interface Facade

Decision:

Keep `packages/charts/src/index.tsx` as the `@carboti/charts` package interface facade, and move
chart implementations plus shared rendering helpers into focused package-internal modules.

Rules:

1. App-owned pages continue importing chart primitives and chart datum types from `@carboti/charts`.
2. `index.tsx` owns exports only.
3. Chart state/frame rendering, grid rendering, scale/format helpers, theme/tone helpers, donut
   geometry, and each concrete chart type live in separate package-internal modules.
4. Smoke context reads all `packages/charts/src` files so package guards continue checking
   visx-backed chart implementations after the interface facade becomes thin.

Reason:

The charts package has a useful single public interface, but its implementation had accumulated
theme, state views, four chart renderers, grid rendering, scale helpers, and SVG geometry in one
file. Splitting those implementation modules improves locality for future chart work while
preserving the package import path and avoiding a second chart stack.

### 2026-07-05: RBAC Package Interface Facade

Decision:

Keep `packages/rbac/src/index.ts` as the `@carboti/rbac` package interface facade, and move reusable
RBAC mechanics into focused package-internal modules.

Rules:

1. Worker and Web callers continue importing role names, starter role policy helpers, policy
   factories, permission checks, and RBAC model types from `@carboti/rbac`.
2. `index.ts` owns exports only.
3. Generic RBAC types, policy validation and normalization, starter role policy constants, and
   permission check helpers live in separate package-internal modules.
4. Smoke context reads all `packages/rbac/src` files so package guards continue checking the
   complete RBAC package surface after the interface facade becomes thin.

Reason:

The RBAC package has a useful small interface for both the starter policy and app-owned policy
adapters, but its implementation mixed generic policy validation, starter role constants, role
normalization, and permission checks in one file. Splitting implementation modules improves locality
for authorization changes while preserving the app-owned policy seam.

### 2026-07-05: Auth Package Interface Facade

Decision:

Keep `packages/auth/src/index.ts` as the `@carboti/auth` package interface facade, and move reusable
auth implementation rules into focused package-internal modules.

Rules:

1. Worker and Web callers continue importing auth schemas, password policy constants, token helpers,
   password hashing, session factories, and auth model types from `@carboti/auth`.
2. `index.ts` owns exports only.
3. Auth schemas, expiry helpers, identity normalization, base64url codecs, token
   generation/hashing, password hashing/verification, and invitation/session/password-reset
   factories live in separate package-internal modules.
4. Smoke context reads all `packages/auth/src` files so package guards continue checking the
   complete auth package surface after the interface facade becomes thin.

Reason:

The auth package has a valuable small public interface, but its implementation had mixed validation
schemas, password policy, token hashing, PBKDF2 verification, expiry rules, email normalization, and
factory construction in one file. Splitting implementation modules improves locality for future
security changes while preserving the `@carboti/auth` seam used by Worker and Web callers.

### 2026-07-05: Database Package Interface Facade

Decision:

Keep `packages/db/src/index.ts` as the `@carboti/db` package interface facade, and move Drizzle table
definitions into focused package-internal modules by generic capability.

Rules:

1. Callers continue importing Drizzle table objects from `@carboti/db`.
2. `index.ts` owns exports only.
3. Auth/session, source/import, review, AI advisory, email/inbound email, and audit/security/alert
   tables live in separate package-internal modules.
4. Smoke context reads all `packages/db/src` files so package guards continue checking that generic
   core tables are present and example-owned staging/commit tables stay out of the reusable DB
   package.
5. Splitting table modules is not a migration or schema change.

Reason:

The DB package exposes a useful single table interface, but a single implementation file mixed every
generic capability's table definitions. Grouping Drizzle tables by capability improves locality for
schema review while preserving the `@carboti/db` import seam and keeping business-owned tables out of
core.

### 2026-07-05: I18n Package Interface Facade

Decision:

Keep `packages/i18n/src/index.ts` as the `@carboti/i18n` package interface facade, and move reusable
locale mechanics into focused package-internal modules.

Rules:

1. Worker, Web, and Email callers continue importing dictionary helpers, translator construction,
   code labelers, formatters, locale metadata types, and locale negotiation helpers from
   `@carboti/i18n`.
2. `index.ts` owns exports only.
3. Types, interpolation, message helpers, code-label helpers, locale-aware formatters, and locale
   negotiation live in separate package-internal modules.
4. I18n smoke and package smoke read all `packages/i18n/src` files so guards continue checking
   package neutrality, plural/relative-time formatting, and Accept-Language locale negotiation after
   the interface facade becomes thin.

Reason:

The i18n package has a useful reusable interface across Web, Worker, and Email, but its
implementation mixed message interpolation, typed dictionaries, code-label helpers, Intl
formatters, and Accept-Language matching in one file. Splitting implementation modules improves
locality for locale work while keeping app-owned copy and persistence policy outside the package.

### 2026-07-05: Import Pipeline Package Interface Facade

Decision:

Keep `packages/import-pipeline/src/index.ts` as the `@carboti/import-pipeline` package interface
facade, and move reusable import/review mechanics into focused package-internal modules.

Rules:

1. Worker, examples, and templates continue importing schemas, generic types, adapter contracts,
   staging key helpers, review action aliases, and job status derivation from
   `@carboti/import-pipeline`.
2. `index.ts` owns exports only.
3. Schemas/types, review issue helpers, staging key conventions, review/confirmation action aliases,
   and review status derivation live in separate package-internal modules.
4. Smoke context and doctor checks read all `packages/import-pipeline/src` files so guards continue
   checking the complete package surface after the interface facade becomes thin.

Reason:

The import-pipeline package has a valuable reusable interface, but a single implementation file
mixed validation schemas, adapter contracts, staging key rules, confirmation-language aliases, and
job status derivation. Splitting implementation modules improves locality for import/review changes
while preserving the `@carboti/import-pipeline` import seam.

### 2026-07-05: Email Package Interface Facade

Decision:

Keep `packages/email/src/index.ts` as the `@carboti/email` package interface facade, and move reusable
email schemas, auth email dictionaries, and auth email rendering into focused package-internal
modules.

Rules:

1. Worker callers continue importing email schemas, delivery types, locale options, and
   invitation/password-reset renderers from `@carboti/email`.
2. `index.ts` owns exports only.
3. Provider-neutral message/inbound schemas, auth email locale dictionaries, and auth email rendering
   live in separate package-internal modules.
4. Smoke context reads all `packages/email/src` files, i18n guards check the rendering module, and
   package interface tests exercise localized auth email rendering at runtime.

Reason:

The email package has a useful provider-neutral interface, but one file mixed message schemas,
delivery contracts, inbound receipt schemas, locale dictionaries, and invitation/password-reset
rendering. Splitting implementation modules improves locality for delivery metadata and localized
auth email changes while preserving the `@carboti/email` import seam.

### 2026-07-05: Example Feature Module Facades

Decision:

Keep optional example package import paths stable while splitting example feature implementations
into focused example-internal modules.

Rules:

1. `examples/import-review/src/index.ts` and `examples/json-records/src/index.ts` remain the package
   import facades.
2. Example parser/source reading, staged-record parsing, adapter behavior, and example record types
   live in focused modules beside the facade.
3. Smoke context reads all files under each example `src` directory so package guards continue
   checking parser, adapter, and commit behavior after the facade becomes thin.
4. Package interface tests run the optional example adapters through parse, stage, validate, and
   commit paths independently of the Worker starter adapters.
5. Worker starter code must continue using app-owned starter adapters rather than importing optional
   example packages.

Reason:

Examples are not production features, but they are the teaching surface for app-owned feature
locality. Splitting them after the core package facade work makes the second-feature example easier
to copy without changing the public example package seam or moving business meaning into reusable
packages.

### 2026-07-06: Web App Route Navigation Hook

Decision:

Keep `apps/web/src/use-app-controller.ts` as the app-owned workflow orchestration hook, and move
TanStack router state, path-to-route derivation, auth route derivation, and duplicate-navigation
avoidance into `apps/web/src/use-app-route-navigation.ts`.

Rules:

1. `useAppController` wires auth, workspace data, review, upload, user management, route lifecycle,
   shell, route gate, and authenticated workspace props.
2. `useAppRouteNavigation` owns `useLocation`, `useNavigate`, `authRouteFromPath`,
   `appRouteFromPath`, the current pathname, and the app-owned `navigate` helper.
3. Shell and top-level composition smoke guards read both modules so router implementation details
   do not drift back into the workflow orchestration hook unnoticed.
4. This remains app-owned Web shell code; it does not introduce a reusable routing package.

Reason:

The controller still had useful orchestration depth, but it also contained route adapter mechanics
with a different modification rhythm. Moving navigation mechanics behind a small hook improves
locality for route/path changes while keeping the workflow hook focused on composing app-owned
state modules.

### 2026-07-06: Web App Route Gate Props Projection

Decision:

Keep `apps/web/src/use-app-controller.ts` as the app-owned workflow orchestration hook, and move
auth route-gate prop projection into `apps/web/src/app-controller-route-gate-props.ts`.

Rules:

1. `useAppController` continues to wire auth, workspace data, review, upload, user management, route
   lifecycle, shell, route gate, and authenticated workspace props.
2. `app-controller-route-gate-props.ts` owns the projection from app action runner, auth workflow,
   auth route, route, and notice text into `AppRouteGateProps`.
3. `app-controller-workspace-props.ts` continues owning authenticated workspace prop projection.
4. Top-level composition smoke guards read the controller, route-gate props builder, route
   navigation hook, and workspace props builder so route-gate action mapping does not drift back
   into the controller unnoticed.
5. This remains app-owned Web shell code; it does not introduce a reusable auth-routing package.

Reason:

The controller should keep workflow orchestration locality, but route-gate prop mapping has a
different modification rhythm: invite acceptance, local setup, login, reset, auth form updates, and
setup-role changes all belong to auth entry surfaces rather than workspace orchestration. Moving
that projection into a focused module keeps the controller's interface small while preserving the
existing route-gate and authenticated workspace seams.

### 2026-07-06: Web Review Records Table Modules

Decision:

Keep `apps/web/src/review-records-table.tsx` as the review-record table interface, and move row and
empty-state rendering into focused app-owned modules.

Rules:

1. `ReviewRecordsTable` owns table structure, column sizing, headers, empty/non-empty branching, and
   record iteration.
2. `ReviewRecordRow` owns staged-record cell rendering, payload summary display, issue/status
   display, and per-record approve/reject controls.
3. `ReviewRecordsEmptyState` owns the empty staged-record row and `DataState` copy wiring.
4. Review-console smoke context and guards read the table, row, and empty-state modules so the
   split cannot regress into a mixed table implementation unnoticed.

Reason:

The review table is app-owned workflow UI, not a reusable table primitive. Keeping the caller-facing
table interface small while moving per-row decision controls and empty-state wiring into focused
modules improves locality for review-surface changes without promoting starter-specific workflow
semantics into `packages/ui`.

### 2026-07-06: Review Workspace Route Props Projection

Decision:

Keep `apps/web/src/review-workspace-route.tsx` as the review route shell adapter, and move
`AuthenticatedWorkspaceProps` to `ReviewConsoleProps` projection into
`apps/web/src/review-workspace-route-props.ts`.

Rules:

1. `ReviewWorkspaceRoute` owns rendering the review console inside the workspace shell route and
   appending shell overlays.
2. `buildReviewConsoleProps` owns permission projection, shell navigation projection, async action
   void-wrapping, upload wiring, and review/workspace data projection for `ReviewConsole`.
3. `review-console-types.ts` owns `ReviewConsoleProps` and `ReviewCounts`; `review-console.tsx`
   owns the visual AppShell and panel layout.
4. Review-console smoke context and guards read the route, route-props, console, and console-types
   modules so prop projection does not drift back into the route adapter unnoticed.

Reason:

The review route had become a mixed adapter: it selected the review shell route and expanded a large
console prop interface inline. Moving the projection into a focused module improves locality for
review console interface changes while preserving the same caller-facing review route.

### 2026-07-06: Workspace Not-Found Route Module

Decision:

Keep `apps/web/src/workspace-shell-route-content.tsx` as the ordinary workspace route-to-page
adapter, and move fallback not-found route UI into `apps/web/src/workspace-not-found-route.tsx`.

Rules:

1. `WorkspaceShellRouteContent` owns route matching to focused route content modules.
2. `WorkspaceNotFoundRoute` owns fallback UI, translated copy, the open-workspace action, and the
   default authenticated path used by that action.
3. Shell smoke context and guards read both modules so the fallback UI does not drift back into the
   route adapter unnoticed.
4. This remains app-owned Web shell code; it does not create a reusable `packages/ui` primitive.

Reason:

The workspace route adapter had accumulated one real UI branch only for not-found fallback behavior.
Moving that branch into a focused module improves locality for shell fallback states while keeping
ordinary route matching compact.

### 2026-07-06: Workspace Route Content Projection Modules

Decision:

Keep `apps/web/src/workspace-shell-route-content.tsx` as the ordinary workspace route switch, and
move workspace-section and settings-section page prop projection into focused app-owned route
content modules.

Rules:

1. `WorkspaceShellRouteContent` owns matching the current `AppRoute` to the route content module and
   keeps not-found fallback wiring.
2. `workspace-route-workspace-content.tsx` owns overview, source, and import page prop projection.
3. `workspace-route-settings-content.tsx` owns audit, users, and account page prop projection.
4. `workspace-shell-route-content-types.ts` owns `WorkspaceShellRouteContentProps` so focused route
   content modules do not type-import through the route switch facade.
5. Shell smoke context and guards read the route switch, route content type module, workspace route
   content module, settings route content module, and not-found route module so page prop projection
   does not drift back into the route switch unnoticed.
6. This remains app-owned Web shell code; it does not introduce a reusable routing package or move
   business meaning into `packages/ui`.

Reason:

The route switch remained useful, but it mixed route matching with six page-specific prop
projections. Source/import pages, audit/users/account settings pages, and the not-found fallback
change for different reasons. Splitting focused route content modules improves locality for page
interface changes while keeping a small route switch seam for the authenticated workspace shell.

### 2026-07-06: Workspace Search Dialog Modules

Decision:

Keep `apps/web/src/workspace-search-dialog.tsx` as the shell search overlay composition module, and
move search entry typing, filtering, and result rendering into focused app-owned modules.

Rules:

1. `WorkspaceSearchDialog` owns dialog wiring, input focus, query field rendering, and close/query
   reset behavior after selection.
2. `workspace-search-types.ts` owns the shared `SearchEntry` type exported through `shell-controls`.
3. `workspace-search-filter.ts` owns query normalization, search matching, and result limiting.
4. `WorkspaceSearchResults` owns empty-state rendering and per-result command button rendering.
5. Shell smoke context and guards read all search modules so filtering and result rendering do not
   drift back into the dialog overlay module unnoticed.

Reason:

Shell search has three distinct modification rhythms: entry construction, query matching, and
overlay/result rendering. `app-search.ts` already owns entry construction; splitting filtering and
results out of the dialog keeps the overlay compact while preserving the same app-owned shell
control interface.

### 2026-07-06: Workspace Shell Controller Projection Modules

Decision:

Keep `apps/web/src/use-workspace-shell-controller.tsx` as the workspace shell orchestration hook,
and move search-entry memoization plus shell chrome node projection into focused app-owned modules.

Rules:

1. `useWorkspaceShellController` owns overlay state, navigation model creation, and the returned
   shell controller shape.
2. `workspace-shell-search.ts` owns the memoized projection from navigation entries, workspace data,
   users, audit events, and i18n formatters into search entries.
3. `workspace-shell-chrome-nodes.tsx` owns the JSX projection from controller state into
   `WorkspaceShellActions` and `WorkspaceShellOverlays`.
4. Shell smoke context and guards read the controller, search projection, chrome-node projection,
   overlay-state, and chrome modules so these implementation details do not drift back into the
   controller unnoticed.
5. This remains app-owned Web shell code; it does not move app navigation, user panels, or search
   behavior into `packages/ui`.

Reason:

The shell controller was mixing three modification rhythms: overlay/navigation state, search entry
assembly, and shell chrome rendering. Splitting projection modules improves locality for search and
chrome changes while preserving the same caller-facing controller interface.

### 2026-07-06: Source Batch Action Module

Decision:

Keep `apps/web/src/workspace-page-sections/source-files-panel.tsx` as the source list panel
composition module, and move selected/all source batch-action derivation into
`apps/web/src/workspace-page-sections/source-batch-actions.tsx`.

Rules:

1. `SourceFilesPanel` owns the `ListFrame`, source-file row iteration, and row selection wiring.
2. `SourceBatchActions` owns pending/confirmed job id derivation, selected/all action availability,
   summary copy wiring, and the shared `BatchActionBar` configuration.
3. Source page smoke context and guards read both modules so batch-action rules do not drift back
   into the list panel unnoticed.
4. The module remains app-owned source workflow UI; it does not add source-specific behavior to
   reusable `packages/ui`.

Reason:

The source list panel had become a mixed rendering and batch-action rule module. Moving the
selection/job-status action rules into a focused module improves locality for source workflow
changes while preserving the same caller-facing panel interface.

### 2026-07-06: Import Diagnostics Detail Modules

Decision:

Keep `apps/web/src/workspace-page-sections/import-diagnostics-details.tsx` as the import
diagnostics composition module, and move runtime rows, recovery guidance, and event timeline
rendering into focused app-owned modules.

Rules:

1. `ImportDiagnosticsDetails` owns the diagnostic detail layout order only.
2. `ImportDiagnosticsRuntimeRows` owns environment, job metadata, failure metadata, timestamps, and
   source hash runtime rows.
3. `ImportRecoveryPanel` owns recovery guidance projection, retry action availability, and retry
   permission messaging.
4. `ImportEventTimeline` owns import job event projection into qitu timeline items.
5. Import page smoke context and guards read all four modules so row, recovery, and timeline logic
   does not drift back into the composition module unnoticed.

Reason:

Import diagnostics had three distinct modification rhythms in one detail module: runtime metadata,
operator recovery guidance, and event stream rendering. Splitting those focused modules improves
locality for import diagnostics changes while preserving the same caller-facing details interface.

### 2026-07-06: Invitation Row Detail And Action Modules

Decision:

Keep `apps/web/src/workspace-page-sections/invitation-row.tsx` as the invitation row composition
module, and move metadata/email diagnostics and lifecycle actions into focused app-owned modules.

Rules:

1. `InvitationRow` owns the row surface layout and composes focused row modules.
2. `InvitationRowDetails` owns invitation email, created/expires/accepted/revoked timestamps, latest
   email status, and failed-email diagnostic copy.
3. `InvitationRowActions` owns status/role/email badges and the resend/revoke/delete action
   availability rules for pending, expired, and revoked invitations.
4. Import page smoke context and guards read all three modules so invitation lifecycle actions and
   email delivery diagnostics do not drift back into the row composition module unnoticed.

Reason:

Invitation rows combine two different modification rhythms: operator-facing delivery diagnostics
and auth lifecycle action rules. Splitting those focused modules improves locality for invitation
management changes while preserving the same caller-facing row interface and keeping the behavior in
app-owned Web code.

### 2026-07-06: UI Primitive Smoke Guard Modules

Decision:

Keep `scripts/smoke-ui-primitive-guards.mjs` as the UI primitive guard entrypoint, and move its
registry inventory, facade split checks, and qitu-composed primitive/style checks into focused smoke
guard modules.

Rules:

1. `smoke-ui-primitive-guards.mjs` only orchestrates focused UI primitive guard groups.
2. `smoke-ui-primitive-inventory-guards.mjs` owns registry-backed primitive facade existence checks.
3. `smoke-ui-primitive-facade-guards.mjs` owns package-internal facade split checks for
   registry-backed and qitu queue/table primitives.
4. `smoke-ui-primitive-composition-guards.mjs` owns qitu-composed primitives, shell pieces, icons,
   token-backed style imports, and aggregate source/style checks.
5. Smoke inventory guards must list the focused UI primitive guard modules so a future cleanup does
   not silently remove them.

Reason:

The UI primitive smoke guard had become one long assertion mixing primitive inventory, package
facade split checks, and qitu-composed style checks. Splitting the guard modules improves locality
for future UI primitive changes while preserving the existing `assertUiPrimitiveGuards(context)`
interface used by the smoke runner.

### 2026-07-06: Worker Smoke Context Surface Modules

Decision:

Keep `scripts/smoke-context-worker.mjs` as the Worker smoke context entrypoint, and move Worker
source input assembly into focused context modules by runtime, auth, advisory, inbound email/MIME,
import/review, and source intake surfaces.

Rules:

1. `createSmokeWorkerContext` preserves the existing context field names consumed by Worker, package,
   UI, neutrality, and runtime smoke guards.
2. `smoke-context-worker-runtime.mjs` owns package/runtime source aggregation such as
   `workerSources`, Worker package metadata, `.dev.vars.example`, and Wrangler config text.
3. `smoke-context-worker-auth.mjs`, `smoke-context-worker-advisory.mjs`,
   `smoke-context-worker-inbound.mjs`, `smoke-context-worker-import.mjs`, and
   `smoke-context-worker-source.mjs` own their respective grouped source-text inputs.
4. Smoke context inventory guards must list the focused Worker context modules so a future cleanup
   does not silently collapse coverage back into the entrypoint.
5. This changes smoke input locality only; it does not change Worker runtime code, routes, schemas,
   migrations, or package boundaries.

Reason:

The Worker smoke context had become a large input aggregator mixing unrelated Worker surfaces. The
guard consumers already operate by surface, so splitting the context readers improves locality for
future Worker route/store refactors while keeping the same `createSmokeWorkerContext` interface.

### 2026-07-06: Web Shell Smoke Guard Modules

Decision:

Keep `scripts/smoke-web-shell-guards.mjs` as the Web shell composition guard entrypoint, and move
workspace-home, module inventory, shell search, shell navigation, and route/overlay composition
assertions into focused guard modules.

Rules:

1. `assertWebShellCompositionGuards` preserves the existing smoke runner interface and only
   orchestrates focused Web shell guard groups.
2. `smoke-web-shell-home-guards.mjs` owns the app-owned workspace home slot invariant.
3. `smoke-web-shell-inventory-guards.mjs` owns Web shell module existence checks.
4. `smoke-web-shell-search-guards.mjs` owns search overlay module split checks.
5. `smoke-web-shell-navigation-guards.mjs` owns navigation model and app route navigation checks.
6. `smoke-web-shell-route-guards.mjs` owns route content, loading shell, overlay state, chrome node,
   and fallback-route split checks.
7. Smoke Web inventory guards must list the focused shell guard modules so future cleanup does not
   silently collapse coverage back into the entrypoint.

Reason:

The Web shell smoke guard had become a mixed assertion module spanning home-slot replacement,
module inventory, search overlay decomposition, navigation model placement, and route/overlay
composition. Splitting by guard intent improves locality for future shell refactors while
preserving the same `assertWebShellCompositionGuards(context)` interface.

### 2026-07-06: UI Primitive Facade Smoke Guard Families

Decision:

Keep `scripts/smoke-ui-primitive-facade-guards.mjs` as the UI primitive facade guard entrypoint,
and move package-internal facade split assertions into overlay, form/control, and data/list guard
modules.

Rules:

1. `assertUiPrimitiveFacadeGuards` preserves the existing smoke runner interface and only
   orchestrates focused UI primitive facade guard groups.
2. `smoke-ui-primitive-overlay-facade-guards.mjs` owns alert dialog, dialog, and dropdown menu
   facade split checks.
3. `smoke-ui-primitive-form-facade-guards.mjs` owns calendar, command, input group, and select
   facade split checks.
4. `smoke-ui-primitive-data-facade-guards.mjs` owns table and upload queue facade split checks.
5. Smoke UI inventory guards must list the focused facade guard modules so future cleanup does not
   silently collapse coverage back into the facade entrypoint.

Reason:

The UI primitive facade guard still mixed multiple primitive families with different modification
rhythms. Splitting by primitive family improves locality for registry-backed primitive refactors
while preserving the same `assertUiPrimitiveFacadeGuards(context)` interface.

### 2026-07-06: Web Action Workflow Smoke Guard Modules

Decision:

Keep `scripts/smoke-web-action-workflow-guards.mjs` as the Web action workflow guard entrypoint,
and move auth/session, workspace/user/upload, and review action assertions into focused guard
modules.

Rules:

1. `assertWebActionWorkflowGuards` preserves the existing smoke runner interface and only
   orchestrates focused Web action workflow guard groups.
2. `smoke-web-action-auth-guards.mjs` owns auth workflow, session completion, local setup, login,
   and password-reset action module split checks.
3. `smoke-web-action-workspace-guards.mjs` owns user-management, upload queue, workspace review data,
   upload queue state, and permission projection split checks.
4. `smoke-web-action-review-guards.mjs` owns review job, record, decision, commit, and advisory
   action split checks.
5. Smoke Web inventory guards must list the focused action workflow guard modules so future cleanup
   does not silently collapse coverage back into the entrypoint.

Reason:

The Web action workflow smoke guard mixed several unrelated action families in one assertion. The
runtime modules are already split by auth, workspace support, and review action concerns, so
matching the guard structure to those surfaces improves locality for future Web workflow refactors
while preserving the same `assertWebActionWorkflowGuards(context)` interface.

### 2026-07-06: Authenticated Workspace Prop Section Modules

Decision:

Keep `apps/web/src/app-controller-workspace-props.ts` as the authenticated workspace prop projection
facade, and move section-level prop mapping into `app-controller-workspace-prop-sections.ts` with
shared builder input typing in `app-controller-workspace-prop-types.ts`.

Rules:

1. `buildAuthenticatedWorkspaceProps(options)` remains the only interface used by
   `useAppController`.
2. `app-controller-workspace-prop-sections.ts` owns the audit, review, session, shell, upload, user
   management, and workspace data prop projections.
3. `app-controller-workspace-prop-types.ts` owns `BuildAuthenticatedWorkspacePropsOptions`, keeping
   hook return shapes out of the facade implementation.
4. Top-level and action workflow smoke guards must read the facade, section builders, and type module
   so review/session/shell mapping does not drift back into the orchestration hook or a single large
   facade body.
5. This remains app-owned Web shell code; it does not introduce reusable core package knowledge or
   business-specific vocabulary.

Reason:

The authenticated workspace props builder had become a single object literal covering several
change rhythms: audit filters, review workflow actions, session state, shell chrome, upload queue,
user management, and workspace home data. Keeping the public facade while splitting section builders
improves locality for future workspace UI changes without widening the external interface consumed
by the controller.

### 2026-07-06: Mock Invitation Lifecycle Operations

Decision:

Keep `apps/web/src/mock-api-invitation-routes.ts` as the mock invitation route matcher, and move
invitation create, accept, revoke, resend, and delete mutations into
`apps/web/src/mock-api-invitation-operations.ts`.

Rules:

1. Mock invitation routes own HTTP path/method matching, request body reading, and response shaping.
2. `mock-api-invitation-operations.ts` owns mock invitation state mutation, audit events, session
   creation for accepted invitations, and structured not-found errors for unknown invite tokens.
3. `mock-api-operations.ts` and `mock-api-support.ts` re-export the invitation operations used by
   route and compatibility callers.
4. Mock API smoke guards must read both the route module and operation module so lifecycle mutation
   details do not drift back into the route matcher.
5. This remains browser-local mock API code; it does not affect Worker routes or reusable packages.

Reason:

The mock invitation route handler had become a mixed module: it matched endpoints and also mutated
invitation lifecycle state. Moving lifecycle behavior behind the existing mock invitation operations
module improves locality for invitation test-fixture changes while preserving the route handler
interface consumed by the mock API facade.

### 2026-07-06: Mock Auth Lifecycle Operations

Decision:

Keep `apps/web/src/mock-api-auth-routes.ts` as the mock auth route matcher, and move demo session,
login, logout, password-reset request, password-reset confirmation, and local bootstrap mutations
into `apps/web/src/mock-api-auth-operations.ts`.

Rules:

1. Mock auth routes own HTTP path/method matching, request body reading, health response shaping, and
   operation dispatch.
2. `mock-api-auth-operations.ts` owns mock auth state mutation, audit events, demo session shape,
   password-reset token/URL response data, and local bootstrap created/reset semantics.
3. `bootstrapDemoUser` must compute `created` before mutating state so local demo setup notices can
   distinguish newly created users from resets.
4. `mock-api-operations.ts` and `mock-api-support.ts` re-export the auth operations used by route and
   compatibility callers.
5. Mock API smoke guards must read both the route module and operation module so auth lifecycle
   mutation details do not drift back into the route matcher.

Reason:

The mock auth route handler matched endpoints while also mutating user/session state, writing audit
events, and generating password-reset artifacts. Moving that lifecycle behavior behind the existing
mock auth operations module improves locality for browser-local auth fixture changes and fixes the
local bootstrap `created` signal without changing the route handler interface.

### 2026-07-06: Mock Advisory Lifecycle Operations

Decision:

Keep `apps/web/src/mock-api-advisory-routes.ts` as the mock advisory route matcher, and move
advisory generate, confirm, and dismiss mutations into
`apps/web/src/mock-api-advisory-operations.ts`.

Rules:

1. Mock advisory routes own HTTP path/method matching, list response shaping, and operation dispatch.
2. `mock-api-advisory-operations.ts` owns suggested-advisory duplicate detection, advisory state
   mutation, audit events, import-job event entries, and mock state persistence.
3. `createAdvisory` remains the deterministic artifact factory used inside the operation module.
4. `mock-api-operations.ts` and `mock-api-support.ts` re-export the advisory operations used by route
   and compatibility callers.
5. Mock API smoke guards must verify that `pushAudit`, `pushJobEvent`, and `writeState` do not drift
   back into the advisory route matcher.

Reason:

The mock advisory route handler still mixed endpoint matching with human-decision lifecycle writes.
Moving generate/confirm/dismiss behavior behind the existing mock advisory operations module keeps
AI advisory fixture changes local while preserving the route handler interface consumed by the mock
import route facade.

### 2026-07-06: Mock Import Job Lifecycle Operations

Decision:

Keep `apps/web/src/mock-api-import-job-routes.ts` as the mock import-job route matcher, and move
local queue drain, commit, and retry mutations into
`apps/web/src/mock-api-import-job-operations.ts`.

Rules:

1. Mock import-job routes own HTTP path/method matching, list/event response shaping, and operation
   dispatch.
2. `mock-api-import-job-operations.ts` owns queued-job drain state transitions, commit persistence,
   retry failure reset, retry audit event, and mock state persistence.
3. `mock-api-import-job-status.ts` continues owning shared status transition helpers and job-event
   projection.
4. `mock-api-operations.ts` and `mock-api-support.ts` re-export import-job operations used by route
   and compatibility callers.
5. Mock API smoke guards must verify retry/drain mutation details do not drift back into the
   import-job route matcher.

Reason:

The mock import-job route handler still mixed endpoint matching with local queue drain, commit
persistence, and retry state/audit writes. Moving lifecycle behavior behind a focused operation
module improves locality for browser-local import job fixture changes while keeping list/event
routes thin.

### 2026-07-06: Mock Import Review Decision Operations

Decision:

Keep `apps/web/src/mock-api-import-review-routes.ts` as the mock import review route matcher, and
move route-facing review decision persistence into
`apps/web/src/mock-api-review-decision-operations.ts`.

Rules:

1. Mock import review routes own HTTP path/method matching, review read response shaping, and
   operation dispatch.
2. `confirmPendingRecordsForState` and `decideRecordForState` own current-user lookup and mock
   state persistence for review decision mutations.
3. `confirmPendingRecords` and `decideRecord` remain lower-level mutation helpers used inside the
   decision operation module.
4. Mock API smoke guards must verify review decision routes dispatch through the route-facing
   operations and do not call `writeState` directly.

Reason:

The import review route already delegated the actual record/audit/job-event mutation, but it still
owned user lookup and state persistence for review decisions. Moving those details into the review
decision operation module makes the route matcher thinner and keeps decision lifecycle writes local.

### 2026-07-06: Mock Workspace Write Operations

Decision:

Keep `apps/web/src/mock-api-workspace-routes.ts` as the mock workspace route matcher, and move user
delete and source-upload persistence into focused operation modules.

Rules:

1. Mock workspace routes own HTTP path/method matching, list response shaping, audit filtering
   response shaping, and operation dispatch.
2. `mock-api-user-operations.ts` owns demo user deletion validation, user state mutation, audit
   event writing, and mock state persistence.
3. `uploadSourceFileForState` in `mock-api-source-upload.ts` owns current-user lookup and mock state
   persistence around the existing upload implementation.
4. `mock-api-operations.ts` and `mock-api-support.ts` re-export workspace write operations used by
   route and compatibility callers.
5. Mock API smoke guards must verify `pushAudit` and `writeState` do not drift back into the
   workspace route matcher.

Reason:

The workspace route handled several read endpoints and still embedded two write workflows: deleting
users and persisting source uploads. Moving those writes behind user and upload operation modules
keeps route matching thin while concentrating browser-local fixture state changes near the behavior
that owns them.

### 2026-07-06: Animated Icon CSS Motion Variables

Decision:

Keep `packages/ui/src/styles/animated-icon.css` as the AnimatedIcon motion stylesheet, and replace
repeated per-motion ancestor hover selectors with root-level CSS transform variables consumed by
icon part selectors.

Rules:

1. `AnimatedIcon` continues exposing the same `qitu-animated-icon` classes and `data-motion`
   interface.
2. Hover/focus state for buttons, links, panel actions, command rows, primary buttons, and topbar
   controls sets `--qitu-icon-*-transform` variables on the icon root.
3. Icon part selectors read those variables once, keeping motion behavior local without repeating
   the same ancestor selector for every SVG part.
4. The reduced-motion media rule remains in the same stylesheet and must continue disabling icon
   transitions and transforms.
5. UI smoke guards must verify the variable-driven motion shape so the file does not drift back
   into a long repeated-selector implementation.

Reason:

The animated icon stylesheet had become the largest UI source file mostly because each motion
repeated the same hover/focus ancestor selector. Moving transforms to CSS variables preserves the
public icon interface while improving locality for future motion tweaks and cutting repeated CSS.

### 2026-07-06: Animated Icon Registry Groups

Decision:

Keep `packages/ui/src/animated-icon-registry.tsx` as the public `iconRegistry` composition module,
and move selected SVG definitions into `animated-icon-registry-shell.tsx` and
`animated-icon-registry-workflow.tsx` with shared `IconDefinition` typing in
`animated-icon-registry-types.ts`.

Rules:

1. `AnimatedIcon` continues importing `iconRegistry` from `animated-icon-registry.tsx`.
2. Shell chrome icons live in `animated-icon-registry-shell.tsx`; review/intake/workflow icons live
   in `animated-icon-registry-workflow.tsx`.
3. `animated-icon-registry-types.ts` owns `IconDefinition`, while `animated-icon-types.ts` continues
   owning public icon names, props, and motion names.
4. UI smoke guards must read the aggregator and grouped registry modules so new icons do not drift
   back into one large registry file.

Reason:

The registry had become the largest TypeScript UI source file, but the public interface was still
useful. Grouping selected SVG definitions by change rhythm improves locality for future shell and
workflow icon additions while preserving the existing `AnimatedIcon` interface.
