import process from "node:process";

import { countSql, deleteSql } from "./cleanup-local-smoke-sql.mjs";
import { runLocalD1 } from "./cleanup-local-smoke-d1.mjs";

const dryRun = process.argv.slice(2).includes("--dry-run");

console.log("Local smoke/demo cleanup targets carboti-dev --local only.");
await runLocalD1(countSql, "count");

if (dryRun) {
  console.log("Dry run complete. Re-run without --dry-run to delete matching local rows.");
  process.exit(0);
}

await runLocalD1(deleteSql, "delete");
await runLocalD1(countSql, "count");
console.log("Local smoke/demo cleanup complete.");
