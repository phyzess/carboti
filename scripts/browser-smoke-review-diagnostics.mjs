import { expect } from "@playwright/test";
import { escapeRegExp, sourceFileButtonNamePattern } from "./browser-smoke-fixture.mjs";

export async function runImportDiagnosticsJourney({ page, webUrl, fixture }) {
  const { runId, filename, rejectedFilename, rejectedContent, failedFilename, failedContent } =
    fixture;

  await page.goto(`${webUrl}/workspace/reviews`, {
    waitUntil: "domcontentloaded",
  });
  const drainButton = page.getByRole("button", { name: "Process local queue" });
  await page.locator('input[type="file"]').setInputFiles({
    name: rejectedFilename,
    mimeType: "text/plain",
    buffer: Buffer.from(rejectedContent),
  });
  await page.getByRole("button", { name: "Upload selected" }).click();
  await expect(
    page.getByRole("button", {
      name: sourceFileButtonNamePattern(rejectedFilename, "queued"),
    }),
  ).toBeVisible();

  await page.goto(`${webUrl}/workspace/imports`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByRole("heading", { name: "Job diagnostics" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Event stream" })).toBeVisible();
  await expect(page.getByText("import_job.queued", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Content hash", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/sha256:/).first()).toBeVisible();
  const committedImportRow = page
    .locator(".qitu-surface-subtle")
    .filter({ hasText: filename })
    .filter({ has: page.getByRole("button", { name: "Confirmations" }) })
    .first();
  await committedImportRow.getByRole("button", { name: "Confirmations" }).click();
  await expect(page.getByRole("heading", { name: "Confirmation console" })).toBeVisible();
  await expect(
    page
      .getByRole("table")
      .getByText(new RegExp(`label: ${escapeRegExp(`browser-smoke-${runId}`)}`)),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: sourceFileButtonNamePattern(rejectedFilename, "queued"),
    })
    .click();
  await drainButton.click();
  await expect(
    page.getByText("Record was staged and requires human confirmation before commit.", {
      exact: true,
    }),
  ).toBeVisible({
    timeout: 20_000,
  });

  await page.getByRole("button", { name: "Exclude record", exact: true }).click();
  await expect(
    page.getByRole("table").getByText("excluded", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Commit confirmed", exact: true })).toBeDisabled();
  await expect(
    page.getByText("import_review.record_rejected", { exact: true }).first(),
  ).toBeVisible();

  await page.locator('input[type="file"]').setInputFiles({
    name: failedFilename,
    mimeType: "application/json",
    buffer: Buffer.from(failedContent),
  });
  await page.getByRole("button", { name: "Upload selected" }).click();
  await expect(
    page.getByRole("button", {
      name: sourceFileButtonNamePattern(failedFilename, "queued"),
    }),
  ).toBeVisible();
  await drainButton.click();
  await page.goto(`${webUrl}/workspace/imports`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByRole("heading", { name: "Job diagnostics" })).toBeVisible();
  await expect(page.getByText("Failure class", { exact: true })).toBeVisible();
  await expect(page.getByText("processing", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Recovery path", { exact: true })).toBeVisible();
  await expect(page.getByText("Retry candidate", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Inspect Worker logs and source content first.", { exact: false }).first(),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry job" }).first()).toBeVisible();
}
