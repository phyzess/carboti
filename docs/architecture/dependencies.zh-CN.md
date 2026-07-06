# 依赖基线

Status: initial
Checked: 2026-07-02

所有版本都刻意精确锁定。升级必须通过显式 decision。

TypeScript 7 RC 参考：<https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/>

## Runtime

| Package                  |    Version | 用途                      |
| ------------------------ | ---------: | ------------------------- |
| `react`                  |   `19.2.7` | Web UI                    |
| `react-dom`              |   `19.2.7` | Web UI rendering          |
| `@tanstack/react-router` | `1.170.16` | 应用自有 Web 路由         |
| `hono`                   |  `4.12.26` | Worker HTTP 路由          |
| `valibot`                |    `1.4.1` | Runtime 校验              |
| `drizzle-orm`            |   `0.45.2` | 数据库 schema/query layer |

## Tooling

| Package                           |    Version | 用途                                      |
| --------------------------------- | ---------: | ----------------------------------------- |
| `pnpm`                            |   `11.5.2` | Workspace package manager                 |
| `typescript`                      | `7.0.1-rc` | 官方 TypeScript 7 RC，即 `typescript@rc`  |
| `vite-plus`                       |    `0.2.1` | VoidZero toolchain command surface        |
| `vite`                            |   `8.0.16` | Web app config/plugin peer                |
| `wrangler`                        |  `4.103.0` | Cloudflare local/dev/deploy CLI           |
| `@playwright/test`                |   `1.61.0` | 浏览器 smoke                              |
| `tslib`                           |    `2.8.1` | 固定 shadcn CLI 依赖链所需 runtime helper |
| `vitest`                          |    `4.1.9` | Worker runtime smoke tests                |
| `@vitest/runner`                  |    `4.1.9` | Worker runtime test pool 的显式 peer      |
| `@vitest/snapshot`                |    `4.1.9` | Worker runtime test pool 的显式 peer      |
| `@types/node`                     |   `26.0.0` | Node.js compatibility typings             |
| `@cloudflare/vitest-pool-workers` |  `0.16.18` | Cloudflare Worker runtime test pool       |
| `drizzle-kit`                     |  `0.31.10` | migration generation candidate            |

## UI 与 Charts

| Package                    |  Version | 用途                                 |
| -------------------------- | -------: | ------------------------------------ |
| `tailwindcss`              |  `4.3.1` | Styling                              |
| `@tailwindcss/vite`        |  `4.3.1` | Tailwind Vite plugin                 |
| `shadcn`                   | `4.11.0` | Component CLI/registry               |
| `@base-ui/react`           |  `1.6.0` | shadcn Base UI accessible primitives |
| `cmdk`                     |  `1.1.1` | shadcn command palette primitive     |
| `date-fns`                 |  `4.4.0` | shadcn calendar date helpers         |
| `react-day-picker`         | `10.0.1` | shadcn calendar primitive            |
| `vaul`                     |  `1.1.2` | shadcn drawer primitive              |
| `lucide-react`             | `1.21.0` | Icons                                |
| `clsx`                     |  `2.1.1` | Class composition                    |
| `tailwind-merge`           |  `3.6.0` | Tailwind class merge                 |
| `class-variance-authority` |  `0.7.1` | Component variants                   |
| `@react-spring/web`        | `10.1.1` | visx xy chart animation peer         |
| `@visx/xychart`            |  `4.0.0` | Cartesian chart primitives           |
| `@visx/shape`              |  `4.0.0` | Shapes                               |
| `@visx/scale`              |  `4.0.0` | Scales                               |
| `@visx/tooltip`            |  `4.0.0` | Tooltips                             |

`@carboti/charts` 是 starter 唯一的 chart abstraction。当前基线导出 visx-backed `TimeSeriesChart`、`BarChart`、`DonutChart` 和 `ComparisonScatterChart` primitives，并已接入 React console。后续 chart type 应继续加在这里，不要引入第二套 chart stack。

## 说明

1. `vite-plus` 是本地开发、build、check、lint、format 和 workspace task orchestration 的命令入口。
2. 不直接依赖 `typescript@6`。类型检查使用官方 `typescript@7.0.1-rc`。
3. `apps/web/vite.config.ts` 从 `vite` import `defineConfig`，因为当前 Tailwind Vite plugin peers/types 指向 `vite`；实际命令仍通过 `vp dev` 与 `vp build` 执行。
4. `autoInstallPeers` 已关闭，workspace package 的 peer 必须显式声明，避免 lockfile 悄悄装入 `typescript@6`。
5. `typescript@7.0.1-rc` 可能解析到平台包，例如 `@typescript/typescript-darwin-arm64@7.0.1-rc`。完整安装要求 registry 能正确提供该 tarball。
6. Worker runtime types 由 `wrangler types` 生成到 `apps/worker/worker-configuration.d.ts`。
7. `@cloudflare/vite-plugin` 仍只是 integration candidate，当前 package manifest 与 lockfile 没有声明它；只有在记录显式 decision 并同步依赖后才能加入。
8. `smoke:browser` 使用真实 Chromium 跑首个纵切。新机器缺浏览器时执行 `vp exec playwright install chromium`。
