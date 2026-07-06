export function assertKitRepoInventoryGuards(context) {
  const { assert, exists } = context;

  assert(!exists("domains"), "top-level domains/ must not exist.");
  assert(exists("examples/import-review"), "examples/import-review must exist.");
  assert(exists("examples/json-records"), "examples/json-records must exist.");
  assert(exists("templates/app"), "templates/app must exist.");
  assert(exists("templates/app/manifest.json"), "templates/app/manifest.json must exist.");
  assert(exists("templates/feature"), "templates/feature must exist.");
  assert(exists("templates/feature/package.json"), "templates/feature/package.json must exist.");
  assert(exists("templates/feature/tsconfig.json"), "templates/feature/tsconfig.json must exist.");
  assert(
    exists("templates/feature/migrations/0001_template_feature.sql"),
    "templates/feature must include a feature-owned migration slot.",
  );
  assert(
    exists("templates/feature/src/import-feature.ts"),
    "templates/feature must expose a real TypeScript adapter starter.",
  );
  assert(
    exists("templates/feature/src/registry.ts"),
    "templates/feature must expose an app-owned registry starter.",
  );
  assert(
    exists("templates/feature/src/fixtures.ts") && exists("templates/feature/src/web-surface.ts"),
    "templates/feature must expose integration fixtures and a web surface descriptor.",
  );
  assert(
    !exists("templates/feature/src/import-feature.ts.txt"),
    "templates/feature must not regress to an unchecked .ts.txt adapter.",
  );
  assert(exists(".github/workflows/verify.yml"), "GitHub verify workflow must exist.");
  assert(exists("AGENTS.md"), "AGENTS.md must exist.");
  assert(exists("CLAUDE.md"), "CLAUDE.md must exist.");
  assert(exists("PI.md"), "PI.md must exist.");
  assert(exists(".env.example"), ".env.example must exist.");
  assert(exists("apps/worker/.dev.vars.example"), "apps/worker/.dev.vars.example must exist.");
}
