# UI 与设计系统

Status: accepted baseline
Date: 2026-07-06

## 1. 目标

`qitu` 应提供严肃、现代、适合内部系统的视觉基线，而不是通用 admin template。

UI 气质：

1. 安静。
2. 信息密度高但可读。
3. 快。
4. 可审计。
5. 适合重复工作。
6. 现代，但没有装饰噪音。

## 2. 技术基线

```text
React
TanStack Router 用于应用自有 Web 路由
shadcn/ui Base UI through the `base-nova` preset
Tailwind
Extend UI for file/import/review surfaces
visx-only chart primitives
```

根目录 `components.json` 记录 workspace shadcn contract。实际安装目标是
`packages/ui/components.json`，root 的 `vp run ui:*` 脚本会指向这个
package-local 配置；它使用 `style: "base-nova"`，并将 registry 输出解析到
`packages/ui/src`。qitu 的交互 primitives 必须是 registry-backed
shadcn/Base UI 组件，或由这些组件组成的薄封装；app-owned 页面必须消费
`@carboti/ui`，不能直接 import Base UI。

Primitive 治理规则：

1. 缺少常见交互 primitive 时，先查 shadcn/Base UI registry。
2. 用 `vp run ui:search --query "<component or behavior>"` 查候选组件，用 `vp run ui:docs <component>` 查看 Base UI 用法；需要先看生成结果时，用 `vp run ui:view <component>`。
3. 优先用 `vp run ui:add <component> --dry-run` 预览 registry-backed 组件，确认后再执行 `vp run ui:add <component>`。package-local shadcn config 会把生成文件导入 `packages/ui/src`。
4. 如果 registry 没有完全匹配的组件，先组合已有 shadcn/qitu primitives，再考虑 bespoke primitive。
5. registry-backed primitives 和 qitu-specific wrapper compositions 都必须放在 `packages/ui`，并从 `@carboti/ui` 导出，app 页面才能使用。
6. App 页面不能手工模仿 shadcn 样式，不能直接 import Base UI，也不能在 qitu shared primitive 已存在时退回 raw `type="date"`、raw checkbox、页面内 menu/dialog 或页面内 table。
7. Bespoke primitive 必须在 decision log 说明为什么 registry 与现有 qitu primitive 组合不足。
8. Shared primitive 使用 business-neutral 命名和 props，例如 source、file、job、status、action、value、item。
9. list、table、card、row、action bar 的密度属于可复用 qitu tokens/classes，不属于页面级 padding patch。
10. 当 app 页面必须使用新的 paved primitive 时，应补 smoke 或 package-interface 检查守住用法。

当前第一批 shared primitive：

```text
AlertDialog
Badge
BatchActionBar
Button
Calendar
Card
Checkbox
Command
ConfirmDialog
DateField
Dialog
Drawer
Form/TextField/Input/SelectField
InputGroup
ListFrame
ListActionRow
Menu
Popover
RadioGroup
Separator
SegmentedControl
Sheet
StatusBadge
Table
Tabs
Textarea
UploadQueue
Surface/DataState/MetricStrip/Timeline
```

## 3. Package 分层

```text
packages/ui
packages/design-system
packages/charts
```

`packages/ui` 负责：

1. App shell。
2. Topbar 一级导航和二级 route tabs。
3. Command/search 入口、theme 控件和 user trigger/panel。
4. Layout。
5. Forms。
6. Tables。
7. Modals。
8. Review surfaces。
9. Timeline components。
10. 面向产品 chrome 的 animated icon registry。

`packages/ui/src/shell.tsx` 是稳定的 shell interface facade。AppShell frame、一级/二级导航控件、
shell props/types 和小型 system icons 放在 focused package-internal shell modules 中；app 页面继续
从同一个 `@carboti/ui` shell surface 导入。

`packages/ui/src/primitives.tsx` 是稳定的 shared primitive interface facade。Surface、
section-header、data-state、metric-strip、timeline 和 panel-action-button implementations 放在
focused package-internal modules 中；app 页面继续从 `@carboti/ui` 导入这些 primitives。

`packages/ui/src/styles.css` 是稳定的 package stylesheet 入口。具体 selector family 放在
`packages/ui/src/styles/*` 下的 focused CSS modules 中，例如 theme mapping、shell frame、
toolbars、animated icons、overlays、form controls、upload/list rows、shared controls、
surfaces 和 responsive rules。新增可复用视觉规则时，应扩展对应模块，而不是继续膨胀入口文件。

`packages/design-system` 负责：

1. Color tokens。
2. Typography tokens。
3. Spacing。
4. Shadows。
5. Motion。
6. Radius。
7. Theme variables。

Canonical token 名称统一使用 `--qitu-*` 命名空间。design-system package
不定义 non-qitu custom properties；可复用 qitu packages 和 app 页面直接消费 canonical
`--qitu-*` tokens。

Token family 按三层组织：

1. Primitive tokens：scale、space、radius、layout、z-index、chroma 与 raw color。
2. Semantic tokens：background、surface、text、state、focus、shadow、type 与 motion。
3. Component tokens：topbar、control、input、overlay、table、chart 与 app shell affordance。

`packages/charts` 负责：

1. Time series。
2. Bar chart。
3. Donut chart。
4. Scatter/compare chart。
5. Tooltip、legend、crosshair。

`packages/charts/src/index.tsx` 是 `@carboti/charts` 的 package interface facade。具体 chart
实现、shared frame/state rendering、grid rendering、scale/format helpers、theme tokens 和
chart-specific geometry 放在 package-internal focused modules 中。

## 4. 设计规则

1. 内部工具不做 landing page，首屏就是工作界面。
2. 使用紧凑 page header。
3. 多用色阶和克制 shadow，少用过多线条。
4. card 要浅、少、目的明确。
5. 不把 card 套在 card 里。
6. toolbar、grid、counter、tile、chart shell 使用稳定尺寸。
7. 字号不随 viewport width 缩放。
8. 指标数字使用 tabular numbers。
9. chart engine 只在 `@carboti/charts` 内部暴露，业务页面不直接依赖 chart engine。

有登录态的 app shell 必须是可访问的真实路由，而不是单个 stateful demo screen。基线路由：

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

`apps/web` 通过 TanStack Router 负责 route tree、route matching 和 navigation lifecycle。可复用 UI packages 保持路由无关：可以暴露 `href` 和 callback，但不能 import app router API。

未登录、已登录、admin-only、not-found、loading、empty、error 状态要保持同一套视觉语言。账号入口属于 authenticated topbar，退出登录属于从该入口打开的 user panel；成员与邀请管理属于 Settings，并由 RBAC 保护，而不是只存在于测试代码里。

Shell 交互规则：

1. 一级导航只把现有 route 归并到少量业务中立分组。
2. 当前一级分组的子路由显示在 topbar 的二级导航行。
3. 一级导航可以在 session storage 中记住每个分组最近访问的子 route，但只存 route id。
4. Topbar command search 必须是可用的 `Cmd/Ctrl+K` 控件，可搜索 route 与 app-owned 数据投影。
5. 登录后的账号入口打开 user panel，包含 profile、RBAC role、允许时的成员与邀请入口、theme 切换与 logout。
6. Theme 切换由 tokens 驱动，支持 light、dark、system，不改变 reusable package 的业务语义。
7. 桌面端 route navigation 不使用侧边栏或 side rail；drawer 只作为紧凑或移动端 disclosure pattern。
8. 桌面端一级导航采用 qitu route-control shape：纯 icon main route buttons、克制 active underline，然后是 divider 与相邻 active/hover live label。
9. 空间受限时，一级导航保持纯 icon，并可以隐藏相邻 live label。
10. 二级 route tab 使用 text-only，并通过 active underline 表达当前页。
11. 搜索入口放在 topbar action cluster：紧凑宽度用纯 icon，宽屏用 icon + text + shortcut。
12. Theme 使用纯 icon 控件。人员 trigger 是身份入口，例如 avatar/initial + chevron；具体用户动作属于 panel 内。

当前 starter 分组：

```text
Workspace：/workspace、/workspace/sources、/workspace/imports、/workspace/reviews
Settings：/settings、/settings/members、/settings/audit
```

Settings 路由仍然是已认证 app route，因为它们属于可复用 starter surface；但它们不应被表达成业务 workflow module。成员与邀请管理和审计可见性通过 Settings 暴露，其中成员与邀请管理在非管理员的 route navigation 中禁用。

视觉提取规则：

1. qitu 保留自己的 business-neutral token 名称和组件契约。
2. qitu 视觉层使用 OKLCH 紫灰中性色、紧凑控件、柔和 chroma 状态色、细线与克制阴影。
3. 主表面使用共享层级 tokens：`--qitu-surface-panel`、`--qitu-surface-row`、`--qitu-surface-row-hover`、`--qitu-surface-row-active`、`--qitu-surface-field` 与 `--qitu-color-popover`；app 页面不应硬编码 RGB overlay 或一次性 surface 色值。
4. 控件遵循 28/32/36px 尺度，使用 `--qitu-radius-control` 与共享 focus ring。
5. shadow 主要留给 overlay 或 active affordance；普通 card 默认靠 tonal surface fill 表达层级，可见线条只保留给 control、overlay、focus 与 table separator。
6. Icon chip、avatar/initial trigger、form field、list action、table cell、overlay backdrop 应使用 `packages/ui` 的共享 utility，而不是页面内临时 Tailwind recipe。
7. Animated icons 由 `packages/ui` 的 `AnimatedIcon` 统一负责；app 页面不为 shell 或可复用控件 chrome 写局部 animated SVG recipe。

Surface 层级规则：

1. App background 通过 `--qitu-app-bg-gradient` 使用统一的 `--qitu-bg` 色系；topbar 使用同一 tonal family，不添加底部分割线或阴影。
2. 普通页面 panel 使用 `.qitu-surface`：默认只使用 `--qitu-surface-panel` 与透明结构边界。
3. 内嵌 metric、list row、guardrail、timeline item、data state 使用 `.qitu-surface-subtle`：默认只使用 `--qitu-surface-row` 与透明结构边界。
4. Hover 的内嵌 row 升到 `--qitu-surface-row-hover`；选中或 active row 升到 `--qitu-surface-row-active` 并使用 `--qitu-shadow-active-ring`。
5. Form control 使用 `--qitu-input-bg`、`--qitu-input-border` 与 `--qitu-shadow-focus-ring`；只读 field 使用 row fill，除 focus 或 active 状态外不画可见边框。
6. Review table cell 与 list row 使用同一 row surface。表格结构靠 spacing 和 radius，不使用局部 shadow。
7. Search dialog、popover、user panel 额外加 `.qitu-overlay-surface`，使用 `--qitu-color-popover` 与 `--qitu-shadow-overlay`；普通页面 panel 不使用 overlay shadow。
8. 层级使用 `--qitu-z-shell`、`--qitu-z-shell-front`、`--qitu-z-overlay-backdrop` 与 `--qitu-z-overlay`，不使用页面级 z-index 数字。

控件精修规则：

1. Topbar actions 共用 36px control track。搜索在紧凑宽度下是纯 icon，宽屏下是 icon + 可截断 label + 20px keyboard shortcut。
2. Keyboard shortcut chip 使用共享 kbd 样式：20px 高、10px mono 字体、tabular numbers、`--qitu-radius-control` 和 tonal surface 背景。
3. Refresh、theme 这类重复工具使用纯 icon button。含义不能只靠 icon 清楚表达的命令，才使用 text + icon。
4. 登录后的 user trigger 是 36px 身份控件，包含 32px avatar/initial 与 chevron；具体用户动作留在 panel 内。
5. Form input 和 select 使用 32px control height、`--qitu-radius-control`、`--qitu-input-bg`、`--qitu-input-border`、紧凑 control 字体和共享 focus ring。
6. Account/runtime 的只读行使用共享 label/value field grid，而不是页面内临时 flex row。value 必须稳定截断、对齐，并在适合时使用 tabular number。

Animated icon 规则：

1. `AnimatedIcon` 是 shell navigation、command/search、theme/language、refresh、account panel actions 与 reusable section headers 的 canonical dynamic icon 入口。
2. `AnimatedIcon` 的 public wrapper 位于 `packages/ui/src/animated-icon.tsx`；`packages/ui/src/animated-icon-registry.tsx` 从 `packages/ui/src/animated-icon-registry-shell.tsx` 与 `packages/ui/src/animated-icon-registry-workflow.tsx` 的 shell/workflow SVG groups 组合 public icon map，共享 registry typing 位于 `packages/ui/src/animated-icon-registry-types.ts`，semantic names 和 props 位于 `packages/ui/src/animated-icon-types.ts`，qitu 本地轻量 CSS motion 位于 `packages/ui/src/styles/animated-icon.css`。
3. App 页面不能直接 import icon runtime 或 package-internal icon registry modules。
4. Registry 刻意保持小而语义化。只有当图标出现在 reusable product chrome 或重复页面模式里，才新增 `AnimatedIconName`。
5. 优先使用 AnimateIcons/Lucide source geometry。若缺少精确语义匹配，选择最接近的现有 source shape，或保留静态 Lucide fallback，不再手画粗糙本地图标。
6. 密集 data table、timeline row、破坏性确认和一次性页面动作可以继续使用静态 Lucide icon；如果动效降低扫描效率，就不应添加。
7. 不为 app chrome 引入 Lottie、`@animateicons/react` 或第二套 animated icon runtime，除非先记录 dependency 与 bundle-size decision。
8. 页面代码可以把 `AnimatedIcon` 作为 React node 传入，但不能在共享 qitu tokens 外自定义 animation timing、keyframes 或 accent color。

Qitu token 与视觉系统规则：

1. Canonical tokens 统一使用 `--qitu-*` 命名空间；不定义、不消费 non-qitu custom properties。
2. Topbar 一级导航使用 qitu icon-button route controls，并保留 divider 与 live label。不要把 route text 放进一级 button。
3. 普通 panel 通过 `--qitu-surface-panel`、`--qitu-surface-row` 与 `--qitu-surface-row-active` 做 qitu tone separation；除非表达 overlay 或 active state，否则不要使用页面级 border 或 shadow。
4. Topbar active indicator 使用 `--qitu-chroma-active`，不引入页面级 underline 色值。
5. Topbar 不画底部分割线；内容区分依靠 spacing 和 surface tone。

## 5. 字体方向

默认 token：

```text
--qitu-font-ui
--qitu-font-doc
--qitu-font-reading
--qitu-font-number
--qitu-font-mono
```

建议：

1. UI：MiSans 或系统 CJK sans fallback。
2. 正式文档：Noto Serif SC。
3. 阅读模板：可选 LXGW WenKai Screen。
4. 数字：UI font + Fira Code fallback。
5. Mono：Fira Code。

## 6. Review 页面模式

每个 review 页面应包含：

1. Source summary。
2. Parser/rule version。
3. Timeline。
4. Staged data summary。
5. Issues and conflicts。
6. Primary decision actions。
7. Audit preview。
8. 有权限时可访问 raw file。

viewer 投影：

1. 状态摘要。
2. 时间线摘要。
3. 不展示 raw file。
4. 不展示敏感 review detail。
5. 不展示敏感 parsed rows。
