import { expect } from "@playwright/test";

export async function completeReviewerAuthFlow({ page, runtime, invitation, fixture }) {
  const { email, initialPassword, resetPassword } = fixture;

  await page.goto(invitation.inviteUrl, {
    waitUntil: "domcontentloaded",
  });

  await expect(page.getByRole("heading", { name: "Accept invitation" })).toBeVisible();
  await page
    .getByRole("button", { name: /Choose language/ })
    .first()
    .click();
  await expect(page.getByRole("menu", { name: "Language" })).toBeVisible();
  await page.getByRole("menuitemradio", { name: "简体中文" }).click();
  await expect(page.getByRole("heading", { name: "接受邀请" })).toBeVisible();
  await page.evaluate(() => window.localStorage.setItem("qitu.locale", "en"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Accept invitation" })).toBeVisible();
  await page.getByLabel("Display name", { exact: true }).fill("Browser Smoke");
  await page.getByLabel("Password", { exact: true }).fill(initialPassword);
  await page.getByRole("button", { name: "Accept invitation" }).click();

  await expect(page.getByRole("heading", { name: "Workspace home" })).toBeVisible();

  const reset = await runtime.postWorkerJson("/api/auth/password-reset/request", {
    email,
  });
  await page.goto(reset.resetUrl, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByRole("heading", { name: "Reset password" })).toBeVisible();
  await page.getByLabel("New password", { exact: true }).fill(resetPassword);
  await page.getByRole("button", { name: "Reset password" }).click();
  await expect(page.getByRole("heading", { name: "Sign in to qitu" })).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(resetPassword);
  await page.locator("form").getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Workspace home" })).toBeVisible();
}
