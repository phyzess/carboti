export function checkDoctorToolchain({
  findings,
  nodeVersion,
  nodeVersionValue,
  packageJson,
  run,
}) {
  const nodeMajor = parseNodeMajor(nodeVersionValue);
  warn(
    findings,
    nodeMajor >= 24,
    `Node ${nodeVersion} works for scripts, but Node 24+ is the recommended baseline.`,
  );

  const pnpmVersion = run("pnpm", ["--version"]);
  if (pnpmVersion) {
    const expected = packageJson.packageManager?.replace("pnpm@", "");
    warn(
      findings,
      pnpmVersion === expected,
      `pnpm version is ${pnpmVersion}; packageManager expects ${expected}.`,
    );
  } else {
    findings.warnings.push(
      "pnpm is not available on PATH. `vp install` may bootstrap it, but direct pnpm commands will fail.",
    );
  }

  const vpVersion = run("vp", ["--version"]);
  if (!vpVersion) {
    findings.errors.push(
      "`vp` is not available on PATH. Run through Vite+ or install dependencies first.",
    );
  }

  const wranglerVersion = run("wrangler", ["--version"]);
  warn(
    findings,
    Boolean(wranglerVersion),
    "wrangler is not available on PATH. Cloudflare dev/typegen commands need it after install.",
  );

  return {
    pnpmVersion,
    vpVersion,
    wranglerVersion,
  };
}

export function parseNodeMajor(version) {
  return Number.parseInt(version.split(".")[0] ?? "0", 10);
}

function warn(findings, condition, message) {
  if (!condition) findings.warnings.push(message);
}
