# Feature Template

This directory is a copyable, typechecked skeleton for app-owned feature code.

It is intentionally business-neutral. Rename folders, package name, types, and UI labels when a real application adopts it.

## Suggested Shape

```text
feature-name/
  migrations/
    0001_feature_staging.sql
  src/
    fixtures.ts
    import-feature.ts
    routes.ts
    review-ui.tsx
    schema.ts
    web-surface.ts
    tests/
```

Use this only as a starting point. A real app may organize feature code under `apps/web/src/features`, `apps/worker/src/features`, `modules`, `workflows`, or another structure that fits the product.

## Boundary

Feature code may depend on core packages:

```text
@carboti/import-pipeline
@carboti/files
@carboti/jobs
@carboti/audit
@carboti/ui
```

Core packages must not import this feature code.

## First Adapter

Start by copying this directory to the destination feature module, then replace the neutral parsing and commit output with app-owned rules.

The template is deliberately runnable:

1. `src/import-feature.ts` implements `ImportFeatureAdapter`.
2. `src/registry.ts` exports an app-owned adapter registry.
3. `src/fixtures.ts` exports a minimal import fixture for Worker integration and browser smoke.
4. `src/web-surface.ts` exports a route/i18n/smoke descriptor that an app-owned React surface can consume.
5. `migrations/0001_template_feature.sql` is a migration slot for feature-owned staging and committed tables.
6. `vp run --filter @carboti/template-feature typecheck` verifies the copied shape before business rules are added.

The adapter owns:

1. File recognition.
2. Parsing.
3. Staging shape.
4. Validation.
5. Commit rules.
6. The fixture that proves the feature path.
7. The web surface hook that tells the app where the feature plugs into the workbench.
8. The app-owned review store that maps generic review actions to feature-owned staging and commit tables.

The reusable import pipeline owns:

1. Job lifecycle.
2. Review issue lifecycle.
3. Approve/reject/void flow.
4. Audit handoff.

## Register In An App

Keep registration app-owned. A Worker app can import the copied registry and merge it with any other app-local feature adapters:

```ts
import {
  featureImportAdapters,
  featureIntegrationFixtures,
  featureWebSurfaces,
} from "./features/example/registry";

export const appImportAdapters = [...featureImportAdapters] as const;
export const appIntegrationFixtures = [...featureIntegrationFixtures] as const;
export const appWebSurfaces = [...featureWebSurfaces] as const;
```

Do not import the copied feature from `packages/*`. Core packages should stay business-neutral.

## Replace The Starter Feature

For a real product repository:

1. Copy this template under an app-owned feature folder.
2. Move or rewrite the migration into `apps/worker/migrations`.
3. Replace `TemplateParsedRecord`, `TemplateStagedRecord`, and `TemplateCommittedRecord`.
4. Register the feature adapter from `apps/worker/src/import-adapters.ts`.
5. Provide a `WorkerReviewStore` implementation for the feature's staging and committed tables.
6. Add Worker integration coverage using `featureIntegrationFixtures`.
7. Add or replace an app-owned React route using `featureWebSurfaces`.
8. Add browser smoke coverage for upload -> queue -> confirmation -> commit.
9. Remove starter adapters only after the new feature verifies the same vertical slice.
