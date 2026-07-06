export const cleanupPaths = [
  "templates",
  "examples",
  "docs/guides",
  "docs/templates",
  "docs/agents",
  "docs/kit-completion.md",
  "docs/kit-completion.zh-CN.md",
  "docs/capability-matrix.md",
  "docs/capability-matrix.zh-CN.md",
  "docs/release-notes.md",
  "docs/upgrade-notes.md",
  "docs/roadmap.md",
  "docs/roadmap.zh-CN.md",
];

export function createReplacements(options) {
  return [
    replacement("@carboti/", `${options.namespace}/`, "package namespace"),
    replacement('"name": "carboti"', `"name": "${options.appName}"`, "root package name"),
    replacement("carboti_session", options.cookieName, "session cookie name"),
    replacement("carboti-worker", options.workerName, "Worker name"),
    replacement("carboti-dev", `${options.appName}-dev`, "local Cloudflare resource names"),
    replacement(
      "carboti-preview",
      `${options.appName}-preview`,
      "preview Cloudflare resource names",
    ),
    replacement(
      "carboti-production",
      `${options.appName}-production`,
      "production Cloudflare resource names",
    ),
    replacement("carboti-source-files", `${options.appName}-source-files`, "R2 bucket name prefix"),
    replacement("carboti-import-jobs", `${options.appName}-import-jobs`, "Queue name prefix"),
    replacement(
      "PUBLIC_APP_NAME=carboti",
      `PUBLIC_APP_NAME=${options.appTitle}`,
      "public app name env",
    ),
  ];
}

function replacement(from, to, label) {
  return { from, label, to };
}
