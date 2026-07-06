# 添加业务功能

业务功能给 `qitu` 赋予具体含义，但不应改变 reusable core。

`qitu` 不强制顶层 `features/*` 或 `domains/*` 布局。React-heavy app 通常适合 `apps/web/src/features/*`，Worker-heavy app 通常适合 `apps/worker/src/features/*`。只有当 feature 需要跨 app 搬迁时，才考虑顶层 module/package。

## 1. 推荐形态

App-local feature：

```text
apps/web/src/features/<feature-name>/
  routes/
  components/
  hooks/
  model/
  tests/

apps/worker/src/features/<feature-name>/
  routes/
  jobs/
  adapters/
  tests/
```

可移植 feature slice，仅在证明有价值后采用：

```text
features/<feature-name>/
  web/
  api/
  db/
  jobs/
  ai/
  import/
  tests/
```

example-only code：

```text
examples/<example-name>/
  README.md
  src/
  tests/
```

## 2. Feature 拥有

业务 feature 拥有：

1. source interpretation。
2. parsed record shape。
3. validation rules。
4. review labels。
5. commit logic。
6. business-owned tables。
7. feature UI routes。
8. feature charts/reports。
9. 与业务语义相关的 AI prompts/evals。

## 3. Core 拥有

core packages 拥有：

1. File storage。
2. Job lifecycle。
3. Staging record lifecycle。
4. Review workflow primitives。
5. Audit trail。
6. User and permission checks。
7. AI advisory storage。
8. Email plumbing。

## 4. Import Adapter Contract

导入 feature 可以暴露：

```text
feature id
source matcher
parser
staging shape
validation rules
review view metadata
commit handler
```

接入通用导入流时，优先使用 `@carboti/import-pipeline` 的 `ImportFeatureAdapter`。

## 5. Starter Template

`templates/feature` 是可复制、可 typecheck 的 starter package：

1. `src/import-feature.ts`：中性的 CSV-like adapter。
2. `src/registry.ts`：app-owned adapter registry。
3. `typecheck` script：复制后可先编译，再加真实业务规则。

复制到 app 后，重命名 package，并从 app-owned Worker code 注册 copied adapter。不要从 `packages/*` import copied feature code。

## 6. 边界清单

合并 feature 前检查：

1. core package 是否直接 import app-owned feature code？
2. core table 是否包含业务字段？
3. core UI label 是否出现业务词汇？
4. 第二个 feature 能否复用同一个 import job lifecycle？
5. commit 是否写 audit？
6. AI 建议是否必须 review 后才能 commit？
7. feature UI 页面是否优先使用现有 `@carboti/ui` primitives，或已记录新增 shadcn/Base UI-backed primitive 的原因？
8. 是否把常见 control 手写成 shadcn lookalike，而不是走 registry-first workflow？

如果 1、2、3 任一为 yes，应把概念移回 app-owned feature code。
如果 8 为 yes，合并前应先走 shadcn/Base UI discovery 与 `@carboti/ui` wrapper 流程。
