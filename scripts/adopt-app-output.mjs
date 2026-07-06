import { statSync } from "node:fs";
import { join, relative } from "node:path";

export function printPlan({ edits, options, removals, root }) {
  console.log(`Adopting qitu as ${options.appName}`);
  console.log(`Namespace: ${options.namespace}`);
  console.log(`Worker: ${options.workerName}`);
  console.log(`Cookie: ${options.cookieName}`);
  console.log(`Mode: ${options.apply ? "apply" : "dry-run"}`);
  console.log("");
  console.log(`Planned file edits: ${edits.length}`);

  for (const edit of edits.slice(0, 80)) {
    console.log(`  ${relative(root, edit.file)} (${edit.labels.join(", ")})`);
  }
  if (edits.length > 80) {
    console.log(`  ... ${edits.length - 80} more`);
  }

  if (options.cleanProductBaseline) {
    console.log("");
    console.log(`Planned scaffold cleanup: ${removals.length}`);
    for (const path of removals) {
      const stats = statSync(join(root, path));
      console.log(`  ${path}${stats.isDirectory() ? "/" : ""}`);
    }
  }
}

export function printApplySummary({ edits, removals }) {
  console.log(`Applied ${edits.length} file edit(s).`);
  if (removals.length > 0) {
    console.log(`Removed ${removals.length} scaffold path(s).`);
  }
}

export function printDryRunNotice() {
  console.log("Dry run only. Re-run with --apply to write files.");
}

export function printRemoteSafetySteps(options) {
  console.log("");
  console.log("Remote safety steps to run manually after reviewing the diff:");
  console.log(`  git remote rename origin ${options.upstreamRemote}`);
  console.log(`  git remote set-url --push ${options.upstreamRemote} DISABLED`);
  console.log("  git remote add origin <app-owned-git-url>");
}
