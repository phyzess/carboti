# Claude Code Notes

Use `CLAUDE.md` as the primary instruction file.

Claude Code should be especially careful not to:

1. Collapse reusable `packages/*` into app-owned feature code.
2. Add business terminology to core packages.
3. Create a large framework before a vertical slice proves the shape.
4. Skip decision-log updates.

When implementing, prefer vertical slices over broad scaffolding.
