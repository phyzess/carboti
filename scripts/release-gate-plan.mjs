export function withFailedJobLimit(steps, limit) {
  return steps.map((step) => {
    if (step.includes("ops:failed-jobs")) {
      return [...step, "--limit", String(limit)];
    }

    return step;
  });
}

export function printReleaseGatePlan({ config, steps, target }) {
  console.log(`Release gate target: ${target}`);
  console.log(`Required app URL env: one of ${config.appUrlVars.join(", ")}`);
  console.log(`Optional internal health URL env: one of ${config.internalUrlVars.join(", ")}`);
  console.log("Steps:");
  for (const step of steps) {
    console.log(`- ${formatStep(step)}`);
  }
}

export function formatStep(step) {
  return step.join(" ");
}
