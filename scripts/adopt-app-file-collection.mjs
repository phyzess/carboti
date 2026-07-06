import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ignoredDirectories = new Set([
  ".git",
  ".wrangler",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);
const extensions = new Set([
  ".cjs",
  ".css",
  ".json",
  ".jsonc",
  ".md",
  ".mjs",
  ".sql",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);
const exactFiles = new Set([
  ".dev.vars.example",
  ".env.example",
  ".gitignore",
  ".npmrc",
  ".prettierignore",
  "AGENTS.md",
  "CLAUDE.md",
  "PI.md",
  "README.md",
]);

export function collectTextFiles(root) {
  const collected = [];

  function visit(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          visit(join(current, entry.name));
        }
        continue;
      }

      const absolute = join(current, entry.name);
      if (isCollectedTextFile({ absolute, entryName: entry.name, root })) {
        collected.push(absolute);
      }
    }
  }

  visit(root);
  return collected;
}

function isCollectedTextFile({ absolute, entryName, root }) {
  const relativePath = relative(root, absolute);
  const extension = entryName.includes(".") ? entryName.slice(entryName.lastIndexOf(".")) : "";

  return extensions.has(extension) || exactFiles.has(relativePath);
}
