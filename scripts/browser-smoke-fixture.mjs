export function createBrowserSmokeFixture(runId = Date.now()) {
  return {
    runId,
    email: `reviewer-${runId}@example.com`,
    adminEmail: `admin-${runId}@example.com`,
    managedEmail: `managed-${runId}@example.com`,
    filename: `browser-smoke-${runId}.txt`,
    appendedFilename: `browser-smoke-appended-${runId}.txt`,
    rejectedFilename: `browser-smoke-reject-${runId}.txt`,
    failedFilename: `browser-smoke-failed-${runId}.json`,
    content: `label,value\nbrowser-smoke-${runId},${runId}\n`,
    appendedContent: `label,value\nbrowser-smoke-appended-${runId},${runId + 2}\n`,
    rejectedContent: `label,value\nbrowser-smoke-reject-${runId},${runId + 1}\n`,
    failedContent: `{"broken-${runId}":`,
    initialPassword: "correct horse battery staple",
    resetPassword: "correct horse battery staple reset",
  };
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
