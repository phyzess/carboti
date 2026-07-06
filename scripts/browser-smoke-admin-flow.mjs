import { expect } from "@playwright/test";
import { escapeRegExp } from "./browser-smoke-fixture.mjs";

export async function runAdminMemberJourney({ page, context, runtime, webUrl, fixture }) {
  const { adminEmail, managedEmail, initialPassword } = fixture;

  await runtime.postWorkerJson("/api/bootstrap/local-admin", {
    email: adminEmail,
    displayName: "Browser Admin",
    password: initialPassword,
  });
  await context.clearCookies();
  await page.goto(`${webUrl}/login`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByLabel("Email", { exact: true }).fill(adminEmail);
  await page.getByLabel("Password", { exact: true }).fill(initialPassword);
  await page.locator("form").getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Workspace home" })).toBeVisible();

  await page.goto(`${webUrl}/settings/members`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByRole("heading", { name: "Members and invitations" })).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill(managedEmail);
  await page.getByRole("button", { name: "Create invitation" }).click();
  const managedInvitationRow = page
    .locator(".qitu-surface-subtle")
    .filter({ hasText: managedEmail })
    .first();
  await expect(managedInvitationRow).toBeVisible();
  await managedInvitationRow
    .getByRole("button", {
      name: new RegExp(`Revoke invitation for ${escapeRegExp(managedEmail)}`),
    })
    .click();
  await expect(managedInvitationRow.getByText("revoked", { exact: true })).toBeVisible();
}
