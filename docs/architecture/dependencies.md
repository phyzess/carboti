# Dependency Baseline

Status: initial
Checked: 2026-07-02

All versions below are intentionally exact. Upgrade through an explicit decision.

Reference: <https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/>

## Runtime

| Package                  |    Version | Use                         |
| ------------------------ | ---------: | --------------------------- |
| `react`                  |   `19.2.7` | Web UI                      |
| `react-dom`              |   `19.2.7` | Web UI rendering            |
| `@tanstack/react-router` | `1.170.16` | App-owned web routing       |
| `hono`                   |  `4.12.26` | Worker HTTP routing         |
| `valibot`                |    `1.4.1` | Runtime validation          |
| `drizzle-orm`            |   `0.45.2` | Database schema/query layer |

## Tooling

| Package                           |    Version | Use                                                             |
| --------------------------------- | ---------: | --------------------------------------------------------------- |
| `pnpm`                            |   `11.5.2` | Workspace package manager                                       |
| `typescript`                      | `7.0.1-rc` | Official TypeScript 7 RC through `typescript@rc`                |
| `vite-plus`                       |    `0.2.1` | VoidZero toolchain command surface                              |
| `vite`                            |   `8.0.16` | Vite plugin peer and client types for the web app               |
| `wrangler`                        |  `4.103.0` | Cloudflare local/dev/deploy CLI                                 |
| `@playwright/test`                |   `1.61.0` | Scripted browser smoke for the first slice                      |
| `tslib`                           |    `2.8.1` | Runtime helper needed by the pinned shadcn CLI dependency chain |
| `vitest`                          |    `4.1.9` | Worker runtime smoke tests                                      |
| `@vitest/runner`                  |    `4.1.9` | Explicit peer for Worker runtime test pool                      |
| `@vitest/snapshot`                |    `4.1.9` | Explicit peer for Worker runtime test pool                      |
| `@types/node`                     |   `26.0.0` | Node.js compatibility typings                                   |
| `@cloudflare/vitest-pool-workers` |  `0.16.18` | Official Cloudflare Worker runtime test pool                    |
| `drizzle-kit`                     |  `0.31.10` | Migration generation candidate                                  |

## UI

| Package                    |  Version | Use                                  |
| -------------------------- | -------: | ------------------------------------ |
| `tailwindcss`              |  `4.3.1` | Styling                              |
| `@tailwindcss/vite`        |  `4.3.1` | Tailwind Vite plugin                 |
| `shadcn`                   | `4.11.0` | Component CLI and registry workflow  |
| `@base-ui/react`           |  `1.6.0` | shadcn Base UI accessible primitives |
| `cmdk`                     |  `1.1.1` | shadcn command palette primitive     |
| `date-fns`                 |  `4.4.0` | shadcn calendar date helpers         |
| `react-day-picker`         | `10.0.1` | shadcn calendar primitive            |
| `vaul`                     |  `1.1.2` | shadcn drawer primitive              |
| `lucide-react`             | `1.21.0` | Icons                                |
| `clsx`                     |  `2.1.1` | Class composition                    |
| `tailwind-merge`           |  `3.6.0` | Tailwind class merge                 |
| `class-variance-authority` |  `0.7.1` | Component variants                   |

## Charts

| Package             |  Version | Use                               |
| ------------------- | -------: | --------------------------------- |
| `@react-spring/web` | `10.1.1` | Animation peer for visx xy charts |
| `@visx/xychart`     |  `4.0.0` | Cartesian chart primitives        |
| `@visx/shape`       |  `4.0.0` | Shapes                            |
| `@visx/scale`       |  `4.0.0` | Scales                            |
| `@visx/tooltip`     |  `4.0.0` | Tooltips                          |

`@carboti/charts` is the single chart abstraction for the starter. The current baseline exports visx-backed `TimeSeriesChart`, `BarChart`, `DonutChart`, and `ComparisonScatterChart` primitives and wires them into the React console. Future chart types should be added there instead of introducing a second charting stack.

## Notes

`vite-plus` is the command surface for local development, build, check, lint, format, and workspace task orchestration.

`typescript@6` is intentionally not a direct dependency. Type checking uses `tsc` from the official `typescript@7.0.1-rc` release candidate, installed via the `typescript@rc` line described by Microsoft.

`apps/web/vite.config.ts` imports `defineConfig` from `vite`, not `vite-plus`, because `@tailwindcss/vite@4.3.1` currently peers and types against `vite`. The project still executes the config through `vp dev` and `vp build`.

`autoInstallPeers` is disabled in `pnpm-workspace.yaml`. Peer dependencies used by workspace source packages must be declared explicitly as package dev dependencies, so the lockfile does not silently install `typescript@6`.

`typescript@7.0.1-rc` depends on an optional platform package such as `@typescript/typescript-darwin-arm64@7.0.1-rc`. A full install requires the configured registry to serve that platform tarball successfully.

Worker runtime types are generated by `wrangler types` into `apps/worker/worker-configuration.d.ts`.

`@cloudflare/vite-plugin` remains an integration candidate, but it is not declared in the current
workspace package manifests or lockfile. Add it only with an explicit decision and matching
dependency update.

`apps/worker/wrangler.jsonc` pins `compatibility_date` to `2026-06-24`, the newest date supported by `wrangler@4.103.0` local dev in this baseline. Upgrade the date only together with a Wrangler upgrade and a successful `vp run dev:all` check.

The root `smoke` script runs two layers:

1. `scripts/smoke.mjs` for no-dependency template invariant checks.
2. `scripts/worker-integration.mjs` for a Worker handler integration path using Vite SSR loading, in-memory `node:sqlite` D1, and local R2/Queue fakes.

`smoke:browser` runs `scripts/browser-smoke.mjs`, which starts `vp run dev:all` and completes the first slice in a real Chromium browser. If the browser binary is missing on a fresh machine, run `vp exec playwright install chromium`.

`test:worker-runtime` runs `apps/worker/test/worker-runtime.test.ts` with `@cloudflare/vitest-pool-workers`. The baseline intentionally covers only `/health` and unauthenticated upload rejection so it verifies Workers runtime wiring without duplicating the broader Worker integration script.

The root `test:unit` command is available for package-level unit tests when a package needs narrower coverage than the current smoke, Worker integration, browser smoke, and Worker runtime checks.
