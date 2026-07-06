# 2026-07 Refactor Locality 决策详情

本文收录从 `docs/decisions/decision-log.zh-CN.md` 移出的已接受详细决策，用于保持主决策索引简短。阅读时先从主 decision log 开始；需要审查 2026 年 7 月 UI、package、Web、Worker、smoke 与 mock API locality refactors 时再进入本文。

### 2026-07-05: Package Interface Facade 与实现模块拆分

Decision:

保留 reusable package 的现有 import seam，同时把实现拆入 package-internal focused modules：

1. `packages/auth/src/index.ts` 继续作为 `@carboti/auth` package interface facade；schemas、expiry、identity、token、password 和 factories 分模块维护。
2. `packages/rbac/src/index.ts` 继续作为 `@carboti/rbac` package interface facade；generic RBAC types、policy validation / normalization、starter role policy 和 permission checks 分模块维护。
3. `packages/db/src/index.ts` 继续作为 `@carboti/db` package interface facade；auth/session、source/import、review、AI advisory、email/inbound email 和 audit/security/alert tables 分模块维护。
4. `packages/i18n/src/index.ts` 继续作为 `@carboti/i18n` package interface facade；types、interpolation、message helpers、labels、formatters 和 locale negotiation 分模块维护。
5. `packages/import-pipeline/src/index.ts` 继续作为 `@carboti/import-pipeline` package interface facade；schemas/types、review issue helpers、staging key conventions、review/confirmation aliases 和 job status derivation 分模块维护。
6. `packages/email/src/index.ts` 继续作为 `@carboti/email` package interface facade；provider-neutral schemas、auth email locale dictionaries 和 invitation/password-reset rendering 分模块维护。
7. `packages/charts/src/index.tsx` 与 `packages/ui/src/styles.css` 也采用 facade/entry imports，分别把 chart implementations 和 UI stylesheet implementation modules 拆开。
8. `packages/ui/src/shell.tsx` 继续作为 `@carboti/ui` shell interface facade；AppShell frame、primary/secondary navigation controls、shell props/types 和 system icons 分模块维护。
9. `packages/ui/src/primitives.tsx` 继续作为 `@carboti/ui` shared primitive interface facade；Surface、SectionHeader、DataState、MetricStrip、Timeline 和 PanelActionButton 分模块维护。
10. `packages/ui/src/dropdown-menu.tsx` 继续作为 registry-backed `DropdownMenu` primitive
    facade；Base UI menu root/content/item、choice item 和 submenu implementations 分模块维护。
11. `packages/ui/src/calendar.tsx` 继续作为 registry-backed `Calendar` primitive facade；
    DayPicker class-name mapping、custom calendar parts 和 day-button behavior 分模块维护。
12. `packages/ui/src/select.tsx` 继续作为 registry-backed `Select` primitive facade；Base UI
    select trigger/value/group、popup/scroll controls 和 item/indicator implementations 分模块维护。
13. `packages/ui/src/command.tsx` 继续作为 registry-backed `Command` primitive facade；cmdk
    root/list/group、dialog wrapper、input wrapper 和 item/shortcut implementations 分模块维护。
14. `packages/ui/src/alert-dialog.tsx` 继续作为 registry-backed `AlertDialog` primitive facade；Base
    UI root/trigger/portal、overlay/content、layout text/media 和 action/cancel wrappers 分模块维护。
15. `packages/ui/src/dialog.tsx` 继续作为 registry-backed `Dialog` primitive facade；Base UI
    root/trigger/portal/close、overlay/content 和 layout wrappers 分模块维护。
16. `packages/ui/src/input-group.tsx` 继续作为 shadcn-pattern `InputGroup` primitive facade；group
    container、addon alignment、button size adapter 和 input/textarea control adapters 分模块维护。
17. `packages/ui/src/upload-queue.tsx` 继续作为 qitu `UploadQueue` primitive facade；public queue
    item types、dropzone/root behavior、empty/compact states 和 row/action rendering 分模块维护。
18. `packages/ui/src/table.tsx` 继续作为 shadcn-pattern `Table` primitive facade；table root、
    scroll-area behavior、table section wrappers 和 cell/head/caption wrappers 分模块维护。

规则：

1. 调用方继续从原 package import path 导入，不直接依赖 package-internal modules。
2. `index.ts` 或 stylesheet entry 只负责 re-export / import ordering。
3. Smoke context、doctor checks、i18n checks 和 package interface tests 必须读取完整 source directory 或运行 facade，避免 thin facade 让 guard 失去覆盖。
4. 这些拆分只改变 implementation locality，不改变 schema、migration、runtime capability 或业务含义。

原因：

这些 package 的 public interface 已经足够小且有复用价值；问题在于单文件实现混合了多种修改节奏。把实现按概念拆开，可以提升维护 locality，同时保留对 Worker、Web、examples 和 templates 稳定的 import seam。

### 2026-07-06: Dropdown Menu Package-Internal Modules

Decision:

保留 `packages/ui/src/dropdown-menu.tsx` 作为 registry-backed `DropdownMenu` primitive facade，并把
Base UI menu root/content/item、choice item 和 submenu implementations 移入 focused
package-internal modules。

规则：

1. App、template 和 compatibility callers 继续从 `@carboti/ui`、`packages/ui/src/index.ts` 或
   `packages/ui/src/menu.tsx` import dropdown primitives。
2. `dropdown-menu.tsx` 只负责 re-exports。
3. `dropdown-menu-base.tsx` 负责 root、portal、trigger、content、group、label、item、separator
   和 shortcut wrappers。
4. `dropdown-menu-choice-items.tsx` 负责 checkbox/radio item indicators 和 radio group wiring。
5. `dropdown-menu-submenu.tsx` 负责 submenu root、trigger 和 submenu content composition。
6. UI smoke guards 必须读取 facade 与 internal modules，防止 registry-backed menu behavior
   悄悄回流到混合单文件 implementation。

原因：

Dropdown primitive 仍然是一个有用的单一 interface，但 implementation 里混了三种修改节奏：base
popup positioning、choice item indicator behavior、submenu composition。拆成 package-internal
modules 可以提高 menu changes 的 locality，同时保留现有 `@carboti/ui` primitive seam。

### 2026-07-06: Alert Dialog Package-Internal Modules

Decision:

保留 `packages/ui/src/alert-dialog.tsx` 作为 registry-backed `AlertDialog` primitive facade，并把 Base
UI root/trigger/portal、overlay/content、layout text/media 和 action/cancel wrappers 移入 focused
package-internal modules。

规则：

1. App、composition 和 template callers 继续从 `@carboti/ui` 或
   `packages/ui/src/alert-dialog.tsx` import alert-dialog primitives。
2. `alert-dialog.tsx` 只负责 re-exports。
3. `alert-dialog-base.tsx` 负责 root、trigger 和 portal wrappers。
4. `alert-dialog-content.tsx` 负责 overlay/backdrop styling、popup positioning、animation classes
   和 default portal composition。
5. `alert-dialog-layout.tsx` 负责 header、footer、media、title 和 description wrappers。
6. `alert-dialog-actions.tsx` 负责 action 和 cancel button wrappers。
7. UI smoke guards 必须读取 facade 与 internal modules，防止 alert-dialog content、layout 和 action
   behavior 悄悄回流到混合单文件 implementation。

原因：

AlertDialog primitive 仍然是一个有用的单一 interface，但 implementation 混合了 Base UI
entrypoints、overlay/popup animation policy、title/media layout、footer layout 和 action-button
adaptation。拆成 package-internal modules 可以提高 destructive-confirmation changes 的 locality，同时
保留 `ConfirmDialog` 与 app pages 使用的现有 `@carboti/ui` primitive seam。

### 2026-07-06: Dialog Package-Internal Modules

Decision:

保留 `packages/ui/src/dialog.tsx` 作为 registry-backed `Dialog` primitive facade，并把 Base UI
root/trigger/portal/close、overlay/content 和 layout wrappers 移入 focused package-internal modules。

规则：

1. App、shell、composition 和 template callers 继续从 `@carboti/ui` 或 `packages/ui/src/dialog.tsx`
   import dialog primitives。
2. `dialog.tsx` 只负责 re-exports。
3. `dialog-base.tsx` 负责 root、`DialogRoot`、trigger、portal 和 close wrappers。
4. `dialog-content.tsx` 负责 overlay/backdrop styling、popup positioning、animation classes 和
   optional top-right close affordance。
5. `dialog-layout.tsx` 负责 header、footer、title、description 和 optional footer close behavior。
6. UI smoke guards 必须读取 facade 与 internal modules，防止 dialog content 和 layout behavior
   悄悄回流到混合单文件 implementation。

原因：

Dialog primitive 仍然是一个有用的单一 interface，但 implementation 混合了 Base UI
entrypoints、overlay/popup animation policy、top-right close affordance、footer layout 和 text
wrappers。拆成 package-internal modules 可以提高 overlay 和 shell-panel changes 的 locality，同时保留
command search、user panels 和 app pages 使用的现有 `@carboti/ui` primitive seam。

### 2026-07-06: Input Group Package-Internal Modules

Decision:

保留 `packages/ui/src/input-group.tsx` 作为 shadcn-pattern `InputGroup` primitive facade，并把 group
container、addon alignment、button size adapter 和 input/textarea control adapters 移入 focused
package-internal modules。

规则：

1. App、command、form 和 template callers 继续从 `@carboti/ui` 或
   `packages/ui/src/input-group.tsx` import input-group primitives。
2. `input-group.tsx` 只负责 re-exports。
3. `input-group-base.tsx` 负责 group container、focus、invalid、disabled、block/inline layout
   state classes。
4. `input-group-addon.tsx` 负责 addon alignment variants 和 input-focus-on-addon-click behavior。
5. `input-group-button.tsx` 负责 button size variants 和 qitu `Button` adapter。
6. `input-group-controls.tsx` 负责 text、input 和 textarea control adapters。
7. UI smoke guards 必须读取 facade 与 internal modules，防止 input-group addon、button 和 control
   behavior 悄悄回流到混合单文件 implementation。

原因：

InputGroup primitive 仍然是一个有用的单一 interface，但 implementation 混合了 container state
policy、addon alignment、button adaptation 和 input/textarea control adaptation。拆成
package-internal modules 可以提高 form-control changes 的 locality，同时保留 command input、forms 和 app
pages 使用的现有 `@carboti/ui` primitive seam。

### 2026-07-06: Upload Queue Package-Internal Modules

Decision:

保留 `packages/ui/src/upload-queue.tsx` 作为 qitu `UploadQueue` primitive facade，并把 public queue
item types、dropzone/root behavior、empty and compact states 和 row/action rendering 移入 focused
package-internal modules。

规则：

1. App、review、source page 和 template callers 继续从 `@carboti/ui` 或
   `packages/ui/src/upload-queue.tsx` import `UploadQueue`、`UploadQueueItem` 与
   `UploadQueueItemStatus`。
2. `upload-queue.tsx` 只负责 re-exports。
3. `upload-queue-types.ts` 负责 public queue item/status model 和 internal props type。
4. `upload-queue-root.tsx` 负责 drag/drop handling、empty/non-empty branching、compact-mode
   selection 和 dropzone wrapper classes。
5. `upload-queue-empty.tsx` 负责 empty 和 compact empty-state rendering。
6. `upload-queue-items.tsx` 负责 upload row rendering、retry/remove actions 和 status-tone
   projection。
7. UI smoke guards 必须读取 facade 与 internal modules，防止 upload queue root、empty-state、row 和
   status behavior 悄悄回流到混合单文件 implementation。

原因：

UploadQueue primitive 仍然是 source 和 review surfaces 使用的单一有用 interface，但 implementation
混合了 public queue item types、drag/drop orchestration、compact empty-state layout、ordinary
empty-state layout、row metadata rendering、retry/remove actions 和 status-tone projection。拆成
package-internal modules 可以提高 file-intake UI changes 的 locality，同时保留 app-owned upload
controllers 使用的现有 `@carboti/ui` primitive seam。

### 2026-07-06: Table Package-Internal Modules

Decision:

保留 `packages/ui/src/table.tsx` 作为 shadcn-pattern `Table` primitive facade，并把 table root 和
scroll-area behavior、table section wrappers、cell/head/caption wrappers 移入 focused
package-internal modules。

规则：

1. App、review、source、audit 和 template callers 继续从 `@carboti/ui` 或
   `packages/ui/src/table.tsx` import table primitives。
2. `table.tsx` 只负责 re-exports。
3. `table-root.tsx` 负责 table container wrapper 和 `TableScrollArea` bounded-scroll contract。
4. `table-sections.tsx` 负责 header、body、footer 和 row wrappers。
5. `table-cells.tsx` 负责 head、cell edge rounding、caption 和 `TableCellProps`。
6. UI smoke guards 必须读取 facade 与 internal modules，防止 table scroll-area、section 和 cell
   behavior 悄悄回流到混合单文件 implementation。

原因：

Table primitive 仍然是一个有用的单一 interface，但 implementation 混合了 bounded scroll-area
contract 和 native table section/cell wrappers。拆成 package-internal modules 可以提高 dense-table
和 scroll behavior changes 的 locality，同时保留 review、source 和 audit surfaces 使用的现有
`@carboti/ui` primitive seam。

### 2026-07-06: Calendar Package-Internal Modules

Decision:

保留 `packages/ui/src/calendar.tsx` 作为 registry-backed `Calendar` primitive facade，并把 DayPicker
class-name mapping、custom calendar parts 和 day-button behavior 移入 focused package-internal
modules。

规则：

1. App 和 template callers 继续从 `@carboti/ui` import `Calendar` 与 `CalendarDayButton`。
2. `calendar.tsx` 负责 public `Calendar` wrapper、DayPicker wiring、month dropdown formatting、
   locale handoff，以及 re-export `CalendarDayButton`。
3. `calendar-class-names.ts` 负责 `react-day-picker` class-name map、previous/next button
   variants、caption layout classes、range/today/outside state classes，以及 caller class
   overrides。
4. `calendar-parts.tsx` 负责 custom root、chevron 和 week-number renderers。
5. `calendar-day-button.tsx` 负责 focused-day ref behavior 和 selected/range data attributes。
6. UI smoke guards 必须读取 facade 与 internal modules，防止 calendar layout、part overrides 和
   day behavior 悄悄回流到混合单文件 implementation。

原因：

Calendar primitive 仍然是一个有用的单一 interface，但 implementation 混合了 DayPicker styling
policy、component overrides、day-cell focus/selection behavior。拆成 package-internal modules 可以提高
date-picker changes 的 locality，同时保留现有 `@carboti/ui` primitive seam。

### 2026-07-06: Select Package-Internal Modules

Decision:

保留 `packages/ui/src/select.tsx` 作为 registry-backed `Select` primitive facade，并把 Base UI select
trigger/value/group、popup/scroll controls 和 item/indicator implementations 移入 focused
package-internal modules。

规则：

1. App、form 和 template callers 继续从 `@carboti/ui` 或 `packages/ui/src/select.tsx` import select
   primitives。
2. `select.tsx` 只负责 re-exports。
3. `select-base.tsx` 负责 root alias、group、value 和 trigger wrappers。
4. `select-content.tsx` 负责 popup positioning、popup animation classes、list wiring 和 scroll
   arrows。
5. `select-items.tsx` 负责 labels、item text、item indicator 和 separator wrappers。
6. UI smoke guards 必须读取 facade 与 internal modules，防止 select trigger/content/item behavior
   悄悄回流到混合单文件 implementation。

原因：

Select primitive 仍然是一个有用的单一 interface，但 implementation 混合了 trigger rendering、popup
positioning/scroll behavior、option item indicator behavior。拆成 package-internal modules 可以提高
select changes 的 locality，同时保留 form fields 和 app pages 使用的现有 `@carboti/ui` primitive seam。

### 2026-07-06: Command Package-Internal Modules

Decision:

保留 `packages/ui/src/command.tsx` 作为 registry-backed `Command` primitive facade，并把 cmdk
root/list/group、dialog wrapper、input wrapper 和 item/shortcut implementations 移入 focused
package-internal modules。

规则：

1. App、shell 和 template callers 继续从 `@carboti/ui` 或 `packages/ui/src/command.tsx` import command
   primitives。
2. `command.tsx` 只负责 re-exports。
3. `command-base.tsx` 负责 root、list、empty、group 和 separator wrappers。
4. `command-dialog.tsx` 负责 dialog wrapper、visually hidden title/description、dialog content
   positioning 和 close-button default。
5. `command-input.tsx` 负责 input group wrapper、cmdk input 和 search icon affordance。
6. `command-item.tsx` 负责 item state classes、selected-item check indicator 和 shortcut wrapper。
7. UI smoke guards 必须读取 facade 与 internal modules，防止 command dialog/input/item behavior
   悄悄回流到混合单文件 implementation。

原因：

Command primitive 仍然是一个有用的单一 interface，但 implementation 混合了 palette container
behavior、dialog overlay wiring、input adornment、list/group wrappers 和 item indicator behavior。
拆成 package-internal modules 可以提高 command-search changes 的 locality，同时保留 shell search 和
command fixtures 使用的现有 `@carboti/ui` primitive seam。

### 2026-07-05: Example Feature Module Facades

Decision:

保持 optional example package 的 import path 稳定，同时把 example feature implementation 拆入
example-internal focused modules。

规则：

1. `examples/import-review/src/index.ts` 和 `examples/json-records/src/index.ts` 继续作为 package
   import facades。
2. Example parser/source reading、staged-record parsing、adapter behavior 和 example record types
   放在 facade 旁边的 focused modules 中。
3. Smoke context 读取每个 example `src` directory 下的全部文件，确保 facade 变薄后仍覆盖 parser、
   adapter 和 commit behavior。
4. Package interface tests 会让 optional example adapters 独立跑过 parse、stage、validate 和
   commit paths，不依赖 Worker starter adapters。
5. Worker starter code 继续使用 app-owned starter adapters，不能 import optional example
   packages。

原因：

Examples 不是生产 feature，但它们是展示 app-owned feature locality 的教学界面。拆分后，第二个
feature example 更容易复制，同时不改变 public example package seam，也不把业务含义移进 reusable
packages。

### 2026-07-05: Web App Controller Props Builder

Decision:

保持 `apps/web/src/use-app-controller.ts` 作为 app-owned workflow orchestration hook，同时把
`AuthenticatedWorkspaceProps` assembly 放入 focused `app-controller-workspace-props.ts`。

规则：

1. `use-app-controller.ts` 继续负责 auth route gate selection、workflow hook wiring 和 app-owned
   workflow orchestration；route derivation 与 app-owned navigation helper 由
   `use-app-route-navigation.ts` 负责。
2. `app-controller-workspace-props.ts` 负责把 workspace data、review actions、shell controller、
   upload controller、user management 和 view model 组装成 `AuthenticatedWorkspaceProps`。
3. `app.tsx` 和 authenticated workspace renderers 继续只消费现有 props contract，不直接知道各
   workflow hook 的内部 shape。
4. Smoke context 读取 controller、route navigation hook 与 props builder，防止 top-level app
   composition 重新长出 workflow details。

原因：

`use-app-controller.ts` 的价值在于集中 app-owned workflow orchestration；把大型 props object
assembly 留在同一个 hook 会降低 locality。独立 props builder 让 route/session/review/upload/audit/user
management 的 prop mapping 集中维护，同时不把这个 app-owned concern 提升成 reusable package。

### 2026-07-06: Web App Route Navigation Hook

Decision:

保留 `apps/web/src/use-app-controller.ts` 作为 app-owned workflow orchestration hook，并把 TanStack
router state、path-to-route derivation、auth route derivation 和 duplicate-navigation avoidance
移入 `apps/web/src/use-app-route-navigation.ts`。

规则：

1. `useAppController` 负责 auth、workspace data、review、upload、user management、route
   lifecycle、shell、route gate 和 authenticated workspace props 的 wiring。
2. `useAppRouteNavigation` 负责 `useLocation`、`useNavigate`、`authRouteFromPath`、
   `appRouteFromPath`、当前 pathname，以及 app-owned `navigate` helper。
3. Shell 和 top-level composition smoke guards 必须读取两个模块，防止 router implementation
   details 悄悄回流到 workflow orchestration hook。
4. 这仍然是 app-owned Web shell code，不引入 reusable routing package。

原因：

Controller 仍然有 workflow orchestration 的 depth，但里面也混入了修改节奏不同的 route adapter
mechanics。把 navigation mechanics 放到一个小 hook 后，route/path changes 的 locality 更好，同时
workflow hook 能专注组合 app-owned state modules。

### 2026-07-06: Web App Route Gate Props Projection

Decision:

保留 `apps/web/src/use-app-controller.ts` 作为 app-owned workflow orchestration hook，并把 auth
route-gate prop projection 移入 `apps/web/src/app-controller-route-gate-props.ts`。

规则：

1. `useAppController` 继续负责 auth、workspace data、review、upload、user management、route
   lifecycle、shell、route gate 和 authenticated workspace props 的 wiring。
2. `app-controller-route-gate-props.ts` 负责把 app action runner、auth workflow、auth route、route
   和 notice text 投影成 `AppRouteGateProps`。
3. `app-controller-workspace-props.ts` 继续负责 authenticated workspace prop projection。
4. Top-level composition smoke guards 必须读取 controller、route-gate props builder、route
   navigation hook 和 workspace props builder，防止 route-gate action mapping 悄悄回流到
   controller。
5. 这仍然是 app-owned Web shell code，不引入 reusable auth-routing package。

原因：

Controller 应该保留 workflow orchestration 的 locality，但 route-gate prop mapping 有不同修改节奏：
invite acceptance、local setup、login、reset、auth form updates 和 setup-role changes 属于 auth entry
surfaces，而不是 workspace orchestration。把这个 projection 移到 focused module 后，controller 的
interface 更小，同时保留现有 route-gate 和 authenticated workspace seams。

### 2026-07-06: Web Review Records Table Modules

Decision:

保留 `apps/web/src/review-records-table.tsx` 作为 review-record table interface，同时把 row 和
empty-state rendering 移入 focused app-owned modules。

规则：

1. `ReviewRecordsTable` 负责 table structure、column sizing、headers、empty/non-empty branching
   和 record iteration。
2. `ReviewRecordRow` 负责 staged-record cell rendering、payload summary、issue/status display
   和单条记录 approve/reject controls。
3. `ReviewRecordsEmptyState` 负责 empty staged-record row 与 `DataState` copy wiring。
4. Review-console smoke context 和 guards 必须读取 table、row、empty-state modules，防止该拆分
   悄悄退回混合 table implementation。

原因：

Review table 属于 app-owned workflow UI，不是 reusable table primitive。保留小的 table interface，
同时把 per-row decision controls 和 empty-state wiring 放进 focused modules，可以提高
review-surface 修改的 locality，又不会把 starter-specific workflow semantics 提升进 `packages/ui`。

### 2026-07-06: Review Workspace Route Props Projection

Decision:

保留 `apps/web/src/review-workspace-route.tsx` 作为 review route shell adapter，并把
`AuthenticatedWorkspaceProps` 到 `ReviewConsoleProps` 的 projection 移入
`apps/web/src/review-workspace-route-props.ts`。

规则：

1. `ReviewWorkspaceRoute` 负责在 workspace shell route 中渲染 review console，并追加 shell
   overlays。
2. `buildReviewConsoleProps` 负责 `ReviewConsole` 的 permission projection、shell navigation
   projection、async action void-wrapping、upload wiring，以及 review/workspace data projection。
3. `review-console-types.ts` 负责 `ReviewConsoleProps` 与 `ReviewCounts`；`review-console.tsx`
   负责 visual AppShell 与 panel layout。
4. Review-console smoke context 和 guards 必须读取 route、route-props、console、console-types
   modules，防止 prop projection 悄悄回流到 route adapter。

原因：

Review route 逐渐变成混合 adapter：它既选择 review shell route，又 inline 展开大型 console prop
interface。把 projection 移入 focused module，可以提高 review console interface changes 的 locality，
同时保留原有 caller-facing review route。

### 2026-07-06: Workspace Not-Found Route Module

Decision:

保留 `apps/web/src/workspace-shell-route-content.tsx` 作为普通 workspace route-to-page adapter，
并把 fallback not-found route UI 移入 `apps/web/src/workspace-not-found-route.tsx`。

规则：

1. `WorkspaceShellRouteContent` 负责 route matching 到 focused route content modules。
2. `WorkspaceNotFoundRoute` 负责 fallback UI、translated copy、open-workspace action，以及该
   action 使用的 default authenticated path。
3. Shell smoke context 和 guards 必须读取两个模块，防止 fallback UI 悄悄回流到 route adapter。
4. 这仍然是 app-owned Web shell code，不创建 reusable `packages/ui` primitive。

原因：

Workspace route adapter 里只有 not-found fallback 分支是真正的 UI branch。把它移进 focused
module，可以提高 shell fallback states 的 locality，同时让普通 route matching 保持紧凑。

### 2026-07-06: Workspace Route Content Projection Modules

Decision:

保留 `apps/web/src/workspace-shell-route-content.tsx` 作为普通 workspace route switch，并把
workspace-section 与 settings-section page prop projection 移入 focused app-owned route content
modules。

规则：

1. `WorkspaceShellRouteContent` 负责把当前 `AppRoute` 匹配到 route content module，并保留
   not-found fallback wiring。
2. `workspace-route-workspace-content.tsx` 负责 overview、source 和 import page prop projection。
3. `workspace-route-settings-content.tsx` 负责 audit、users 和 account page prop projection。
4. `workspace-shell-route-content-types.ts` 负责 `WorkspaceShellRouteContentProps`，避免 focused
   route content modules 通过 route switch facade 做 type-import。
5. Shell smoke context 和 guards 必须读取 route switch、route content type module、workspace route
   content module、settings route content module 和 not-found route module，防止 page prop
   projection 悄悄回流到 route switch。
6. 这仍然是 app-owned Web shell code，不引入 reusable routing package，也不把业务含义移入
   `packages/ui`。

原因：

Route switch 仍然有价值，但它混合了 route matching 和六个 page-specific prop projections。
Source/import pages、audit/users/account settings pages，以及 not-found fallback 的修改原因不同。
拆出 focused route content modules 可以提高 page interface changes 的 locality，同时保留 authenticated
workspace shell 的小 route switch seam。

### 2026-07-06: Workspace Search Dialog Modules

Decision:

保留 `apps/web/src/workspace-search-dialog.tsx` 作为 shell search overlay composition module，并把
search entry typing、filtering 和 result rendering 移入 focused app-owned modules。

规则：

1. `WorkspaceSearchDialog` 负责 dialog wiring、input focus、query field rendering，以及选择后的
   close/query reset behavior。
2. `workspace-search-types.ts` 负责通过 `shell-controls` 导出的 shared `SearchEntry` type。
3. `workspace-search-filter.ts` 负责 query normalization、search matching 和 result limiting。
4. `WorkspaceSearchResults` 负责 empty-state rendering 和 per-result command button rendering。
5. Shell smoke context 和 guards 必须读取所有 search modules，防止 filtering 与 result rendering
   悄悄回流到 dialog overlay module。

原因：

Shell search 有三种不同修改节奏：entry construction、query matching、overlay/result rendering。
`app-search.ts` 已经负责 entry construction；把 filtering 和 results 从 dialog 拆出，可以让 overlay
保持紧凑，同时保留原有 app-owned shell control interface。

### 2026-07-06: Workspace Shell Controller Projection Modules

Decision:

保留 `apps/web/src/use-workspace-shell-controller.tsx` 作为 workspace shell orchestration hook，并把
search-entry memoization 与 shell chrome node projection 移入 focused app-owned modules。

规则：

1. `useWorkspaceShellController` 负责 overlay state、navigation model creation，以及返回的 shell
   controller shape。
2. `workspace-shell-search.ts` 负责把 navigation entries、workspace data、users、audit events 和
   i18n formatters memoized projection 成 search entries。
3. `workspace-shell-chrome-nodes.tsx` 负责把 controller state JSX projection 成
   `WorkspaceShellActions` 与 `WorkspaceShellOverlays`。
4. Shell smoke context 和 guards 必须读取 controller、search projection、chrome-node projection、
   overlay-state 和 chrome modules，防止这些 implementation details 悄悄回流到 controller。
5. 这仍然是 app-owned Web shell code；不把 app navigation、user panels 或 search behavior 移入
   `packages/ui`。

原因：

Shell controller 混合了三种不同修改节奏：overlay/navigation state、search entry assembly、shell
chrome rendering。拆出 projection modules 可以提高 search 与 chrome changes 的 locality，同时保留
原有 caller-facing controller interface。

### 2026-07-06: Source Batch Action Module

Decision:

保留 `apps/web/src/workspace-page-sections/source-files-panel.tsx` 作为 source list panel
composition module，并把 selected/all source batch-action derivation 移入
`apps/web/src/workspace-page-sections/source-batch-actions.tsx`。

规则：

1. `SourceFilesPanel` 负责 `ListFrame`、source-file row iteration 和 row selection wiring。
2. `SourceBatchActions` 负责 pending/confirmed job id derivation、selected/all action availability、
   summary copy wiring，以及 shared `BatchActionBar` configuration。
3. Source page smoke context 和 guards 必须读取两个模块，防止 batch-action rules 悄悄回流到 list
   panel。
4. 该模块仍属于 app-owned source workflow UI，不把 source-specific behavior 加进 reusable
   `packages/ui`。

原因：

Source list panel 混合了列表渲染与 batch-action rules。把 selection/job-status action rules 移入
focused module，可以提高 source workflow 修改的 locality，同时保留原有 caller-facing panel interface。

### 2026-07-06: Import Diagnostics Detail Modules

Decision:

保留 `apps/web/src/workspace-page-sections/import-diagnostics-details.tsx` 作为 import diagnostics
composition module，并把 runtime rows、recovery guidance、event timeline rendering 移入 focused
app-owned modules。

规则：

1. `ImportDiagnosticsDetails` 只负责 diagnostic detail layout order。
2. `ImportDiagnosticsRuntimeRows` 负责 environment、job metadata、failure metadata、timestamps 和
   source hash runtime rows。
3. `ImportRecoveryPanel` 负责 recovery guidance projection、retry action availability 和 retry
   permission messaging。
4. `ImportEventTimeline` 负责把 import job events 投影为 qitu timeline items。
5. Import page smoke context 和 guards 必须读取四个模块，防止 row、recovery、timeline logic
   悄悄回流到 composition module。

原因：

Import diagnostics 里 runtime metadata、operator recovery guidance、event stream rendering 三种修改节奏
混在一个 detail module。拆成 focused modules 可以提高 import diagnostics 修改的 locality，同时保留
原有 caller-facing details interface。

### 2026-07-06: Invitation Row Detail And Action Modules

Decision:

保留 `apps/web/src/workspace-page-sections/invitation-row.tsx` 作为 invitation row composition
module，并把 metadata/email diagnostics 与 lifecycle actions 移入 focused app-owned modules。

规则：

1. `InvitationRow` 负责 row surface layout，并组合 focused row modules。
2. `InvitationRowDetails` 负责 invitation email、created/expires/accepted/revoked timestamps、
   latest email status，以及 failed-email diagnostic copy。
3. `InvitationRowActions` 负责 status/role/email badges，以及 pending、expired、revoked
   invitations 的 resend/revoke/delete action availability rules。
4. Import page smoke context 和 guards 必须读取三个模块，防止 invitation lifecycle actions 与
   email delivery diagnostics 悄悄回流到 row composition module。

原因：

Invitation row 混合了两种修改节奏：operator-facing delivery diagnostics 与 auth lifecycle action
rules。拆成 focused modules 可以提高 invitation management 修改的 locality，同时保留原有
caller-facing row interface，并把行为留在 app-owned Web code 中。

### 2026-07-06: UI Primitive Smoke Guard Modules

Decision:

保留 `scripts/smoke-ui-primitive-guards.mjs` 作为 UI primitive guard entrypoint，并把 registry
inventory、facade split checks、qitu-composed primitive/style checks 移入 focused smoke guard
modules。

规则：

1. `smoke-ui-primitive-guards.mjs` 只负责组合 focused UI primitive guard groups。
2. `smoke-ui-primitive-inventory-guards.mjs` 负责 registry-backed primitive facade existence
   checks。
3. `smoke-ui-primitive-facade-guards.mjs` 负责 registry-backed 与 qitu queue/table primitives 的
   package-internal facade split checks。
4. `smoke-ui-primitive-composition-guards.mjs` 负责 qitu-composed primitives、shell pieces、icons、
   token-backed style imports，以及 aggregate source/style checks。
5. Smoke inventory guards 必须列出这些 focused UI primitive guard modules，防止后续 cleanup
   悄悄删除它们。

原因：

UI primitive smoke guard 已经变成一个很长的 assertion，混合了 primitive inventory、package facade
split checks 和 qitu-composed style checks。拆成 focused guard modules 可以提高未来 UI primitive
changes 的 locality，同时保留 smoke runner 使用的现有 `assertUiPrimitiveGuards(context)` interface。

### 2026-07-06: Worker Smoke Context Surface Modules

Decision:

保留 `scripts/smoke-context-worker.mjs` 作为 Worker smoke context entrypoint，并把 Worker source input
assembly 按 runtime、auth、advisory、inbound email/MIME、import/review 和 source intake surfaces
移入 focused context modules。

规则：

1. `createSmokeWorkerContext` 保留现有 context field names，供 Worker、package、UI、neutrality 和
   runtime smoke guards 使用。
2. `smoke-context-worker-runtime.mjs` 负责 `workerSources`、Worker package metadata、
   `.dev.vars.example` 和 Wrangler config text 等 package/runtime source aggregation。
3. `smoke-context-worker-auth.mjs`、`smoke-context-worker-advisory.mjs`、
   `smoke-context-worker-inbound.mjs`、`smoke-context-worker-import.mjs` 和
   `smoke-context-worker-source.mjs` 分别负责对应 grouped source-text inputs。
4. Smoke context inventory guards 必须列出这些 focused Worker context modules，防止后续 cleanup
   悄悄把 coverage 折回 entrypoint。
5. 这只改变 smoke input locality；不改变 Worker runtime code、routes、schemas、migrations 或
   package boundaries。

原因：

Worker smoke context 已经变成一个大型 input aggregator，混合了彼此无关的 Worker surfaces。guard
consumers 本来就按 surface 运作，所以拆出 context readers 可以提高未来 Worker route/store refactors
的 locality，同时保留现有 `createSmokeWorkerContext` interface。

### 2026-07-06: Web Shell Smoke Guard Modules

Decision:

保留 `scripts/smoke-web-shell-guards.mjs` 作为 Web shell composition guard entrypoint，并把
workspace-home、module inventory、shell search、shell navigation 和 route/overlay composition
assertions 移入 focused guard modules。

规则：

1. `assertWebShellCompositionGuards` 保留现有 smoke runner interface，只负责组合 focused Web shell
   guard groups。
2. `smoke-web-shell-home-guards.mjs` 负责 app-owned workspace home slot invariant。
3. `smoke-web-shell-inventory-guards.mjs` 负责 Web shell module existence checks。
4. `smoke-web-shell-search-guards.mjs` 负责 search overlay module split checks。
5. `smoke-web-shell-navigation-guards.mjs` 负责 navigation model 与 app route navigation checks。
6. `smoke-web-shell-route-guards.mjs` 负责 route content、loading shell、overlay state、chrome
   node 和 fallback-route split checks。
7. Smoke Web inventory guards 必须列出这些 focused shell guard modules，防止后续 cleanup
   悄悄把 coverage 折回 entrypoint。

原因：

Web shell smoke guard 已经变成一个混合 assertion module，同时覆盖 home-slot replacement、module
inventory、search overlay decomposition、navigation model placement 和 route/overlay composition。
按 guard intent 拆分可以提高未来 shell refactors 的 locality，同时保留现有
`assertWebShellCompositionGuards(context)` interface。

### 2026-07-06: UI Primitive Facade Smoke Guard Families

Decision:

保留 `scripts/smoke-ui-primitive-facade-guards.mjs` 作为 UI primitive facade guard entrypoint，并把
package-internal facade split assertions 移入 overlay、form/control 和 data/list guard modules。

规则：

1. `assertUiPrimitiveFacadeGuards` 保留现有 smoke runner interface，只负责组合 focused UI primitive
   facade guard groups。
2. `smoke-ui-primitive-overlay-facade-guards.mjs` 负责 alert dialog、dialog 和 dropdown menu
   facade split checks。
3. `smoke-ui-primitive-form-facade-guards.mjs` 负责 calendar、command、input group 和 select
   facade split checks。
4. `smoke-ui-primitive-data-facade-guards.mjs` 负责 table 和 upload queue facade split checks。
5. Smoke UI inventory guards 必须列出这些 focused facade guard modules，防止后续 cleanup 悄悄把
   coverage 折回 facade entrypoint。

原因：

UI primitive facade guard 仍然混合了多个修改节奏不同的 primitive families。按 primitive family 拆分
可以提高 registry-backed primitive refactors 的 locality，同时保留现有
`assertUiPrimitiveFacadeGuards(context)` interface。

### 2026-07-06: Web Action Workflow Smoke Guard Modules

Decision:

保留 `scripts/smoke-web-action-workflow-guards.mjs` 作为 Web action workflow guard entrypoint，并把
auth/session、workspace/user/upload 和 review action assertions 移入 focused guard modules。

规则：

1. `assertWebActionWorkflowGuards` 保留现有 smoke runner interface，只负责组合 focused Web action
   workflow guard groups。
2. `smoke-web-action-auth-guards.mjs` 负责 auth workflow、session completion、local setup、login 和
   password-reset action module split checks。
3. `smoke-web-action-workspace-guards.mjs` 负责 user-management、upload queue、workspace review
   data、upload queue state 和 permission projection split checks。
4. `smoke-web-action-review-guards.mjs` 负责 review job、record、decision、commit 和 advisory
   action split checks。
5. Smoke Web inventory guards 必须列出这些 focused action workflow guard modules，防止后续 cleanup
   悄悄把 coverage 折回 entrypoint。

原因：

Web action workflow smoke guard 在一个 assertion 中混合了多个彼此无关的 action families。runtime
modules 已经按 auth、workspace support 和 review action concerns 拆分，所以让 guard structure
匹配这些 surfaces，可以提高未来 Web workflow refactors 的 locality，同时保留现有
`assertWebActionWorkflowGuards(context)` interface。

### 2026-07-06: Authenticated Workspace Prop Section Modules

Decision:

保留 `apps/web/src/app-controller-workspace-props.ts` 作为 authenticated workspace prop projection
facade，并把 section-level prop mapping 移入 `app-controller-workspace-prop-sections.ts`，把共享
builder input typing 放到 `app-controller-workspace-prop-types.ts`。

规则：

1. `buildAuthenticatedWorkspaceProps(options)` 仍然是 `useAppController` 使用的唯一 interface。
2. `app-controller-workspace-prop-sections.ts` 负责 audit、review、session、shell、upload、user
   management 和 workspace data 的 prop projections。
3. `app-controller-workspace-prop-types.ts` 负责 `BuildAuthenticatedWorkspacePropsOptions`，让 hook
   return shapes 不再混进 facade implementation。
4. Top-level 和 action workflow smoke guards 必须读取 facade、section builders 和 type module，防止
   review/session/shell mapping 悄悄回流到 orchestration hook 或单个大型 facade body。
5. 这仍然是 app-owned Web shell code；不引入 reusable core package knowledge，也不加入
   business-specific vocabulary。

原因：

Authenticated workspace props builder 已经变成一个单一 object literal，同时覆盖 audit filters、
review workflow actions、session state、shell chrome、upload queue、user management 和 workspace
home data 这些修改节奏不同的 section。保留 public facade、拆出 section builders，可以提高未来
workspace UI changes 的 locality，同时不扩大 controller 消费的 external interface。

### 2026-07-06: Mock Invitation Lifecycle Operations

Decision:

保留 `apps/web/src/mock-api-invitation-routes.ts` 作为 mock invitation route matcher，并把 invitation
create、accept、revoke、resend 和 delete mutations 移入
`apps/web/src/mock-api-invitation-operations.ts`。

规则：

1. Mock invitation routes 负责 HTTP path/method matching、request body reading 和 response shaping。
2. `mock-api-invitation-operations.ts` 负责 mock invitation state mutation、audit events、accepted
   invitation 的 session creation，以及未知 invite token 的 structured not-found errors。
3. `mock-api-operations.ts` 和 `mock-api-support.ts` re-export route 与 compatibility callers 使用的
   invitation operations。
4. Mock API smoke guards 必须同时读取 route module 和 operation module，防止 lifecycle mutation
   details 悄悄回流到 route matcher。
5. 这仍然是 browser-local mock API code；不影响 Worker routes 或 reusable packages。

原因：

Mock invitation route handler 已经变成一个混合 module：它既匹配 endpoints，也直接修改 invitation
lifecycle state。把 lifecycle behavior 放进现有 mock invitation operations module，可以提高
invitation test-fixture changes 的 locality，同时保留 mock API facade 消费的 route handler interface。

### 2026-07-06: Mock Auth Lifecycle Operations

Decision:

保留 `apps/web/src/mock-api-auth-routes.ts` 作为 mock auth route matcher，并把 demo session、login、
logout、password-reset request、password-reset confirmation 和 local bootstrap mutations 移入
`apps/web/src/mock-api-auth-operations.ts`。

规则：

1. Mock auth routes 负责 HTTP path/method matching、request body reading、health response shaping
   和 operation dispatch。
2. `mock-api-auth-operations.ts` 负责 mock auth state mutation、audit events、demo session shape、
   password-reset token/URL response data，以及 local bootstrap created/reset semantics。
3. `bootstrapDemoUser` 必须先计算 `created` 再修改 state，让 local demo setup notices 可以区分新建用户
   和重置已有用户。
4. `mock-api-operations.ts` 和 `mock-api-support.ts` re-export route 与 compatibility callers 使用的
   auth operations。
5. Mock API smoke guards 必须同时读取 route module 和 operation module，防止 auth lifecycle mutation
   details 悄悄回流到 route matcher。

原因：

Mock auth route handler 同时匹配 endpoints、修改 user/session state、写 audit events、生成
password-reset artifacts。把这些 lifecycle behavior 放进现有 mock auth operations module，可以提高
browser-local auth fixture changes 的 locality，并修正 local bootstrap 的 `created` 信号，同时不改变
route handler interface。

### 2026-07-06: Mock Advisory Lifecycle Operations

Decision:

保留 `apps/web/src/mock-api-advisory-routes.ts` 作为 mock advisory route matcher，并把 advisory
generate、confirm 和 dismiss mutations 移入 `apps/web/src/mock-api-advisory-operations.ts`。

规则：

1. Mock advisory routes 负责 HTTP path/method matching、list response shaping 和 operation
   dispatch。
2. `mock-api-advisory-operations.ts` 负责 suggested-advisory duplicate detection、advisory state
   mutation、audit events、import-job event entries 和 mock state persistence。
3. `createAdvisory` 继续作为 operation module 内部使用的 deterministic artifact factory。
4. `mock-api-operations.ts` 和 `mock-api-support.ts` re-export route 与 compatibility callers 使用的
   advisory operations。
5. Mock API smoke guards 必须确认 `pushAudit`、`pushJobEvent` 和 `writeState` 不会回流到 advisory
   route matcher。

原因：

Mock advisory route handler 仍然混合了 endpoint matching 与 human-decision lifecycle writes。把
generate/confirm/dismiss behavior 放进现有 mock advisory operations module，可以让 AI advisory fixture
changes 更集中，同时保留 mock import route facade 消费的 route handler interface。

### 2026-07-06: Mock Import Job Lifecycle Operations

Decision:

保留 `apps/web/src/mock-api-import-job-routes.ts` 作为 mock import-job route matcher，并把本地 queue
drain、commit 和 retry mutations 移入 `apps/web/src/mock-api-import-job-operations.ts`。

规则：

1. Mock import-job routes 负责 HTTP path/method matching、list/event response shaping 和 operation
   dispatch。
2. `mock-api-import-job-operations.ts` 负责 queued-job drain state transitions、commit persistence、
   retry failure reset、retry audit event 和 mock state persistence。
3. `mock-api-import-job-status.ts` 继续负责 shared status transition helpers 和 job-event
   projection。
4. `mock-api-operations.ts` 和 `mock-api-support.ts` re-export route 与 compatibility callers 使用的
   import-job operations。
5. Mock API smoke guards 必须确认 retry/drain mutation details 不会回流到 import-job route matcher。

原因：

Mock import-job route handler 仍然混合 endpoint matching、本地 queue drain、commit persistence，以及
retry state/audit writes。把 lifecycle behavior 放进 focused operation module，可以提高 browser-local
import job fixture changes 的 locality，同时保持 list/event routes 足够薄。

### 2026-07-06: Mock Import Review Decision Operations

Decision:

保留 `apps/web/src/mock-api-import-review-routes.ts` 作为 mock import review route matcher，并把
route-facing review decision persistence 移入
`apps/web/src/mock-api-review-decision-operations.ts`。

规则：

1. Mock import review routes 负责 HTTP path/method matching、review read response shaping 和
   operation dispatch。
2. `confirmPendingRecordsForState` 和 `decideRecordForState` 负责 review decision mutations 的
   current-user lookup 与 mock state persistence。
3. `confirmPendingRecords` 和 `decideRecord` 继续作为 decision operation module 内部使用的 lower-level
   mutation helpers。
4. Mock API smoke guards 必须确认 review decision routes 通过 route-facing operations dispatch，并且
   不直接调用 `writeState`。

原因：

Import review route 已经把实际 record/audit/job-event mutation 委托出去，但 review decisions 的 user
lookup 和 state persistence 仍在 route 内。把这些细节放进 review decision operation module，可以让 route
matcher 更薄，并让 decision lifecycle writes 保持集中。

### 2026-07-06: Mock Workspace Write Operations

Decision:

保留 `apps/web/src/mock-api-workspace-routes.ts` 作为 mock workspace route matcher，并把 user delete
和 source-upload persistence 移入 focused operation modules。

规则：

1. Mock workspace routes 负责 HTTP path/method matching、list response shaping、audit filtering
   response shaping 和 operation dispatch。
2. `mock-api-user-operations.ts` 负责 demo user deletion validation、user state mutation、audit
   event writing 和 mock state persistence。
3. `mock-api-source-upload.ts` 中的 `uploadSourceFileForState` 负责现有 upload implementation 外层的
   current-user lookup 与 mock state persistence。
4. `mock-api-operations.ts` 和 `mock-api-support.ts` re-export route 与 compatibility callers 使用的
   workspace write operations。
5. Mock API smoke guards 必须确认 `pushAudit` 和 `writeState` 不会回流到 workspace route matcher。

原因：

Workspace route 处理多个 read endpoints，同时还内嵌 user deletion 和 source upload persistence 两个
write workflows。把这些 writes 放进 user 与 upload operation modules，可以保持 route matching 足够薄，
并把 browser-local fixture state changes 集中到拥有对应行为的地方。

### 2026-07-06: Animated Icon CSS Motion Variables

Decision:

保留 `packages/ui/src/styles/animated-icon.css` 作为 AnimatedIcon motion stylesheet，并用
root-level CSS transform variables 替换重复的 per-motion ancestor hover selectors，再由 icon part
selectors 统一消费这些变量。

规则：

1. `AnimatedIcon` 继续暴露相同的 `qitu-animated-icon` classes 和 `data-motion` interface。
2. Button、link、panel action、command row、primary button 和 topbar control 的 hover/focus state 在
   icon root 上设置 `--qitu-icon-*-transform` variables。
3. Icon part selectors 只读取这些变量一次，让 motion behavior 保持集中，同时不再为每个 SVG part
   重复同一组 ancestor selector。
4. Reduced-motion media rule 继续留在同一个 stylesheet，并继续禁用 icon transitions 和 transforms。
5. UI smoke guards 必须确认 variable-driven motion shape，防止该文件回退成很长的 repeated-selector
   implementation。

原因：

Animated icon stylesheet 变成最大的 UI source file，主要原因是每个 motion 都重复同一组 hover/focus
ancestor selector。把 transform 移到 CSS variables 后，可以保留 public icon interface，同时提高未来
motion tweaks 的 locality，并减少重复 CSS。

### 2026-07-06: Animated Icon Registry Groups

Decision:

保留 `packages/ui/src/animated-icon-registry.tsx` 作为 public `iconRegistry` composition module，并把
selected SVG definitions 移入 `animated-icon-registry-shell.tsx` 和
`animated-icon-registry-workflow.tsx`，共享 `IconDefinition` typing 放在
`animated-icon-registry-types.ts`。

规则：

1. `AnimatedIcon` 继续从 `animated-icon-registry.tsx` import `iconRegistry`。
2. Shell chrome icons 放在 `animated-icon-registry-shell.tsx`；review/intake/workflow icons 放在
   `animated-icon-registry-workflow.tsx`。
3. `animated-icon-registry-types.ts` 负责 `IconDefinition`，`animated-icon-types.ts` 继续负责 public
   icon names、props 和 motion names。
4. UI smoke guards 必须读取 aggregator 与 grouped registry modules，避免新增图标重新回流到单个大
   registry 文件。

原因：

Registry 已经成为最大的 TypeScript UI source file，但 public interface 仍然有价值。按变化节奏分组
selected SVG definitions，可以提高未来 shell 与 workflow icon additions 的 locality，同时保留现有
`AnimatedIcon` interface。
