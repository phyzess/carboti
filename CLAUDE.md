# Claude Code Instructions for qitu

## Purpose

This repository defines `qitu`, a business-neutral fullstack application seed.

Claude Code should treat this repo as an architecture-first scaffold. The current priority is preserving boundaries and producing clean implementation slices, not over-generalizing.

## Must Preserve

1. `packages/*` are reusable and business-neutral.
2. App-owned feature code owns business meaning.
3. Apps compose packages, local features, examples, and templates.
4. AI is advisory only.
5. Imports go through staging and review before commit.
6. Business-sensitive operations are audited.
7. Common UI controls flow through shadcn/Base UI and `@carboti/ui`, not page-local lookalike styling.

## Before Code

Read:

1. `README.md`
2. `docs/kit-completion.md`
3. `docs/capability-matrix.md`
4. `docs/architecture/overview.md`
5. `docs/architecture/package-boundaries.md`
6. `docs/decisions/decision-log.md`

Then identify whether the task belongs to:

```text
core package
app-owned feature
example
template
app composition
docs
```

## Implementation Preferences

1. TypeScript-first.
2. Cloudflare-first.
3. React for web UI.
4. Hono for Worker API.
5. D1 for relational state.
6. R2 for files.
7. Queues for async work.
8. Valibot for runtime validation.
9. Drizzle for schema/migrations.
10. For common UI controls, search shadcn/Base UI first, install or compose inside `packages/ui`, and export through `@carboti/ui` before app pages consume the primitive.

## Avoid

1. Business-specific language in core package names.
2. Hidden global state.
3. Unreviewed AI writes.
4. Silent data overwrites.
5. High-frequency logs in D1.
6. Large raw blobs in D1.
7. Hand-written shadcn-style Tailwind recipes in app pages when a registry-backed or qitu primitive can cover the control.

## Decision Hygiene

When making or changing a durable decision, update:

```text
docs/decisions/decision-log.md
```

When changing project structure, update:

```text
README.md
```
