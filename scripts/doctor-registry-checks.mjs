export function checkDoctorRegistryConfig({ env, exists, findings, readText }) {
  const npmrc = exists(".npmrc") ? readText(".npmrc") : "";

  if (npmrc.includes("_authToken")) {
    findings.errors.push(".npmrc must not contain registry auth tokens.");
  }

  if (npmrc.includes("registry=")) {
    findings.warnings.push(
      ".npmrc sets a registry. Keep public starter templates registry-neutral unless this is intentional.",
    );
  }

  if (env.NPM_CONFIG_REGISTRY) {
    findings.notes.push(
      `NPM_CONFIG_REGISTRY is set to host ${registryHost(env.NPM_CONFIG_REGISTRY)}.`,
    );
  }
}

export function registryHost(value) {
  try {
    return new URL(value).host;
  } catch {
    return value;
  }
}
