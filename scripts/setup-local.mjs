import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const root = process.cwd();

function ensureCopy(source, target) {
  const sourcePath = join(root, source);
  const targetPath = join(root, target);

  if (existsSync(targetPath)) {
    console.log(`exists: ${target}`);
    return;
  }

  copyFileSync(sourcePath, targetPath);
  console.log(`created: ${target}`);
}

function run(command, args) {
  console.log(`run: ${command} ${args.join(" ")}`);
  execFileSync(command, args, {
    cwd: root,
    stdio: "inherit",
  });
}

ensureCopy(".env.example", ".env");
ensureCopy("apps/worker/.dev.vars.example", "apps/worker/.dev.vars");

run("vp", ["run", "cf:typegen"]);
run("vp", ["run", "db:migrate:local"]);
run("vp", ["run", "doctor"]);
run("vp", ["run", "smoke"]);
