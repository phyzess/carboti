export async function routeProductionSignedOutApis(page) {
  await routeProductionHealth(page);
  await fulfillJsonRoute(page, "**/api/auth/me", { user: null });
}

export async function routeEmptyIntakeListApis(page) {
  await routeLocalHealth(page);
  await fulfillJsonRoute(page, "**/api/auth/me", {
    user: {
      id: "empty-layout-user",
      email: "empty-layout@example.com",
      role: "reviewer",
      displayName: "Empty Layout",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  });
  await fulfillJsonRoute(page, "**/api/source-files*", { sourceFiles: [] });
  await fulfillJsonRoute(page, "**/api/import-jobs*", { importJobs: [] });
  await fulfillJsonRoute(page, "**/api/audit-events*", { auditEvents: [] });
}

async function routeProductionHealth(page) {
  await fulfillJsonRoute(page, "**/health", {
    ok: true,
    service: "carboti-worker",
    environment: "production",
  });
}

async function routeLocalHealth(page) {
  await fulfillJsonRoute(page, "**/health", {
    ok: true,
    service: "carboti-worker",
    environment: "local",
  });
}

async function fulfillJsonRoute(page, pattern, body) {
  await page.route(pattern, async (route) => {
    await route.fulfill({
      body: JSON.stringify(body),
      contentType: "application/json",
    });
  });
}
