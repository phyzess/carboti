export const releaseTargets = {
  preview: {
    appUrlVars: ["QITU_PREVIEW_APP_URL", "QITU_PUBLIC_APP_URL", "QITU_HEALTH_URL"],
    internalUrlVars: ["QITU_PREVIEW_WORKER_URL", "QITU_PREVIEW_WORKERS_DEV_URL"],
    steps: [
      ["vp", "run", "verify:kit"],
      ["vp", "run", "deploy:preview:dry-run"],
      ["vp", "run", "db:migrate:preview"],
      ["vp", "run", "ops:failed-jobs", "--", "preview"],
      ["vp", "run", "deploy:preview"],
    ],
  },
  production: {
    appUrlVars: ["QITU_PRODUCTION_APP_URL", "QITU_PUBLIC_APP_URL", "QITU_HEALTH_URL"],
    internalUrlVars: ["QITU_PRODUCTION_WORKER_URL", "QITU_PRODUCTION_WORKERS_DEV_URL"],
    steps: [
      ["vp", "run", "verify:kit"],
      ["vp", "run", "deploy:production:dry-run"],
      ["vp", "run", "db:migrate:production"],
      ["vp", "run", "ops:failed-jobs", "--", "production"],
      ["vp", "run", "deploy:production"],
    ],
  },
};
