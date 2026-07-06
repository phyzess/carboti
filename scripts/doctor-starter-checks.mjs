export function checkDoctorStarterInvariants({ exists, findings, readText, sourceTextUnder }) {
  const check = (condition, message) => {
    if (!condition) findings.errors.push(message);
  };

  const workspace = readText("pnpm-workspace.yaml");

  check(workspace.includes("examples/*"), "pnpm-workspace.yaml must include examples/*.");
  check(!workspace.includes("domains/*"), "pnpm-workspace.yaml must not require domains/*.");
  check(!exists("domains"), "Top-level domains/ should not exist in the reusable starter.");
  check(
    exists("examples/import-review"),
    "examples/import-review should exist as the boundary example.",
  );
  check(
    exists("templates/feature"),
    "templates/feature should exist as the copyable feature skeleton.",
  );
  check(
    exists("templates/app/manifest.json"),
    "templates/app/manifest.json should exist as the copy manifest for new apps.",
  );

  check(exists("docs/setup.md"), "docs/setup.md is missing.");
  check(exists("docs/capability-matrix.md"), "docs/capability-matrix.md is missing.");
  check(exists("docs/troubleshooting.md"), "docs/troubleshooting.md is missing.");
  check(exists(".env.example"), ".env.example is missing.");

  const importPipeline = sourceTextUnder("packages/import-pipeline/src");
  const legacyImportAdapterName = "Domain" + "ImportAdapter";
  check(
    !importPipeline.includes(legacyImportAdapterName),
    "packages/import-pipeline must expose ImportFeatureAdapter, not the legacy adapter name.",
  );
}
