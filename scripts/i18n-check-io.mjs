import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

export function createProjectReader(root) {
  function text(path) {
    return readFileSync(join(root, path), "utf8");
  }

  function exists(path) {
    return existsSync(join(root, path));
  }

  function collectSourceFiles(path, predicate) {
    const base = join(root, path);
    const files = [];

    function collect(directory) {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) {
          collect(entryPath);
          continue;
        }

        const projectPath = relative(root, entryPath);
        if (predicate(projectPath)) {
          files.push(projectPath);
        }
      }
    }

    collect(base);
    return files;
  }

  return {
    collectSourceFiles,
    exists,
    text,
  };
}
