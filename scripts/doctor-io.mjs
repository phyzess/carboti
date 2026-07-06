import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function createDoctorIo(root) {
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

  return {
    exists(path) {
      return existsSync(join(root, path));
    },
    readText(path) {
      return readFileSync(join(root, path), "utf8");
    },
    sourceTextUnder,
    run(command, args) {
      try {
        return execFileSync(command, args, {
          cwd: root,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        }).trim();
      } catch {
        return null;
      }
    },
  };
}
