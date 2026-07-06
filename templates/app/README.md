# qitu App Template

This template is a copy manifest for the current runnable `qitu` skeleton.

It intentionally does not duplicate `apps/web`, `apps/worker`, or `packages/*` inside this folder. Duplicating those files would create drift. Instead, `manifest.json` names the current, verified source paths that a future generator or human adopter should copy into a new application repository.

Current target shape:

```text
apps/
  web/
  worker/
packages/
  auth/
  rbac/
  db/
  files/
  i18n/
  jobs/
  import-pipeline/
  audit/
  email/
  ai-advisory/
  ui/
  config/
examples/
  import-review/
  json-records/
templates/
  feature/
```

The default generated app should use one Worker for HTTP and queue handling. Split into additional Workers only after Email Routing or queue isolation is proven necessary.

## Manual Use

1. Copy every path listed in `manifest.json.copy`.
2. Decide whether to copy the optional example packages listed in `manifest.json.optionalExamples`.
3. Rename app metadata and Cloudflare resources listed in `manifest.json.renameAfterCopy`.
4. Run the commands in `manifest.json.firstCommands`.
5. Add app-owned feature code from `templates/feature`.

The copied app should include:

1. App-managed auth.
2. Invitation flow.
3. Password reset.
4. Protected React shell.
5. R2 source file storage.
6. Queue-backed import job.
7. Staging and review workflow.
8. Audit events.
9. AI advisory artifact storage.
10. Two app-owned starter import feature adapters that prove core boundaries.
11. Locale primitives, app-owned dictionaries, and localized auth email rendering.

No business-specific assumptions should be added to the template.
