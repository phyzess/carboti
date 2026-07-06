# qitu Design System

Status: baseline for implementation
Date: 2026-06-28

## Purpose

`qitu` ships a reusable internal-application workbench, not a marketing page and not a generic admin template. The design system must help cloned apps build data-heavy review, import, audit, and analytical workflows without inventing shell, typography, chart, and state patterns from scratch.

The interface should feel:

1. Calm, precise, and durable for daily work.
2. Dense enough for operational users, but never cramped.
3. Tonal, data-first, and traceable.
4. Modern through structure and interaction, not decoration.
5. Reusable across domains without business-specific terms.

Avoid:

1. Hero-page composition.
2. Decorative blobs, gradients, or atmospheric backgrounds.
3. Oversized showcase typography.
4. Excessive cards or nested cards.
5. Color as decoration.
6. Hard grid-line UI that looks like a wireframe.

## Workbench Layout

The primary shell is:

```text
topbar: brand | primary route icons | search/actions/user
subnav: active route group tabs
main: work surface + contextual inspector
event/import stream when the workflow needs it
```

Rules:

1. Use topbar primary route icons for global navigation.
2. Use a top command/search bar for product-level search and global actions.
3. Main content should prioritize the working object: chart, review table, import queue, or audit trail.
4. Contextual panels explain selected data, source files, data quality, guardrails, and next actions.
5. Event streams capture import, validation, review, AI advisory, and audit events.
6. Prefer CSS grid for layout; do not use JS measurement for core sizing.
7. Below `1180px`, inspectors may move below the main surface.
8. Below `780px`, stack regions in workflow order: topbar, primary surface, context, event stream.

## Tokens

The canonical implementation lives in `packages/design-system/src/tokens.css`.

Required token families:

1. Spacing based on compact product UI proportions.
2. Dark tonal surfaces.
3. Semantic state colors only.
4. Scenario-based font tokens.
5. Compact type scale.
6. Semantic radius.
7. Surface shadows and inset hairlines.

Runtime UI uses sans-serif fonts only. Document/report exports may use serif tokens, but the core dashboard/workbench must not.

## Components

`packages/ui` owns business-neutral workbench primitives:

1. `AppShell`, `Topbar`, and route-tab shape.
2. `Surface` and `SectionHeader`.
3. `DataState` for loading, empty, error, partial, and ready states.
4. `MetricStrip` and tabular value patterns.
5. `Timeline` for audit and import event streams.
6. Form, button, badge, file, table, and review action primitives.

App-owned pages may compose those primitives, but should not duplicate shell or design-token behavior.

Interactive primitives follow the shadcn Base UI execution path: the root
`components.json` uses the `base-nova` preset, registry output resolves into
`packages/ui/src`, and reusable components wrap `@base-ui/react`. App pages
consume `@carboti/ui` instead of importing Base UI directly.

## Charts

`packages/charts` is the only chart abstraction. App pages must not import `@visx/*` directly.

Required baseline chart surfaces:

1. `TimeSeriesChart`
2. `DrawdownChart`
3. `PerformancePanelChart`
4. `BarChart`
5. `DonutChart`
6. `ComparisonScatterChart`

Every chart needs readable dark theme defaults and explicit loading, empty, error, and partial-data states.

## Interaction

1. Every interactive element has visible `:focus-visible`.
2. Icon-only controls require `aria-label`.
3. Important filter, tab, pagination, and selection state should be URL-addressable when the page is routable.
4. Loading states use layout-matched skeletons or clear inline status.
5. Errors include the next action or recovery path.
6. Destructive actions require confirmation or undo when they affect durable data.
7. Animations use transform/opacity only and honor `prefers-reduced-motion`.
8. Avoid `transition: all`.

## Animated Icons

Animated icons are a product-chrome affordance, not a decorative layer.

Rules:

1. Use `AnimatedIcon` from `@carboti/ui` for shell navigation, command/search, theme/language, refresh, account panel actions, and section headers.
2. Keep dense table cells, timeline rows, low-frequency secondary actions, and purely confirmational glyphs static unless repeated use proves the motion helps scanning.
3. `AnimatedIcon` vendors selected AnimateIcons Lucide SVG source inside `packages/ui` and implements qitu's lightweight motion locally. App pages must not import icon runtimes directly.
4. Add new animated icon names to `packages/ui/src/animated-icon.tsx`; do not define page-local animated SVGs.
5. Prefer AnimateIcons/Lucide source geometry first. If a semantic match is missing, choose the closest existing source shape or keep a static Lucide fallback instead of hand-drawing a rough local icon.
6. Do not introduce Lottie, `@animateicons/react`, or a second animated icon runtime for app chrome without a new decision entry and bundle review.
7. Icons inherit `currentColor`, use qitu tokens for accent only, and every animated icon must have a calm static rendering and respect `prefers-reduced-motion`.

## Content

1. Starter UI copy stays business-neutral.
2. Use concise action labels.
3. Do not include design-process explanations inside the app.
4. Use tabular numbers for counts, dates, statuses, and IDs.
5. Long identifiers must truncate or wrap intentionally with `min-width: 0`.

## Review Checklist

Before accepting a UI change:

1. Does it use workbench shell patterns instead of a generic admin page?
2. Does it use approved token names, type scale, and semantic colors?
3. Are surfaces separated by tone, shadow, and spacing before borders?
4. Are cards shallow, purposeful, and never nested?
5. Do charts remain readable without animation?
6. Are empty, loading, error, and partial-data states intentional?
7. Are long labels, file names, and IDs stable on mobile and desktop?
8. Are focus, keyboard, and screen-reader basics covered?
9. Are dates and numbers locale-aware where displayed?
10. Can the user understand source, review, and audit provenance for key data?
