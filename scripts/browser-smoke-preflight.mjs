import { expect } from "@playwright/test";
import {
  routeEmptyIntakeListApis,
  routeProductionSignedOutApis,
} from "./browser-smoke-preflight-routes.mjs";

export async function assertProductionLoginHygiene({ context, webUrl }) {
  const page = await context.newPage();
  await routeProductionSignedOutApis(page);

  try {
    await page.goto(`${webUrl}/login`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: "Sign in to qitu" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Setup" })).toHaveCount(0);
    await expect(page.getByText("local demo", { exact: true })).toHaveCount(0);
    await expect(page.getByLabel("Email", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
  } finally {
    await page.close();
  }
}

export async function assertEmptyIntakeListLayout({ context, webUrl }) {
  const page = await context.newPage();
  await routeEmptyIntakeListApis(page);

  try {
    await page.goto(`${webUrl}/workspace/sources`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: "Source files" })).toBeVisible();
    const sourceList = page.locator('.qitu-list-frame[data-state="empty"]').first();
    await expect(sourceList).toBeVisible();
    await expect(sourceList.getByText("No source files", { exact: true })).toBeVisible();
    await expect(sourceList.locator(".qitu-list-state-row")).toBeVisible();
    const sourceListBox = await sourceList.boundingBox();
    if (!sourceListBox) {
      throw new Error("Unable to measure empty source list frame.");
    }

    return sourceListBox.width;
  } finally {
    await page.close();
  }
}
