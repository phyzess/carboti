import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function createSmokeIo(root) {
  function exists(path) {
    return existsSync(join(root, path));
  }

  function text(path) {
    return readFileSync(join(root, path), "utf8");
  }

  function sourceTextUnder(path) {
    const base = join(root, path);
    const sourceFiles = [];

    function collect(directory) {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) {
          collect(entryPath);
          continue;
        }

        if (/\.(mjs|ts|tsx)$/.test(entry.name)) {
          sourceFiles.push(readFileSync(entryPath, "utf8"));
        }
      }
    }

    collect(base);
    return sourceFiles.join("\n");
  }

  return { exists, sourceTextUnder, text };
}
