# Agent Integration

Status: draft
Date: 2026-06-27

## 1. Purpose

`qitu` should be easy for coding and planning agents to understand. This repository includes explicit entrypoints for:

1. Codex and other AGENTS.md-compatible coding agents.
2. Claude Code.
3. Pi-style planning or conversational agents.

## 2. Root Entrypoints

| File        | Intended agent        | Purpose                                                |
| ----------- | --------------------- | ------------------------------------------------------ |
| `AGENTS.md` | Codex / coding agents | Operational instructions, shell preference, boundaries |
| `CLAUDE.md` | Claude Code           | Claude Code-specific working rules                     |
| `PI.md`     | Pi / planning agents  | Product and architecture discussion guide              |

## 3. Canonical Reading Order

For any agent:

1. `README.md`
2. `docs/kit-completion.md`
3. `docs/capability-matrix.md`
4. `docs/architecture/overview.md`
5. `docs/architecture/package-boundaries.md`
6. `docs/decisions/decision-log.md`
7. The task-specific architecture doc.

## 4. Task Routing

### 4.1 Core Architecture Tasks

Read:

1. `docs/architecture/overview.md`
2. `docs/architecture/package-boundaries.md`
3. `docs/architecture/data-model.md`

Output:

1. Architecture doc updates.
2. Decision log entry.
3. Boundary notes.

### 4.2 Import Pipeline Tasks

Read:

1. `docs/architecture/import-pipeline.md`
2. `docs/architecture/data-model.md`
3. `docs/architecture/auth-security.md`
4. `docs/guides/add-feature.md`

Output:

1. Generic workflow updates.
2. Adapter contract updates.
3. Tests for idempotency and review transitions.

### 4.3 Auth/Security Tasks

Read:

1. `docs/architecture/auth-security.md`
2. `docs/architecture/data-model.md`

Output:

1. Token/session-safe implementation.
2. Security event handling.
3. Redaction checks.

### 4.4 Business Feature Tasks

Read:

1. `docs/guides/add-feature.md`
2. `docs/architecture/package-boundaries.md`
3. App-specific docs, if present.

Output:

1. Feature adapter.
2. Feature staging schema.
3. Feature UI pages.
4. No business leakage into core packages.

### 4.5 UI Component Tasks

Read:

1. `docs/architecture/ui-design-system.md`
2. `docs/architecture/package-boundaries.md`
3. `docs/decisions/decision-log.md`

Output:

1. shadcn/Base UI registry discovery before bespoke implementation.
2. New or changed primitives wrapped in `packages/ui` and exported from `@carboti/ui`.
3. App pages consuming `@carboti/ui`, not direct Base UI imports or page-local shadcn lookalikes.
4. Smoke or package-interface coverage when a primitive becomes a required paved path.

## 5. Agent Safety Rules

1. Do not log secrets.
2. Do not invent Cloudflare limits without checking docs.
3. Do not silently change architecture decisions.
4. Do not add business-specific code to core packages.
5. Do not implement AI paths that bypass human confirmation.
6. Do not add new frameworks without a decision record.
7. Do not hand-write shadcn-style controls in app pages before checking the shadcn/Base UI registry and existing qitu primitives.

## 6. Handoff Format

When handing off work, include:

```text
Objective
Files changed
Current decisions
Open questions
Verification performed
Next recommended step
```
