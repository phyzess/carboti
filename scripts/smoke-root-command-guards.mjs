export function assertRootCommandGuards(context) {
  const { assert } = context;

  assert(context.packageJson.scripts["setup:local"], "package.json must expose setup:local.");
  assert(context.packageJson.scripts["verify:kit"], "package.json must expose verify:kit.");
  assert(context.packageJson.scripts["deploy:dry-run"], "package.json must expose deploy:dry-run.");
  assert(
    context.packageJson.scripts["deploy:preview:dry-run"],
    "package.json must expose deploy:preview:dry-run.",
  );
  assert(
    context.packageJson.scripts["deploy:production:dry-run"],
    "package.json must expose deploy:production:dry-run.",
  );
  assert(context.packageJson.scripts["deploy:preview"], "package.json must expose deploy:preview.");
  assert(
    context.packageJson.scripts["deploy:production"],
    "package.json must expose deploy:production.",
  );
  assert(
    context.packageJson.scripts["release:preview"],
    "package.json must expose release:preview.",
  );
  assert(
    context.packageJson.scripts["release:production"],
    "package.json must expose release:production.",
  );
  assert(context.packageJson.scripts.health, "package.json must expose health.");
  assert(context.packageJson.scripts["health:preview"], "package.json must expose health:preview.");
  assert(
    context.packageJson.scripts["health:production"],
    "package.json must expose health:production.",
  );
  assert(
    context.packageJson.scripts["ops:failed-jobs"],
    "package.json must expose ops:failed-jobs.",
  );
  assert(
    context.packageJson.scripts["ops:cleanup-local-smoke"],
    "package.json must expose ops:cleanup-local-smoke.",
  );
  assert(
    context.packageJson.scripts["ops:create-admin-invite"],
    "package.json must expose ops:create-admin-invite.",
  );
  assert(context.packageJson.scripts["adopt:app"], "package.json must expose adopt:app.");
  assert(
    context.packageJson.scripts["db:migrate:preview"],
    "package.json must expose db:migrate:preview.",
  );
  assert(
    context.packageJson.scripts["db:migrate:production"],
    "package.json must expose db:migrate:production.",
  );
  assert(
    context.packageJson.scripts["test:integration"],
    "package.json must expose test:integration.",
  );
  assert(
    context.packageJson.scripts["test:worker-runtime"],
    "package.json must expose test:worker-runtime.",
  );
  assert(context.packageJson.scripts["smoke:browser"], "package.json must expose smoke:browser.");
  assert(
    context.packageJson.scripts["verify:kit"].includes("test:worker-runtime"),
    "verify:kit must include Worker runtime tests.",
  );
  assert(
    context.packageJson.scripts["verify:kit"].includes("smoke:browser"),
    "verify:kit must include browser smoke.",
  );
}

export function assertRootSmokeScriptGuards(context) {
  const { assert } = context;

  assert(
    context.packageJson.scripts.smoke.includes("worker-integration.mjs"),
    "smoke script must run Worker integration.",
  );
  assert(
    context.packageJson.scripts.smoke.includes("i18n-check.mjs"),
    "smoke script must run i18n checks.",
  );
  assert(
    context.packageJson.scripts.smoke.includes("package-interface-tests.mjs"),
    "smoke script must run package interface tests.",
  );
}
