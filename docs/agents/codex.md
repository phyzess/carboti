# Codex Notes

Use `AGENTS.md` as the primary instruction file.

Recommended behavior:

1. Use Nushell via `nu -lc`.
2. Read the project docs before code edits.
3. Keep edits tightly scoped.
4. Update decision log for durable decisions.
5. Preserve the core/business boundary.

Common first commands:

```text
nu -lc 'ls'
nu -lc 'rg -n "TODO|Decision|Status" docs'
nu -lc 'rg --files'
```
