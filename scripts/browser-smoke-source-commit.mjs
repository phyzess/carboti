import { expect } from "@playwright/test";
import { sourceFileButtonNamePattern } from "./browser-smoke-fixture.mjs";

export async function confirmAndCommitSourceFile({ page, webUrl, fixture, emptySourceListWidth }) {
  const { filename } = fixture;

  await page.goto(`${webUrl}/workspace/sources`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator('.qitu-upload-dropzone[data-compact="true"]')).toBeVisible();
  await expect(page.getByText("Add more source files", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add files" }).first()).toBeVisible();
  const readySourceList = page
    .locator('.qitu-list-frame[data-state="ready"]')
    .filter({ hasText: filename })
    .first();
  await expect(readySourceList).toBeVisible();
  const readySourceListBox = await readySourceList.boundingBox();
  if (!readySourceListBox) {
    throw new Error("Unable to measure ready source list frame.");
  }
  if (Math.abs(readySourceListBox.width - emptySourceListWidth) > 2) {
    throw new Error("Source list empty and ready states do not share the same layout width.");
  }
  let sourceRow = page.locator(".qitu-surface-subtle").filter({ hasText: filename }).first();
  await sourceRow.getByRole("checkbox", { name: `Select ${filename}` }).click();
  await expect(page.getByRole("button", { name: "Confirm selected" })).toBeEnabled();
  await page.getByRole("button", { name: "Confirm selected" }).click();
  await expect(sourceRow.getByText("confirmed", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Commit selected" })).toBeEnabled();
  await page.getByRole("button", { name: "Commit selected" }).click();
  await expect(sourceRow.getByText("committed", { exact: true })).toBeVisible();

  await page.goto(`${webUrl}/workspace/reviews`, {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.getByRole("button", { name: sourceFileButtonNamePattern(filename, "committed") }),
  ).toBeVisible();
  await expect(page.getByText("import_job.committed", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("import_review.record_committed", { exact: true }).first(),
  ).toBeVisible();

  await page.goto(`${webUrl}/workspace/sources`, {
    waitUntil: "domcontentloaded",
  });
  sourceRow = page.locator(".qitu-surface-subtle").filter({ hasText: filename }).first();
  await sourceRow.getByRole("button", { name: "Details" }).click();
  await expect(page.getByText("Object key", { exact: true })).toBeVisible();
  await expect(page.getByText("Import jobs", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close details" }).click();
}
