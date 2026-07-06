import { spawn } from "node:child_process";
import { join } from "node:path";
import process from "node:process";

const root = process.cwd();
const timeoutMs = Number(process.env.WRANGLER_D1_EXECUTE_TIMEOUT_MS ?? 180_000);
const wrangler = process.platform === "win32" ? "wrangler.cmd" : "wrangler";

export function runLocalD1(sql, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      wrangler,
      ["d1", "execute", "carboti-dev", "--local", "--command", compactSql(sql)],
      {
        cwd: join(root, "apps", "worker"),
        env: {
          ...process.env,
          CI: process.env.CI ?? "1",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`Wrangler local D1 ${label} did not finish within ${timeoutMs}ms.`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    child.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on("close", (code, signal) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `Wrangler local D1 ${label} exited with code ${code ?? "none"} signal ${
            signal ?? "none"
          }.`,
        ),
      );
    });
  });
}

function compactSql(sql) {
  return sql.trim().replace(/\s+/g, " ");
}
