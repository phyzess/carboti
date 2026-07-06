# Add a Business Feature

Business features give `qitu` meaning without changing the reusable core.

`qitu` does not require a top-level `features/*` or `domains/*` layout. Choose the organization that fits the app. For React-heavy apps, `apps/web/src/features/*` is usually natural. For Worker-heavy apps, `apps/worker/src/features/*` may be better. If a feature must move as a unit across apps, use a top-level module or package only after the first vertical slice proves the need.

## Recommended Shapes

App-local feature:

```text
apps/web/src/features/<feature-name>/
  routes/
  components/
  hooks/
  model/
  tests/

apps/worker/src/features/<feature-name>/
  routes/
  jobs/
  adapters/
  tests/
```

Portable feature slice, only when proven useful:

```text
features/<feature-name>/
  web/
  api/
  db/
  jobs/
  ai/
  import/
  tests/
```

Example-only code:

```text
examples/<example-name>/
  README.md
  src/
  tests/
```

## Feature Owns

A business-owned feature owns:

1. Source interpretation.
2. Parsed record shape.
3. Validation rules.
4. Review labels.
5. Commit logic.
6. Business-owned tables.
7. Feature UI routes.
8. Feature charts and reports.
9. AI prompts or evals that depend on business meaning.

## Core Owns

Core packages own:

1. File storage.
2. Job lifecycle.
3. Staging record lifecycle.
4. Review workflow primitives.
5. Audit trail.
6. User and permission checks.
7. AI advisory storage.
8. Email plumbing.

## Import Adapter Contract

An import feature may expose an adapter similar to:

```text
feature id
source matcher
parser
staging shape
validation rules
review view metadata
commit handler
```

Prefer `ImportFeatureAdapter` from `@carboti/import-pipeline` for code that plugs into the generic import flow.

## Starter Template

`templates/feature` is a typechecked, copyable starter package. It includes:

1. `src/import-feature.ts` with a neutral CSV-like adapter.
2. `src/registry.ts` with an app-owned adapter registry.
3. A `typecheck` script so the copied feature can compile before real business rules are added.

After copying it into an app, rename the package and register the copied adapter from app-owned Worker code. Do not import copied feature code from `packages/*`.

## Boundary Checklist

Before merging feature code:

1. Does any core package import app-owned feature code directly?
2. Does any core table include business-specific fields?
3. Does any core UI label mention business vocabulary?
4. Can another feature reuse the same import job lifecycle?
5. Are commit operations audited?
6. Are AI suggestions reviewable before commit?
7. Do feature UI pages use existing `@carboti/ui` primitives, or is there a recorded reason to add a new shadcn/Base UI-backed primitive?
8. Did any common control get hand-written as a shadcn lookalike instead of going through the registry-first workflow?

If the answer to 1, 2, or 3 is yes, move the concept back into app-owned feature code.
If the answer to 8 is yes, move the control into the shadcn/Base UI discovery and `@carboti/ui` wrapper flow before merging.
