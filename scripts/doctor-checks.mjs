import { checkDoctorRegistryConfig, registryHost } from "./doctor-registry-checks.mjs";
import { checkDoctorStarterInvariants } from "./doctor-starter-checks.mjs";
import { checkDoctorToolchain, parseNodeMajor } from "./doctor-toolchain-checks.mjs";

export { parseNodeMajor, registryHost };

export function collectDoctorFindings({
  env,
  exists,
  nodeVersion,
  nodeVersionValue,
  readText,
  run,
  sourceTextUnder,
}) {
  const findings = {
    errors: [],
    notes: [],
    warnings: [],
  };

  const packageJson = JSON.parse(readText("package.json"));
  const { pnpmVersion, vpVersion, wranglerVersion } = checkDoctorToolchain({
    findings,
    nodeVersion,
    nodeVersionValue,
    packageJson,
    run,
  });

  checkDoctorStarterInvariants({ exists, findings, readText, sourceTextUnder });
  checkDoctorRegistryConfig({ env, exists, findings, readText });

  if (vpVersion) findings.notes.push(`vp: ${vpVersion}`);
  if (wranglerVersion) findings.notes.push(`wrangler: ${wranglerVersion.split("\n")[0]}`);
  if (pnpmVersion) findings.notes.push(`pnpm: ${pnpmVersion}`);
  findings.notes.push(`node: ${nodeVersion}`);

  return findings;
}
