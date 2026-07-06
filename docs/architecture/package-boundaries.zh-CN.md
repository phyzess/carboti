# Package 边界

Status: draft
Date: 2026-06-27

本文定义 `qitu` 中 core package、app code、examples、templates 的边界。

## 总原则

```text
core owns reusable application capability.
features own business meaning.
```

Core package 只表达通用应用能力。业务术语、业务计算、业务表结构、业务报表不进入 core。

## Core 可以拥有

1. Auth primitives。
2. RBAC roles/permissions。
3. Source file metadata。
4. Source file object-key conventions 与 content hashing。
5. Import job lifecycle。
6. Import adapter contract。
7. Review issue/decision concepts。
8. Audit event shape。
9. Email message templates。
10. AI advisory artifact shape。
11. UI primitives、tokens、charts。
12. Runtime config parsing。

## Core 不应该拥有

1. 业务字段名。
2. 业务指标。
3. 业务 parser。
4. 业务计算。
5. 业务报表。
6. feature-specific commit semantics。
7. 某个行业的固定目录结构。

## App-Owned Feature Code

业务 feature 可以放在具体 app 内，例如：

```text
apps/worker/src/features/*
apps/web/src/features/*
```

也可以在未来真实需要时抽成 package。但抽 package 前，应先通过 app-local feature 证明边界稳定。

`qitu` 不强制顶层 `domains/*`。不同 app 可能更适合 feature、workflow、bounded context、vertical slice 或 route-based layout。

`apps/worker/src/*` 可以包含 app-local Worker modules，例如 auth route composition、import adapter registry、import job runner、import review routes、audit/email D1 adapters、HTTP route helpers 和 runtime config helpers。这些 Module 可以知道 D1/R2/Queue/Email bindings 与 starter tables，但不能把业务含义搬进 `packages/*`。

Security events 和 alerts 目前通过 app-owned Worker modules 与通用 event tables 实现；当前没有独立的 `packages/security` 或 `packages/alerts`。只有当多个生产 feature 证明复用压力真实存在时，才应该拆出独立 package。

## Examples

`examples/*` 是非生产示例，用来证明边界：

1. `examples/import-review`
2. `examples/json-records`

Worker starter 不依赖这些 optional examples。它有自己的 app-owned starter adapters，避免 core 或 app shell 误依赖示例 package。

当前 example packages 可以保持 `src/index.ts` 作为 package import facade，同时把 parser/source
reading、staged-record parsing、adapter behavior 和 example types 放在 example-internal focused
modules 中。Reusable packages 不能 import optional examples。

## Templates

`templates/app` 是 copy manifest，描述如何复制当前 runnable skeleton。

`templates/feature` 是可 typecheck 的 feature starter，包含：

1. `ImportFeatureAdapter` skeleton。
2. app-owned registry starter。
3. README。
4. package/tsconfig，用于在加入业务规则前验证 shape。

## Import 依赖方向

允许：

```text
apps/* -> packages/*
examples/* -> packages/*
templates/* -> packages/*
```

不允许：

```text
packages/* -> apps/*
packages/* -> examples/*
packages/* -> templates/*
core package -> business feature code
```

Worker app 可以注册 app-owned adapters，但 core import-pipeline package 只知道 contract。

## 当前 package facade 组织

`packages/rbac/src/index.ts` 是 `@carboti/rbac` 的 package interface facade。Generic RBAC types、
policy validation / normalization helpers、starter role policy 和 permission checks 放在
package-internal focused modules 中。Worker 和 Web 的 app-owned policy adapters 继续从
`@carboti/rbac` 导入。

`packages/import-pipeline/src/index.ts` 是 `@carboti/import-pipeline` 的 package interface facade。
Validation schemas、generic import/review types、adapter contract、review issue helpers、staging key
conventions、confirmation-language aliases 和 review status derivation 放在 package-internal focused
modules 中。

`packages/email/src/index.ts` 是 `@carboti/email` 的 package interface facade。
Provider-neutral message / inbound receipt schemas、auth email locale dictionaries，以及
invitation/password-reset rendering 放在 package-internal focused modules 中。

## 判断一个能力是否应进入 Core

进入 core 前，至少回答：

1. 它是否业务中立？
2. 第二个 feature 是否也会用它？
3. 它是否减少真实重复，而不是制造抽象感？
4. 它是否可以用 smoke/type/runtime/browser checks 守住？
5. 它是否会让 cloned app 更安全或更容易启动？

如果答案不明确，先留在 app-owned feature code。
