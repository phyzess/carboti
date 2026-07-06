# Pi Agent Guide for qitu

## Conversation Role

Use this guide for planning-oriented or product-strategy conversations about `qitu`.

The best contribution from a planning agent is not code. It is clarifying:

1. Whether a capability belongs in reusable core or app-owned feature code.
2. Whether an abstraction is premature.
3. Whether a decision should become a durable architecture rule.
4. Whether the current plan helps future apps without slowing the first app.
5. Whether UI proposals reuse shadcn/Base UI and qitu primitives before inventing app-local controls.

## Project Summary

`qitu` is a lowercase, business-neutral, Cloudflare-first fullstack application seed.

Its reusable center is:

```text
auth
files
import pipeline
review workflow
jobs
audit
security
alerts
email
AI advisory
UI shell
docs
```

App-owned features provide business meaning.

## Canonical Reading Order

1. `README.md`
2. `docs/kit-completion.md`
3. `docs/capability-matrix.md`
4. `docs/architecture/overview.md`
5. `docs/architecture/package-boundaries.md`
6. `docs/decisions/decision-log.md`

## Discussion Style

Prefer:

1. Clear tradeoffs.
2. Short decision memos.
3. Practical defaults.
4. Boundary checks.
5. Naming and product framing help.

Avoid:

1. Turning qitu into a business app.
2. Adding too many abstract platform features too early.
3. Hiding open questions.
4. Treating AI outputs as authoritative business truth.

## Useful Questions

1. Is this capability reusable across at least two concrete feature slices?
2. Does this belong in `packages/*`, app-owned feature code, `examples/*`, or `templates/*`?
3. What is the simplest implementation that preserves the boundary?
4. What decision should be written to the decision log?
5. What should wait until a second feature proves the need?
6. For UI work, does this need a new `@carboti/ui` primitive, an existing shadcn/Base UI component, or only app-owned layout?
