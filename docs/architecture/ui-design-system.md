# UI and Design System

Status: accepted baseline
Date: 2026-07-06

## 1. Purpose

`qitu` should ship with a serious internal-app visual baseline, not a generic admin template.

The design entry point is `DESIGN.md`. This architecture document explains package boundaries and reusable implementation requirements.

The UI should feel:

1. Quiet.
2. Dense but readable.
3. Fast.
4. Auditable.
5. Built for repeated work.
6. Modern without decorative noise.

## 2. Technology Baseline

```text
React
TanStack Router for app-owned web routes
shadcn/ui Base UI through the `base-nova` preset
Tailwind
Extend UI inspiration for file/import/review surfaces
visx-only chart primitives
```

The root `components.json` records the workspace shadcn contract. The package-local
`packages/ui/components.json` is the executable install target used by the root
`vp run ui:*` scripts; it uses `style: "base-nova"` and resolves registry output
into `packages/ui/src`. Interactive qitu primitives are registry-backed shadcn/Base
UI components or thin compositions of those components; app-owned pages must
consume `@carboti/ui` and must not import Base UI directly.

Primitive governance rules:

1. When a common interactive primitive is missing, check the shadcn/Base UI registry first.
2. Use `vp run ui:search --query "<component or behavior>"` to find candidates, `vp run ui:docs <component>` to inspect Base UI usage, and `vp run ui:view <component>` when the registry output needs review before install.
3. Prefer installing registry-backed components with `vp run ui:add <component> --dry-run`, then `vp run ui:add <component>` after reviewing the output. The package-local shadcn config routes generated files into `packages/ui/src`.
4. If no single registry component fits, compose existing shadcn/qitu primitives before writing a bespoke primitive.
5. Registry-backed primitives and qitu-specific wrapper compositions must live in `packages/ui` and be exported from `@carboti/ui` before app pages consume them.
6. App pages must not mimic shadcn styling by hand, directly import Base UI, or silently fall back to raw `type="date"` inputs, raw checkbox controls, page-local menus/dialogs, or page-local table structures when qitu shared primitives exist.
7. Bespoke primitives need a decision-log entry explaining why the registry and existing qitu primitive composition were insufficient.
8. Shared primitives should keep business-neutral names and props such as source, file, job, status, action, value, and item.
9. Density for lists, tables, cards, rows, and action bars belongs in reusable qitu tokens/classes, not page-local padding fixes.
10. Smoke or package-interface checks should guard newly paved primitives when app pages are expected to use them.

The component provenance ledger lives in
`docs/architecture/ui-component-provenance.md`. Any new shared primitive should update that ledger in
the same change that adds or refreshes the implementation.

Current first-pass shared primitive surface:

```text
AlertDialog
Badge
BatchActionBar
Button
Calendar
Card
Checkbox
Command
ConfirmDialog
DateField
Dialog
Drawer
Form/TextField/Input/SelectField
InputGroup
ListFrame
ListActionRow
Menu
Popover
RadioGroup
Separator
SegmentedControl
Sheet
StatusBadge
Table
Tabs
Textarea
UploadQueue
Surface/DataState/MetricStrip/Timeline
```

## 3. Package Split

```text
packages/ui
packages/design-system
packages/charts
```

`packages/ui` owns:

1. App shell.
2. Topbar primary navigation and secondary route tabs.
3. Command/search affordance, theme controls, and user trigger/panel.
4. Layout and surfaces.
5. Forms.
6. Tables.
7. Modals.
8. Review surfaces.
9. Timeline components.
10. Data-state components.
11. Animated icon registry for product chrome.

`packages/ui/src/shell.tsx` is the stable shell interface facade. The AppShell frame,
primary/secondary navigation controls, shell props/types, and small system icons live in focused
package-internal shell modules so app pages can keep importing the same `@carboti/ui` shell surface.

`packages/ui/src/primitives.tsx` is the stable shared primitive interface facade. Surface,
section-header, data-state, metric-strip, timeline, and panel-action-button implementations live in
focused package-internal modules while app pages keep importing those primitives from `@carboti/ui`.

`packages/ui/src/styles.css` is the stable package stylesheet entrypoint. It may import focused
implementation modules under `packages/ui/src/styles/*` for theme mapping, shell frame, toolbars,
animated icons, overlays, form controls, upload/list rows, shared controls, surfaces, and responsive
rules. New reusable visual rules should extend the focused module that owns their selector family
instead of growing the entrypoint file.

`packages/design-system` owns:

1. Color tokens.
2. Typography tokens.
3. Spacing.
4. Shadows.
5. Motion.
6. Radius.
7. Theme variables.

Canonical token names use the `--qitu-*` namespace. The design-system package
must not define non-qitu custom properties; reusable qitu packages and app pages
should consume canonical `--qitu-*` tokens directly.

Token families are layered as three groups:

1. Primitive tokens: scale, space, radius, layout, z-index, chroma, and raw color.
2. Semantic tokens: background, surfaces, text, state, focus, shadow, type, and motion.
3. Component tokens: topbar, control, input, overlay, table, chart, and app shell affordances.

`packages/charts` owns:

1. Time series.
2. Bar chart.
3. Donut chart.
4. Scatter/compare chart.
5. Tooltip, legend, crosshair.

## 4. Workbench Model

The default qitu application surface is:

```text
topbar: brand | primary tabs | search + actions + user trigger
subnav: current primary section route tabs
main: work surface + contextual inspector + event/import stream when needed
```

Reusable pages should start from this workbench model. A concrete app may reorder regions for its domain, but should not rebuild the app shell from scratch.

Authenticated apps must expose the shell as real routes, not a single stateful demo screen. The baseline routes are:

```text
/login
/workspace
/workspace/sources
/workspace/imports
/workspace/reviews
/settings
/settings/members
/settings/audit
```

`apps/web` owns the route tree, route matching, and navigation lifecycle through TanStack Router. Reusable UI packages stay router-agnostic: they may expose `href` values and callbacks, but they must not import app router APIs.

The shell must keep unauthenticated, authenticated, admin-only, not-found, loading, empty, and error states visually consistent. The account entry belongs in the authenticated topbar, logout belongs in the user panel opened from that entry, and member/invitation management belongs behind RBAC in Settings rather than being hidden as a code-only capability.

Shell interaction rules:

1. Primary navigation groups existing routes into a small number of business-neutral sections.
2. The active primary section exposes its subroutes in a topbar secondary navigation row.
3. Primary navigation may remember the last visited subroute for each section in session storage, but only route ids are stored.
4. Topbar command search is a real `Cmd/Ctrl+K` control over route and app-owned data projections.
5. Authenticated account controls open a user panel with profile, RBAC role, member/invitation settings when permitted, theme switching, and logout.
6. Language switching is app-owned, persisted client-side, and available before login; the starter supports English and Simplified Chinese while keeping room for more locale dictionaries.
7. Theme switching is token-driven and supports light, dark, and system preferences without changing reusable package semantics.
8. Desktop route navigation must not use a side rail or sidebar. A drawer may exist only as a compact/mobile disclosure pattern.
9. Desktop primary navigation follows the qitu route-control shape: icon-only main route buttons, a compact active underline, then a divider and adjacent active/hover live label.
10. Under constrained width, primary navigation remains pure icon and may hide the adjacent live label.
11. Secondary route tabs are text-only with an active underline.
12. Search sits in the topbar action cluster: icon-only when compact, icon + text + shortcut when wide.
13. Theme remains a compact icon control; language uses a compact icon trigger that opens explicit locale choices. The user trigger is an identity affordance, such as avatar or initial plus chevron; user actions belong inside the panel.

Workbench page rules:

1. Avoid duplicate route titles. When the shell and secondary navigation already show location, page
   content should start with the first real work module instead of repeating a large route heading.
2. Data and analysis pages should be result-first: show the primary state, chart, or work surface
   before filters and diagnostics. Filters, inputs, and secondary metrics should sit in a toolbar,
   inspector, or side area when space allows.
3. Large detail tables should use bounded scroll containers so they do not push the primary work
   surface out of the first viewport. Prefer a shared `TableScrollArea` or qitu table wrapper before
   adding page-local overflow recipes.
4. New-user default language is app-owned configuration. `packages/i18n` provides locale primitives;
   the web app owns the default locale and browser persistence policy.

Current starter grouping:

```text
Workspace: /workspace, /workspace/sources, /workspace/imports, /workspace/reviews
Settings: /settings, /settings/members, /settings/audit
```

Settings routes remain authenticated app routes because they are part of the reusable starter surface, but they should not be framed as business workflow modules. Member/invitation management and audit visibility are exposed through Settings, with member/invitation management disabled for non-admin route navigation.

Internationalization rules:

1. `packages/i18n` owns locale metadata types, typed dictionary helpers, message interpolation, fallback, locale negotiation, code-label helpers, and locale-aware date/number/byte/plural/relative-time formatting primitives.
2. `apps/web` owns the React provider, persisted locale preference, document language updates, explicit language chooser, and qitu web shell dictionaries.
3. English remains the default locale for stable local development and existing smoke coverage.
4. Reusable `packages/ui` components accept strings by prop and must not import app-owned dictionaries.
5. Adding a locale requires a complete app dictionary that typechecks against the English key set.
6. Worker routes may derive locale from request body, `x-qitu-locale`, locale cookie, or `Accept-Language`; package code must not import web dictionaries.
7. Machine-readable server codes may stay canonical until the API exposes stable display metadata; UI labels should be translated at the app layer.

Visual extraction rules:

1. qitu keeps its own business-neutral token names and component contracts.
2. The qitu visual layer uses OKLCH purple-gray neutrals, compact controls, soft chroma status colors, thin lines, and restrained shadows.
3. Primary surfaces use the shared hierarchy tokens: `--qitu-surface-panel`, `--qitu-surface-row`, `--qitu-surface-row-hover`, `--qitu-surface-row-active`, `--qitu-surface-field`, and `--qitu-color-popover`; app pages should not hard-code RGB overlays or one-off surface colors.
4. Controls follow the 28/32/36px scale with `--qitu-radius-control` and shared focus rings.
5. Shadows are reserved for overlays or active affordances. Most cards use tonal surface fill; visible lines are reserved for controls, overlays, focus, and table separators.
6. Icon chips, avatar/initial triggers, form fields, list actions, table cells, and overlay backdrops should use shared `packages/ui` utilities instead of page-local Tailwind recipes.
7. Animated icons are owned by `packages/ui` through `AnimatedIcon`; app pages must not define local animated SVG recipes for shell or reusable control chrome.

Surface hierarchy rules:

1. App background uses a uniform `--qitu-bg` family through `--qitu-app-bg-gradient`; topbar uses the same tonal family and does not add a divider or shadow.
2. Ordinary page panels use `.qitu-surface`: `--qitu-surface-panel` and transparent structural borders by default.
3. Nested metrics, list rows, guardrails, timeline items, and data states use `.qitu-surface-subtle`: `--qitu-surface-row` and transparent structural borders by default.
4. Hover moves nested rows to `--qitu-surface-row-hover`; selected or active rows move to `--qitu-surface-row-active` plus `--qitu-shadow-active-ring`.
5. Form controls use `--qitu-input-bg`, `--qitu-input-border`, and `--qitu-shadow-focus-ring`; read-only fields use row fill without visible borders unless they are focused or active.
6. Review table cells use the same row surface as list rows. Table structure may use spacing and radius, not separate local shadows.
7. Search dialogs, popovers, and user panels add `.qitu-overlay-surface`, using `--qitu-color-popover` and `--qitu-shadow-overlay`; ordinary page panels must not use overlay shadows.
8. Layering uses `--qitu-z-shell`, `--qitu-z-shell-front`, `--qitu-z-overlay-backdrop`, and `--qitu-z-overlay` rather than page-local z-index numbers.

Control refinement rules:

1. Topbar actions share a 36px control track. Search is icon-only when compact and becomes icon + truncated label + 20px keyboard shortcut at wide widths.
2. Keyboard shortcut chips use a shared kbd style: 20px tall, mono 10px text, tabular numbers, `--qitu-radius-control`, and tonal surface background.
3. Pure icon buttons are used for repeated tools such as refresh and theme. Text + icon is reserved for commands whose meaning is not obvious from the icon alone.
4. The authenticated user trigger is a 36px identity control with a 32px avatar or initial and a chevron. User actions stay inside the panel.
5. Form inputs and selects use the 32px control height, `--qitu-radius-control`, `--qitu-input-bg`, `--qitu-input-border`, compact control typography, and the shared focus ring.
6. Read-only account/runtime rows use a shared label/value field grid, not ad hoc flex rows. Values must truncate, align consistently, and use tabular number styling when appropriate.

Animated icon rules:

1. `AnimatedIcon` is the canonical dynamic icon entry point for shell navigation, command/search, theme/language, refresh, account panel actions, and reusable section headers.
2. `AnimatedIcon` is the public wrapper in `packages/ui/src/animated-icon.tsx`; `packages/ui/src/animated-icon-registry.tsx` composes the public icon map from shell and workflow SVG groups in `packages/ui/src/animated-icon-registry-shell.tsx` and `packages/ui/src/animated-icon-registry-workflow.tsx`, shared registry typing lives in `packages/ui/src/animated-icon-registry-types.ts`, semantic names and props live in `packages/ui/src/animated-icon-types.ts`, and qitu's lightweight local CSS motion lives in `packages/ui/src/styles/animated-icon.css`.
3. App pages must not import icon runtimes or package-internal icon registry modules directly.
4. The registry is intentionally small and semantic. Add a new `AnimatedIconName` only when the icon appears in reusable product chrome or a repeated page pattern.
5. Prefer AnimateIcons/Lucide source geometry first. If a semantic match is missing, choose the closest existing source shape or keep a static Lucide fallback rather than hand-drawing a rough local icon.
6. Dense data tables, timeline rows, destructive confirmations, and one-off page actions may keep static Lucide icons when motion would reduce scanability.
7. Do not add Lottie, `@animateicons/react`, or a second animated icon runtime for app chrome without a dependency and bundle-size decision.
8. Page code may pass `AnimatedIcon` as a React node but must not customize animation timing, keyframes, or accent color outside shared qitu tokens.

Qitu token and visual-system rules:

1. Canonical tokens use the `--qitu-*` namespace; non-qitu custom properties must not be defined or consumed.
2. Topbar primary navigation uses qitu icon-button route controls plus a divider and live label. Do not put route text inside the primary buttons.
3. Ordinary panels use qitu tone separation through `--qitu-surface-panel`, `--qitu-surface-row`, and `--qitu-surface-row-active`; avoid page-local borders or shadows unless elevation communicates an overlay or active state.
4. Active topbar indicators use `--qitu-chroma-active`; do not introduce page-local underline colors.
5. Topbar does not draw a bottom separator line; content separation comes from spacing and surface tone.

Responsive rules:

1. Below `1180px`, inspector/context panels can move below the primary surface.
2. Below `780px`, stack content in workflow order.
3. Avoid horizontal page scroll. Tables may scroll in bounded containers.
4. Use `min-width: 0`, truncation, wrapping, and fixed shell dimensions deliberately.

## 5. Design Rules

1. Do not create a landing page for internal tools.
2. Start with the actual working interface.
3. Use compact page headers.
4. Prefer tonal separation over visible borders; use fine lines only where they carry interaction or table structure.
5. Keep cards shallow and purposeful.
6. Do not nest cards inside cards.
7. Use fixed dimensions for toolbars, grids, counters, tiles, and chart shells.
8. Do not scale type with viewport width.
9. Use tabular numbers for metrics.
10. Keep chart APIs internal; app pages should not import chart engine packages directly.
11. Use semantic color only for state, risk, status, and charts.
12. Loading, empty, error, and partial states are part of the component contract.

## 6. Font Direction

Default font tokens:

```text
--qitu-font-ui
--qitu-font-doc
--qitu-font-reading
--qitu-font-number
--qitu-font-mono
```

Recommended defaults:

1. UI: MiSans or system CJK sans fallback.
2. Documents: Noto Serif SC.
3. Reading template: optional LXGW WenKai Screen.
4. Numbers: UI font + Fira Code fallback.
5. Mono: Fira Code.

## 7. Chart Contract

`packages/charts` is a maintained visx-only layer. App-owned pages must use qitu chart components and must not import `@visx/*` directly.
`packages/charts/src/index.tsx` is the package interface facade; concrete chart implementations,
shared frame/state rendering, grid rendering, scale/format helpers, theme tokens, and chart-specific
geometry live in focused package-internal modules.

Baseline exported chart components:

1. `TimeSeriesChart`
2. `BarChart`
3. `DonutChart`
4. `ComparisonScatterChart`

Each chart must support:

1. Empty state.
2. Loading state.
3. Error state.
4. Partial-data state.
5. Dark token-driven colors.
6. Tabular number formatting.

## 8. Review Surface Pattern

Every review page should include:

1. Source summary.
2. Parser/rule version.
3. Timeline.
4. Staged data summary.
5. Issues and conflicts.
6. Primary decision actions.
7. Audit preview.
8. Raw file access if permitted.

Viewer projection:

1. Status summary.
2. Timeline summary.
3. No raw file.
4. No review detail.
5. No sensitive parsed rows.

## 9. Starter Component Coverage

The starter shell should include reusable components for:

1. Workbench shell.
2. Status and risk badges.
3. File upload/drop zone.
4. Import job list/table.
5. Review action bar.
6. Staged data table.
7. Metric strip.
8. Context inspector.
9. Timeline/event stream.
10. Data state wrapper.
