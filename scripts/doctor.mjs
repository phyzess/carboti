import process from "node:process";

import { collectDoctorFindings } from "./doctor-checks.mjs";
import { createDoctorIo } from "./doctor-io.mjs";
import { printDoctorReport } from "./doctor-output.mjs";

const findings = collectDoctorFindings({
  ...createDoctorIo(process.cwd()),
  env: process.env,
  nodeVersion: process.version,
  nodeVersionValue: process.versions.node,
});

if (!printDoctorReport(findings)) {
  process.exit(1);
}
