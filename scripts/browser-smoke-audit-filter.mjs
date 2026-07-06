import { expect } from "@playwright/test";

export async function assertAuditDateFilter({ page, webUrl }) {
  await page.goto(`${webUrl}/settings/audit`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByRole("heading", { name: "Audit timeline" })).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator('input[type="date"]')).toHaveCount(0);
  const pastDate = await page.evaluate(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    date.setMonth(0);
    date.setDate(15);
    return {
      day: String(date.getDate()),
      formatted: new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date),
      monthIndex: date.getMonth(),
      year: String(date.getFullYear()),
    };
  });
  await page.getByRole("button", { name: "Select date" }).first().click();
  await expect(page.locator(".qitu-date-popover")).toBeVisible();
  await expect(page.locator(".qitu-calendar")).toBeVisible();
  const calendarDropdowns = page.locator(".qitu-date-popover select");
  await expect(calendarDropdowns).toHaveCount(2);
  await calendarDropdowns.first().selectOption({ index: pastDate.monthIndex });
  await calendarDropdowns.nth(1).selectOption(pastDate.year);
  await expect(calendarDropdowns.nth(1)).toHaveValue(pastDate.year);
  await page
    .locator("button.qitu-calendar-day:not([data-outside])")
    .filter({ hasText: new RegExp(`^${pastDate.day}$`) })
    .first()
    .click();
  await expect(page.locator(".qitu-date-popover")).toHaveCount(0);
  await expect(page.getByRole("button", { name: pastDate.formatted }).first()).toBeVisible();
  await page.getByLabel("Action", { exact: true }).fill("import_job.committed");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.getByText("import_job.committed", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Event details" })).toBeVisible();
}
