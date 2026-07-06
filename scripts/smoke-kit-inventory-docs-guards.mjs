export function assertKitDocsInventoryGuards(context) {
  const { assert, chineseDocs, exists } = context;

  assert(exists("docs/setup.md"), "docs/setup.md must exist.");
  assert(exists("docs/kit-completion.md"), "docs/kit-completion.md must exist.");
  assert(exists("docs/capability-matrix.md"), "docs/capability-matrix.md must exist.");
  assert(exists("docs/deployment.md"), "docs/deployment.md must exist.");
  assert(
    exists("docs/operations/dlq-remediation.md"),
    "docs/operations/dlq-remediation.md must exist.",
  );
  assert(
    exists("docs/operations/email-deliverability.md"),
    "docs/operations/email-deliverability.md must exist.",
  );
  assert(exists("docs/release-notes.md"), "docs/release-notes.md must exist.");
  assert(exists("docs/troubleshooting.md"), "docs/troubleshooting.md must exist.");
  assert(exists("docs/upgrade-notes.md"), "docs/upgrade-notes.md must exist.");

  for (const path of chineseDocs) {
    assert(exists(path), `${path} must exist.`);
  }
}
