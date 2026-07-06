export function assertBrowserSmokeCoverageGuards(context) {
  const { assert, browserSmoke } = context;

  assert(
    browserSmoke.includes('spawn(vp, ["run", "dev:all"]') &&
      browserSmoke.includes("chromium.launch") &&
      browserSmoke.includes("assertProductionLoginHygiene") &&
      browserSmoke.includes('environment: "production"') &&
      browserSmoke.includes('getByRole("button", { name: "Setup" })') &&
      browserSmoke.includes('getByLabel("Email", { exact: true })') &&
      browserSmoke.includes('toHaveValue("")') &&
      browserSmoke.includes("/api/bootstrap/invitations") &&
      browserSmoke.includes("/api/auth/password-reset/request") &&
      browserSmoke.includes("Accept invitation") &&
      browserSmoke.includes("Reset password") &&
      browserSmoke.includes("setInputFiles") &&
      browserSmoke.includes("browser-smoke-appended") &&
      browserSmoke.includes("sourceFileButtonNamePattern") &&
      browserSmoke.includes("Workspace home") &&
      browserSmoke.includes("Remove upload") &&
      browserSmoke.includes("Object key") &&
      browserSmoke.includes("Close details") &&
      browserSmoke.includes("Process local queue") &&
      browserSmoke.includes("Confirm selected") &&
      browserSmoke.includes("Commit selected") &&
      browserSmoke.includes("Commit confirmed") &&
      browserSmoke.includes("ai_advisory.confirmed") &&
      browserSmoke.includes('getByRole("menu", { name: "Language" })') &&
      browserSmoke.includes("pastDate") &&
      browserSmoke.includes(".qitu-date-popover select") &&
      browserSmoke.includes("toHaveValue(pastDate.year)") &&
      browserSmoke.includes('"excluded"') &&
      browserSmoke.includes("import_job.committed") &&
      browserSmoke.includes("import_review.record_rejected"),
    "Browser smoke must start dev:all and exercise emailed invite/reset links, upload, local queue drain, commit, reject, and audit in a real browser.",
  );
}
