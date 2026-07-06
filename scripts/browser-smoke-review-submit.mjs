import { expect } from "@playwright/test";
import { escapeRegExp } from "./browser-smoke-fixture.mjs";

export async function submitReviewFixtureAndConfirmAdvisory({ page, webUrl, fixture }) {
  const { filename, appendedFilename, content, appendedContent } = fixture;

  await page.goto(`${webUrl}/workspace/reviews`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByRole("heading", { name: "Confirmation console" })).toBeVisible();
  await expect(page.locator('.qitu-table-scroll-area[data-variant="bounded"]')).toBeVisible();

  await page.locator('input[type="file"]').setInputFiles({
    name: filename,
    mimeType: "text/plain",
    buffer: Buffer.from(content),
  });
  await expect(page.getByText(filename, { exact: true })).toBeVisible();
  await page.locator('input[type="file"]').setInputFiles({
    name: appendedFilename,
    mimeType: "text/plain",
    buffer: Buffer.from(appendedContent),
  });
  await expect(page.getByText(appendedFilename, { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: new RegExp(`Remove upload ${escapeRegExp(appendedFilename)}`) })
    .click();
  await expect(page.getByText(appendedFilename, { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Upload selected" }).click();
  await expect(
    page.getByRole("button", { name: new RegExp(escapeRegExp(filename)) }),
  ).toBeVisible();

  const drainButton = page.getByRole("button", { name: "Process local queue" });
  await expect(drainButton).toBeVisible();
  await drainButton.click();

  await expect(
    page.getByText("Record was staged and requires human confirmation before commit.", {
      exact: true,
    }),
  ).toBeVisible({
    timeout: 20_000,
  });

  await page.getByRole("button", { name: "Generate" }).click();
  await expect(page.getByText("This advisory is informational", { exact: false })).toBeVisible();
  await expect(
    page.getByText("local/deterministic-confirmation-summary", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("suggested", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByText("confirmed", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("ai_advisory.confirmed", { exact: true }).first()).toBeVisible();
}
