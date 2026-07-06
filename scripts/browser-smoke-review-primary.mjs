import { assertAuditDateFilter } from "./browser-smoke-audit-filter.mjs";
import { submitReviewFixtureAndConfirmAdvisory } from "./browser-smoke-review-submit.mjs";
import { confirmAndCommitSourceFile } from "./browser-smoke-source-commit.mjs";

export async function runPrimaryReviewJourney({ page, webUrl, fixture, emptySourceListWidth }) {
  await submitReviewFixtureAndConfirmAdvisory({ page, webUrl, fixture });
  await confirmAndCommitSourceFile({ page, webUrl, fixture, emptySourceListWidth });
  await assertAuditDateFilter({ page, webUrl });
}
