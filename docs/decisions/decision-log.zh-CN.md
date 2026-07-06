# 决策日志

本文记录 `qitu` 已接受的关键决策。完整英文版本见 `docs/decisions/decision-log.md`。

## 已接受

### App-Local Worker Runner Modules

Decision:

Cloudflare binding adapters 和 starter feature registration 留在 app-owned Worker modules：

1. `apps/worker/src/auth-routes.ts` 保持 auth route-registration facade；focused auth、session、invitation、password-reset、RBAC denial、audit 和 email delivery modules 把 reusable auth/email/RBAC package rules 适配到 Worker routes。
2. `apps/worker/src/import-adapters.ts` 注册 app-owned starter import adapters。
3. `apps/worker/src/import-job-runner.ts` 把 generic import lifecycle rules 接到 D1、R2、Queue、audit 和 app-owned staging tables。
4. `apps/worker/src/import-review-routes.ts` 拥有 review route registration；focused detail、decision、confirm-pending、commit、store 和 statement modules 拥有 app-owned staging/committed tables 的 persistence。
5. `apps/worker/src/audit-store.ts` 与 `apps/worker/src/email-delivery.ts` 把 audit/email package concepts 适配到 D1 与 Cloudflare Email。
6. `apps/worker/src/http-utils.ts` 拥有 shared route parsing 和 error response helpers。
7. `packages/import-pipeline` 拥有 generic review status helpers、staging key conventions 和 adapter contracts。

不要把 Cloudflare binding details 或 starter table writes 移进 reusable core packages。

原因：

这样 `apps/worker/src/index.ts` 保持 HTTP/handler wiring，core packages 继续 business-neutral。这个 seam 把 Worker persistence 和 queue behavior 的修改集中到 app-owned modules，同时避免在第二个真实 app 证明需求之前伪造 reusable storage adapter。

### Canonical Name

Decision:

```text
qitu
```

规则：

1. 全部使用小写。
2. canonical name 不加 `kit`、`framework`、`starter` 后缀。
3. package namespace 使用 `@carboti/*`。

原因：

`qitu` 来自《山海经》中的鵸鵌。多头协作的意象适合一个由 auth、data、jobs、review、email、AI advisory、UI、operations 等模块组成的 fullstack starter。ASCII 名短、可读、repo-friendly，也不绑定具体业务领域。中文谐音“歧途”可以作为内部梗，而不是命名阻碍。

### Business-Neutral Core

Decision:

`qitu` 提供可复用应用能力。业务含义属于 app-owned feature code、examples 或 templates。

Core 可以拥有 auth、RBAC、files、jobs、import pipeline、review workflow、audit events、email、AI advisory records、app shell。

Core 不拥有业务指标、业务计算、业务 parser fields、业务报表、feature commit logic。

原因：

第一版必须保持可复用。一个 reusable core 要通过第二个 feature 不改 core semantics 来证明。

### Examples And Features Instead Of Top-Level Domains

Decision:

不强制 reusable starter 拥有顶层 `domains/*` 目录。examples 放在 `examples/*`，templates 放在 `templates/*`，具体 app 可按 feature、workflow、bounded context 或 vertical slice 组织业务代码。

原因：

不同 app 在 web、API、database、jobs、AI code 上可能需要不同形态。强制 `domains/*` 对通用 starter 太窄。

### Cloudflare-First Runtime

Decision:

默认部署平台是 Cloudflare：

1. Workers for HTTP APIs。
2. Worker Static Assets 或 Pages for React app。
3. D1 for relational state。
4. R2 for source files。
5. Queues for async work。
6. Email Sending / Email Routing for email。
7. Workers AI 或 external providers 只作为 advisory services。

原因：

让部署面小、贴近 edge runtime、适合内部工具运维。

### Human Confirmation For AI

Decision:

AI output 默认是 advisory。它可以建议、分类、抽取、总结、解释，但不能静默 commit business-owned records。

原因：

早期版本里，可 review provenance 比自动化速度更重要。

### Agent Entry Points

Decision:

提供一等 agent guidance：

1. `AGENTS.md` 给 Codex 和 agentic coding tools。
2. `CLAUDE.md` 给 Claude Code。
3. `PI.md` 给 Pi-style planning agents。

原因：

不同 agent 需要不同 detail level。仓库应显式记录这些边界，而不是依赖对话记忆。

### Initial Toolchain Baseline

Decision:

依赖版本精确记录在 `docs/architecture/dependencies.md`。关键选择：

1. React for web app。
2. Vite+ as root toolchain surface。
3. `vp` / `vp run` as command surface。
4. 官方 TypeScript 7 RC：`typescript@7.0.1-rc`。
5. Valibot for runtime validation。
6. Hono for Worker routing。
7. shadcn/Base UI direction for UI primitives。
8. visx as chart primitive layer。
9. `vite` 只留在 web app 作为 plugin peer 和 client type provider。

原因：

项目需要可复现 baseline，不能依赖对话记忆或 floating latest。

### Vite+ Command Surface

Decision:

尽量使用 Vite+ commands：

1. `vp dev apps/web`
2. `vp build`
3. `vp check`
4. `vp run`
5. `tsc` from `typescript@7.0.1-rc`

例外：

`apps/web/vite.config.ts` 从 `vite` import `defineConfig`，因为当前 Vite plugins 的 peer types 来自 `vite`，不是 Vite+ fork types。执行仍由 Vite+ 驱动。

### Manual DLQ Recovery In Baseline

Decision:

Baseline 使用人工 DLQ 与 failed-job remediation：

1. `apps/worker/wrangler.jsonc` 配置 Queue DLQ。
2. `docs/operations/dlq-remediation.md` 记录 triage 和 retry rules。
3. `vp run ops:failed-jobs` 提供只读 D1 snapshot。
4. 已有 app/API retry routes 负责 audited requeue。

Baseline 不挂自动 DLQ consumer，也不 blind replay。

原因：

自动 DLQ replay 可能重建 retry loop，并绕过人工分类。通用 kit 应先证明安全运维路径；自动 replay 只有在真实生产队列证明人工路径不足后再加入。

### Full-Stack Local Dev Default

Decision:

`vp run dev` 同时启动 web app 和 Worker API。之前只启动 web 的命令保留为 `vp run dev:web`，`vp run dev:all` 继续作为完整本地栈 wrapper 的显式别名。

本地开发同时暴露 local-only demo user bootstraps：

```text
email: reviewer@example.com
email: admin@example.com
password: correct horse battery staple
```

这些 bootstrap route 只在 `APP_ENV=local` 下创建或重置用户；非本地环境仍默认 invitation-only onboarding。reviewer 账号用于体验 review workflow，admin 账号用于体验 user/invitation management。

原因：

React app 会把 `/api` 和 `/health` 代理到 Worker，所以 web-only default 会产生半启动应用和 proxy failure。full-stack default 给 cloned checkout 一个可运行的第一印象，同时把本地 demo identities 留在 app-owned/local-only 层，不进入 reusable packages 或部署环境。

### Workbench UI Baseline

Decision:

采用 qitu business-neutral workbench baseline：

1. 暗色 tonal shell，包含 topbar 一级导航、二级 route tabs、main work surface、context inspector、event stream。
2. `packages/design-system` 提供字体、紧凑 type scale、semantic color、radius、spacing 与 surface shadow tokens。
3. `packages/ui` 提供 surface、data state、metric strip、file/import/review action、timeline 等业务中立组件。
4. `packages/charts` 作为 visx-only chart layer，app 页面只 import qitu chart components，不直接 import `@visx/*`。

原因：

qitu 需要偏 analytical workbench 的控制台方向，而不是浅色 generic admin shell。它应保留可复用 UI 经验，但不能引入业务专属词汇或业务语义。

### Event Foundation Tables

Decision:

Baseline 增加通用运行事件基础：

1. `login_attempts`：记录 hash 后的登录尝试诊断信息。
2. `import_job_events`：记录 upload、queue、process、review、retry、advisory、commit 的 job-local timeline。
3. `security_events`：记录 auth/RBAC 安全信号。
4. `alert_events`：记录 failed jobs 等通用运维跟进事项。

这些表保持业务中立。app-owned feature 可以通过 metadata JSON 关联上下文，但 core packages 与 docs 不定义业务指标、parser fields 或业务 workflow 含义。

原因：

Startup kit 需要可复用的运行可见性，而不只是最终 audit rows。分离 event streams 能让 UI 展示 source/import/review provenance，同时让 `audit_events` 保持 compliance trail，安全与告警信号也可独立查询。

### Authenticated App Routes Baseline

Decision:

React starter shell 必须表达有登录态应用的路由结构，而不是只有一个 review-console demo state。

基线路由：

```text
/login
/workspace
/workspace/sources
/workspace/imports
/workspace/reviews
/settings
/settings/members
/settings/audit
```

规则：

1. 受保护路由要求当前 session，未登录用户跳转到 `/login`。
2. 登录、接受邀请、本地 reviewer bootstrap 成功后进入 authenticated workbench。
3. Account 入口必须出现在 authenticated topbar，并通过 user panel 暴露 Logout。
4. Member/invitation management 是真实 app route，由 Worker API 与 RBAC 支撑，不只是测试能力。
5. 路由 shell 保持业务中立；具体业务 feature route 可以在 app-owned 层扩展业务含义。

原因：

面向登录态内部应用的 startup kit，需要在业务功能加入之前就有可信的登录后 shell。这样既保留 qitu workbench UI baseline，也把成员与邀请管理留在 auth/RBAC infrastructure 中，而不是把业务 workflow 塞进 core packages。

### Qitu Shell Interaction Contract

Decision:

定义 qitu 自己的 shell 交互结构，但不把 app-owned router、query、state 或 animation stack 迁移进 reusable packages。

提炼规则：

1. 一级导航保持少量业务中立分组。
2. 当前分组下的现有 route 作为二级导航展示。
3. 提供真实可用的 `Cmd/Ctrl+K` command search 入口。
4. 登录后的 user panel 承载 profile、RBAC role、允许时的 member management、theme 切换和 logout。
5. 通过 design tokens 支持 light、dark、system theme preference。
6. 一级 route links 保持稳定；通过 selected import job 等 app state 保留 workflow context，而不是通过 primary-route memory。
7. 桌面端 route navigation 不使用 side rail。
8. 桌面端一级 route control 采用 qitu 纯 icon button + 相邻 live label，二级 route tab 使用 text-only，紧凑搜索和 theme 使用纯 icon，宽屏搜索使用 icon + text + shortcut，人员 trigger 使用 avatar/initial + chevron。

原因：

qitu 需要成熟的 app-shell 行为，但不能继承产品词汇，也不应在 starter 尚未证明需要前引入更重的框架依赖。

### Qitu Visual Style Contract

Decision:

通过 qitu 自己的语义 token 名称和 reusable package 边界定义非业务视觉层。

提炼规则：

1. 背景、surface、线条与文字使用偏墨/纸感的冷中性色。
2. 页面层优先使用 `--qitu-surface`、`--qitu-surface-glass`、`--qitu-surface-elevated`，不再散落 RGB 色值。
3. 控件保持 28/32/36px 紧凑尺度，并共享 radius、focus、motion tokens。
4. 品牌 accent 统一使用以中国色 `品红` 的 `oklch(0.633 0.222 6.9)` 为核心的品红色系，用于 logo、active affordance、链接与 focus treatment。
5. 状态色只保留语义用途并降低饱和度：绿色用于 success/protected，蓝灰用于 warning/review/info，destructive 或 rejected 改用更低饱和的橘红，避免品牌品红同时承担错误语义。
6. shadow 主要用于 overlay 与 active affordance；普通 panel 依靠 tone、细线和克制 inset highlight 表达层级。
7. field、list action、icon chip、avatar trigger、overlay、table cell 等重复样式集中在 `packages/ui`。

原因：

qitu 应把视觉质感集中到共享系统中，但不能复制业务语义，也不能让样式决策继续散落在 app 页面。保持 qitu token 名称稳定，可以让后续 app-owned feature 复用同一套视觉系统，而不依赖无关实现细节。

### Shared Control Refinement Contract

Decision:

将 topbar action、keyboard shortcut、form field、avatar trigger 和只读 label/value row 的精修规则放进共享 UI utilities，而不是继续用页面级 Tailwind recipe 临时拼。

规则：

1. Topbar actions 共用 36px track；紧凑工具使用纯 icon，宽屏搜索使用 icon + label + shortcut。
2. Keyboard shortcut 使用共享 20px kbd primitive。
3. Form input 与 select 使用 32px control height、共享 radius、input tokens 与 focus ring。
4. Account/runtime 字段使用共享只读 label/value grid，并保持稳定截断与 tabular value styling。
5. User identity trigger 使用 36px button，包含 32px avatar/initial 与 chevron；logout 等账号动作留在 user panel 内。

原因：

第一版 qitu shell 在对齐、比例、阴影和 form row 上暴露了视觉漂移：同一套共享 shell pattern 被页面内 ad hoc 重写后很难保持精修感。把 control contract 收进 `packages/ui`，可以保持 starter 可复用，也避免每个 app 页面重复近似同一套 primitive。

### Qitu Design System Canonicalization

Decision:

将 qitu design system 视为非业务 UI 层的 canonical source，而不是继续在页面内局部参考、局部重写。

规则：

1. 在 `packages/design-system` 使用 qitu semantic color tree；不保留 non-qitu variable aliases。
2. 桌面端 topbar primary navigation 保持纯 icon route buttons，并保留 divider 与相邻 live label。
3. Topbar 一级和二级 tabs 使用 `--qitu-chroma-active`。
4. Topbar 不画底部分割线；内容区分依靠 spacing 和 surface tone。
5. 普通 panel 使用 card/surface tone 表达层级；除 overlay 或 active affordance 外，不再加页面级 panel border 或 shadow。
6. 所有 design-system 规则保持业务中立；不把产品词汇、router、data fetching 或 animation stack 导入 reusable packages。

原因：

之前的实现仍然允许 qitu 在色值、线条、阴影和 tab alignment 上发生漂移。作为 startup kit，qitu 应通过 canonical tokens、shared utilities 与 business-neutral component contracts 保留同一套稳定视觉系统。

### Surface Hierarchy Contract

Decision:

将 qitu 的 surface、shadow 与层级规则集中到 `packages/design-system` tokens 和 `packages/ui` utilities 中。

规则：

1. 普通页面 panel 使用 `.qitu-surface`，对应 `--qitu-surface-panel`、`--qitu-surface-panel-border` 与轻微 inset highlight。
2. 内嵌 row、metric、guardrail、timeline、empty/data state 使用 `.qitu-surface-subtle`，对应 `--qitu-surface-row` 与 `--qitu-surface-row-border`。
3. Hover 与 selected state 使用 `--qitu-surface-row-hover`、`--qitu-surface-row-active` 与 `--qitu-shadow-active-ring`；页面代码不再临时发明 active row shadow。
4. Form、只读 row、table cell、icon chip、badge、segment tab、skeleton 和 button 消费共享 row/control tokens，而不是直接选择 `surface-glass` 或 `surface-elevated`。
5. Search dialog、popover、user panel 额外使用 `.qitu-overlay-surface`，对应 `--qitu-color-popover` 与 `--qitu-shadow-overlay`；普通 panel 不使用 overlay shadow。
6. Shell 与 overlay 层级使用 `--qitu-z-shell`、`--qitu-z-shell-front`、`--qitu-z-overlay-backdrop` 与 `--qitu-z-overlay`，不使用页面内局部 z-index 数字。

原因：

第一轮 visual parity 修正了 topbar 结构，但 card、row、field、shadow 和 overlay 仍然存在视觉漂移。Startup kit 需要可扫描、可复用、可执行的 UI 语义，而不是逐页近似同一套视觉效果。

### Tonal-First Surface Flattening

Decision:

收敛 qitu 的 surface contract：普通页面层级优先靠 tonal fill，而不是可见 border。

规则：

1. Light mode 在 app background、topbar、panel 和 row 之间使用统一的紫灰背景色系；避免 white 到 background 的页面渐变。
2. `.qitu-surface` 与 `.qitu-surface-subtle` 可以保留结构性 border 以稳定尺寸，但默认应为透明。
3. 可见线条只保留给 input、focus state、overlay 与 table separator 等真正承担交互或扫描结构的位置。
4. Overlay panel 因为浮在 workbench 上，可以保留很淡的 border 与 overlay shadow。
5. 页面代码不应通过新增局部 panel border 来补救对比不足；应调整共享 surface tokens。

原因：

第一轮 light/dark parity 之后仍然有过多可见描边，尤其在 light mode 中，panel、row 与 page background 都过于接近白色。业务中立 startup kit 应默认使用 qitu 扁平层级模型，让后续 app-owned 页面自然复用同一套安静的层级，而不是逐页调 border。

### Qitu Token Namespace Contract

Decision:

将 `--qitu-*` 作为 qitu design system 的 canonical CSS custom property 命名空间。

规则：

1. Reusable packages 与 app 页面必须消费 canonical `--qitu-*` tokens。
2. 不定义、不消费 non-qitu custom properties。
3. 新 token 必须进入三层之一：primitive、semantic 或 component。
4. Primitive tokens 定义 raw scale、color、radius、layout、z-index、chroma 与 motion values。
5. Semantic tokens 定义 background、surface、text、state、focus、shadow、type 与 motion intent。
6. Component tokens 定义 topbar、control、input、overlay、table、chart 与 app-shell affordance。
7. 对外 reusable docs 与 package contracts 必须使用 qitu-owned names，不使用 non-qitu names。

原因：

Startup kit 需要一套可增长的 token system，避免继续泄漏页面级色值、non-qitu names 或含义不清的 alias。qitu-owned namespace 可以让未来扩展更明确，并让 clone 出来的应用默认保持最新 contract。

### Vendored AnimateIcons Source Registry

Decision:

使用选中的 AnimateIcons Lucide SVG source 作为 app chrome 的 animated icon 来源，并 vendoring 到 `packages/ui` 内的小型 registry。

规则：

1. `packages/ui/src/animated-icon.tsx` 负责 public `AnimatedIcon` wrapper，
   `packages/ui/src/animated-icon-types.ts` 负责 `AnimatedIconName` 和 props，
   `packages/ui/src/animated-icon-registry.tsx` 组合从 qitu semantic icon names 到 registry
   entries 的 public mapping，分组的 `animated-icon-registry-*` modules 负责 selected vendored
   SVG source。
2. App 页面不能直接 import icon runtime；统一使用 `@carboti/ui` 暴露的 `AnimatedIcon`。
3. Shell navigation、command/search、theme/language、refresh、account panel actions 和 reusable section headers 使用 animated icons。
4. 密集 table、timeline row、破坏性确认、一次性 secondary action 和 data-state fallback glyph 默认保持静态，除非重复使用证明 motion 能提升扫描效率。
5. 优先使用 AnimateIcons/Lucide source geometry。若缺少精确语义匹配，选择最接近的现有 source shape，或保留静态 Lucide fallback，不再手画粗糙本地图标。
6. 不为 app chrome 引入 Lottie、`@animateicons/react` 或第二套 animated icon runtime，除非先补充新的 dependency 与 bundle-size decision。
7. Icons 必须继承 `currentColor`，避免页面级 accent overrides，并遵守 `prefers-reduced-motion`。
8. 只要 repository 中仍保留 vendored source，就在 `docs/third-party-notices.md` 中保留 AnimateIcons MIT notice。

原因：

第一版本地手画 animated icons 在真实 15-17px shell 尺寸下显得过粗且不一致。AnimateIcons 提供更成熟的比例基线，但为 qitu 当前的小型精选集合引入它的 React runtime 会带来不成比例的 bundle 重量。Vendoring 选中 SVG source 可以保留 qitu 的稳定语义 API 和视觉基线，同时让 app chrome 保持轻量。

### Stable Workspace Bootstrap Shell

Decision:

将受保护深链刷新视为 workspace bootstrap 状态，而不是临时退回 auth page。

规则：

1. 直接进入 `/workspace`、`/workspace/sources`、`/workspace/imports`、`/workspace/reviews`、`/settings`、`/settings/members` 或 `/settings/audit` 时，只要 session 尚未解析完成，就应保持在 workbench shell 中。
2. 静态 HTML 入口在模块加载前解析 persisted/system theme，并绘制与应用 light/dark 色系一致的 preboot workbench skeleton。
3. React theme state 必须在首帧前作用到 `document.documentElement`，避免 route-loading shell 闪过错误主题。
4. Session bootstrap 只负责 health 与 current-user 解析；workspace list data 与 route-specific companion data 在 session snapshot 明确后再加载。
5. Route-specific companion data 只在需要它的 route 加载。Settings routes 不应因为存在 selected job 就触发 review-record/advisory/event 加载。
6. Protected-route loading 应保留最终 workbench topbar 形态，用 disabled 或 skeletal controls 表示等待，而不是切回 guest/auth action model。

原因：

刷新受保护深链曾暴露白屏和登录页闪烁。问题不是单个页面，而是 theme、auth、route 与 route-owned data 没有共享启动契约。稳定的 bootstrap shell 能让受保护 route 从 HTML 首帧到 authenticated data hydration 都保持在 workspace 语义里。

### App-Owned TanStack Router

Decision:

React Web app 使用 TanStack Router 管理 route tree、location state 与客户端导航。

规则：

1. `apps/web` 拥有 TanStack Router dependency、route tree、route matching 和 navigation calls。
2. `packages/ui` 等可复用 package 保持路由无关，只接收普通 `href` 与 callback props。
3. App navigation 使用 router instance，不再使用手写 `window.history` 或 `popstate` subscription。
4. Route tree 覆盖 starter shell routes、invitation links 与 password-reset links。
5. Auth、RBAC、audit 与 persistence 仍由 Worker/API 负责；client router 可以控制展示，但不能成为授权事实来源。
6. 后续 route guards、pending states 与 skeletons 应通过 app-owned router lifecycle API 添加，而不是继续散落在页面级 history effects 中。

原因：

手写 History API router 让 route transition 依赖分散的 link handler 和浏览器默认行为，曾导致 disabled navigation item 落回 full document request，也让受保护 route 刷新闪烁难以推理。成熟的 app-owned router 为 qitu 提供单一导航契约，同时保留 core package 边界。

### Business-Neutral Starter Information Architecture

Decision:

保留 qitu 随 starter 交付的真实 authenticated routes，但通过 starter capability groups 呈现它们，而不是把它们包装成具体产品领域模块。

规则：

1. 登录后默认进入 `/workspace`，不直接进入 review workflow。
2. Primary navigation 只暴露 Workspace 与 Settings。
3. Workspace 包含 `/workspace`、`/workspace/sources`、`/workspace/imports` 与 `/workspace/reviews`。
4. Settings 包含 `/settings`、`/settings/members` 与 `/settings/audit`。
5. Source intake 与 import jobs 仍是真实 workflow surfaces，但它们属于 Workspace subroutes，而不是顶层 Intake module。
6. Audit 仍是真实 visibility surface，但在重复运维工作流证明需要单独 root 之前，它属于 Settings subroute，而不是顶层 Operations module。
7. 成员与邀请管理仍是一个真实 RBAC-protected route，但在 IA 中归入 Settings，并对非 admin route navigation 禁用。
8. Account 与成员管理仍可从 authenticated user panel 进入。
9. Reusable chart package exports 必须保持业务中立；从 `packages/charts` 移除 drawdown、performance panels 等金融语义组件名。
10. App-owned examples 可以保留业务示例标签，但 reusable docs 与 packages 必须按 infrastructure responsibility 描述能力。
11. 因为 qitu 尚未发布稳定 public route contract，pre-release 的 flat paths（如 `/overview`、`/sources`、`/imports`、`/reviews`、`/audit`、`/users`、`/account`）不保留兼容 redirect。

原因：

Starter 应证明可复用基础设施，而不是让 shell 看起来像一个完成态业务应用。Source intake、import jobs、review、audit、account 与 member management 都是 startup kit 需要具备的能力，但顶层产品叙事应围绕可复用 workspace 与 settings surface，而不是一组伪产品模块。移除金融语义 chart 名称可以关闭 core-package vocabulary leak，同时保留通用 chart primitives。

### Import Job Status Comes From Review Counts

Decision:

Import job status 在 review 和 commit 动作后由 staged-record status counts 推导。

规则：

1. `approved` 表示当前有 approved 且未 committed 的 staged records 可提交。
2. `needs_review` 表示仍有 review 工作，且当前没有可提交的 approved work。
3. `committed` 表示 approved work 已提交，并且不再有 pending 或 approved staged records。
4. Partial commit 后如果仍有 pending rows，不能把整个 job 标记为 `committed`。
5. 单次 approve/reject click 不能直接决定 job status；Worker 必须从 staged-record counts 重新计算。
6. 全部 rejected 的 job 在中立 starter 中保持 `needs_review`，直到真实 app 证明需要 job-level rejected/voided terminal status。

原因：

Starter 支持只提交 approved rows，但旧 helper 把最后一次 record decision 当作整个 job state。多记录导入时，这会让仍有 pending records 的 job 看起来已整体 approved 或 committed。由 counts 推导状态，可以保持 workflow 真实，同时不预造新的 terminal states。

### Shadcn Base UI Execution Contract

Decision:

让 shadcn/Base UI 方向成为可执行契约，而不是只停留在文档里：

1. 在 workspace root 固定 `shadcn@4.11.0`，并暴露 `vp run ui:add` / `vp run ui:info`。
2. 根目录 `components.json` 记录 workspace shadcn contract，并新增 `packages/ui/components.json` 作为 package-local install target。
3. 通过 package-local shadcn config 和 TypeScript aliases 将 shadcn registry 输出解析到 `packages/ui/src`。
4. 使用 `shadcn@4.11.0 --base base` 实际生成的 Base UI package：`@base-ui/react@1.6.0`，不再使用旧的 `@base-ui-components/react` RC 包。
5. App 页面继续只消费 `@carboti/ui`；Base UI imports 只属于 reusable qitu UI primitives。
6. 如果 shadcn config、Base UI imports 或 package pins 偏离这个 contract，smoke checks 必须失败。

原因：

此前实现只把 shadcn/Base UI 记录成方向，但 app code 仍在手写交互 primitives，旧 Base UI 依赖也没有真正使用。这让 design-system baseline 无法执行。Starter 需要可运行的 registry path、可访问 primitive backing，以及不让 app 页面绕过 `packages/ui` 的 package boundary。

### UI Primitive Governance As Downstream Paved Road

Decision:

将 shared UI primitive governance 视为边界保护，而不是提前扩张 component library。

规则：

1. 缺少常见 primitive 时，先查 shadcn/Base UI registry，再考虑 custom implementation。
2. 使用指向 `packages/ui` 的 root shadcn workflow 发现和检查候选组件：`vp run ui:search`、`vp run ui:docs`、`vp run ui:view`。
3. 优先执行 `vp run ui:add <component> --dry-run` 预览，再执行 `vp run ui:add <component>`；不要在 app 页面复制“像 shadcn 的”Tailwind recipe。
4. 如果没有单个 registry 组件完全匹配，先组合已有 shadcn/qitu primitives，再写 bespoke primitive。
5. App 页面从 `@carboti/ui` import reusable controls；直接 Base UI imports 只属于 `packages/ui`。
6. qitu 安装 registry-backed primitives：alert dialog、badge、button、calendar、card、checkbox、command、dialog、drawer、dropdown menu、input、input group、popover、radio group、select、separator、sheet、table、tabs、textarea，并在其上提供 `DateField`、`ConfirmDialog`、`SegmentedControl`、`StatusBadge`、`DetailDrawer`、`ListActionRow` 等 qitu-specific 薄封装。
7. 一旦 qitu shared primitive 已存在，app 页面不能再引入 raw native date input、raw checkbox、页面内 lookalike menu/dialog 或页面内 table structure。
8. qitu 提供小型 `DateField`，由 qitu `Popover` 加 shadcn `Calendar` 组合；calendar registry component 会带入所需的 `react-day-picker` 依赖。
9. 页面需要 bespoke primitive 时，必须记录 registry 与现有 qitu wrapper composition 为什么不足。
10. Primitive 命名和 props 保持 business-neutral，不能编码 downstream product vocabulary。

原因：

下游实践说明，如果等重复代码大量出现后才抽 shared primitive，产品页面会先堆出页面级 table、checkbox、date、drawer、action-bar 实现。对 reusable seed 来说，更稳妥的默认值是尽早提供小而业务中立的 paved road，并用 smoke checks 守住用法，让后续下游工作遵循 qitu 视觉与可访问性契约。

### Static Demo Separate From Preview

Decision:

增加一个专门用于视觉评审和 walkthrough 的前端静态 `demo` 环境，并与 Worker-backed `preview`
发布环境分离。

规则：

1. `demo` 使用 `VITE_QITU_API_MODE=mock` 构建 `apps/web`。
2. Demo API 行为属于 app-owned web code，不进入 reusable `packages/*`。
3. Demo state 使用浏览器 `localStorage` fixtures，不使用 Worker、D1、R2、Queue、Cloudflare
   Email 或 secrets。
4. Demo 部署到单独的 Cloudflare Pages project，例如 `qitu-demo`。
5. `preview` 和 `production` 继续使用 Worker Static Assets 与真实 Cloudflare bindings。
6. Demo 必须清楚显示 services、email 和 storage 都是 mock 状态。
7. Demo 不能成为 Worker-backed 行为的 release gate。

原因：

`qitu` 需要一个在 provision 真实 Cloudflare resources 前就可分享的产品形态预览，但弱化现有
`preview` gate 会模糊运维含义。Cloudflare Pages 静态 demo 能支持评审和采用，同时保留
`preview` 作为接近生产的环境。

### Downstream Kit Feedback Becomes Executable Guardrails

Decision:

将 downstream app 暴露出来的可复用工程经验提升为 qitu kit 级默认值，但不引入 downstream 业务语义。

规则：

1. UI primitive 来源记录在 `docs/architecture/ui-component-provenance.zh-CN.md` / `.md`，包括 registry-backed 来源、qitu composition、bespoke primitive 和维护规则。
2. `dev:all` 在未固定端口时动态选择本地 web 与 Worker 端口，并把同一个 Worker origin 传给 Vite proxy 和 Worker 链接生成。
3. `DateField` 使用 shadcn-backed `Calendar`，默认提供 month/year dropdown，并由 browser smoke 覆盖过去日期选择。
4. Preview/production deploy wrapper 先用 `wrangler whoami` 确认 Cloudflare 登录；最终 deploy 必须输出 Worker version id。
5. 新用户默认语言通过 app-owned `VITE_QITU_DEFAULT_LOCALE` 配置，不进入 reusable `packages/i18n` policy。
6. Workbench 页面避免重复路由标题，优先展示实际工作结果；大表格先走 shared `TableScrollArea` primitive，再考虑 page-local table overflow。

原因：

下游项目最值得反哺 qitu 的不是业务规则，而是减少误配置的 paved road：可追踪 UI 来源、低摩擦本地启动、脆弱 primitive 的真实浏览器回归，以及可重复的 Cloudflare 发布门禁。

### 2026-07-06: Refactor Locality Detail Record

Decision:

保留 `docs/decisions/decision-log.zh-CN.md` 作为简短 accepted-decision index，并把 2026-07-05/06 的 UI、package、Web、Worker、smoke 与 mock API refactor 详细条目移入 `docs/decisions/refactor-locality-2026-07.zh-CN.md`。

规则：

1. Agent 仍然先从本 log 查看 accepted decisions。
2. 当详细 locality refactor record 会让主索引难以扫描时，详情放入 `docs/decisions/refactor-locality-2026-07.zh-CN.md`。
3. 新决策仍在这里添加短条目；只有需要更多上下文时才链接 detail record。
4. Detail record 仍属于 architecture documentation set，并由扫描 decision docs 的 smoke context 覆盖。

原因：

Decision log 是稳定 lookup seam，但 7 月 refactor 条目已经变成长实现日志。把详细条目放到 linked record 后，可以恢复主索引的 scan locality，同时不隐藏已接受决策。

### 2026-07-06: Animated Icon Registry Groups

Decision:

保留 `packages/ui/src/animated-icon-registry.tsx` 作为 public `iconRegistry` composition module，并把 grouped SVG definitions 移到 shell/workflow registry modules。详细规则记录在 `docs/decisions/refactor-locality-2026-07.zh-CN.md`。

规则：

1. `AnimatedIcon` 继续从 `animated-icon-registry.tsx` import public `iconRegistry`。
2. Shell chrome icons 与 review/intake/workflow icons 分别放在 package-internal registry group modules。
3. 共享 registry typing 位于 `animated-icon-registry-types.ts`；public icon names 和 props 继续位于 `animated-icon-types.ts`。

原因：

Registry 已经成为最大的 TypeScript UI source file，但它的 public interface 仍然有价值。按 shell/workflow 分组 selected SVG definitions，可以提高未来图标新增的 locality，同时不改变 `AnimatedIcon` interface。

## Pending

1. Code generation 应属于 core 还是独立 CLI。
2. React Fast Refresh 是否应通过 Vite+ compatible React plugin path 恢复。
