import process from "node:process";

export function reportSmokeResult(failures) {
  if (failures.length > 0) {
    for (const failure of failures) console.error(`smoke: ${failure}`);
    console.error(`\nSmoke failed with ${failures.length} failure(s).`);
    process.exit(1);
  }

  console.log("Smoke passed.");
}
