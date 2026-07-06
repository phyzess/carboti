# UI 组件来源台账

状态：accepted baseline
日期：2026-07-02

这个台账记录 `@carboti/ui` shared primitives 的来源和合规状态，防止页面里重新手写“长得像 shadcn”的控件。

## 规则

1. Registry-backed primitives 通过根目录 shadcn workflow 安装或刷新，写入目标是 `packages/ui/components.json`。
2. 直接 `@base-ui/react` import 只允许出现在 `packages/ui` 的 registry-backed primitive 内，或作为迁移债记录在本文件。
3. App 页面只消费 `@carboti/ui`，不能直接 import Base UI，也不能用 page-local Tailwind recipe 复刻通用控件。
4. qitu compositions 应基于 registry-backed primitive，保持命名、props 和文案 business-neutral。
5. bespoke primitive 需要 decision-log 说明为什么 registry 和现有 qitu composition 不够用。
6. `AlertDialog`、`Calendar`、`Command`、`Dialog`、`DropdownMenu`、`Select` 等 registry-backed primitive 可以保留
   facade 文件，同时把 `react-day-picker` class map / parts、cmdk dialog/input/list/item wiring，或
   Base UI root/content/layout/action、trigger/content/item wiring、submenu、choice item 等实现拆入
   package-internal modules；对外 `@carboti/ui` export seam 必须保持稳定。
7. `InputGroup` 等 registry-pattern composition 也可以保留 facade 文件，同时把 group container、addon
   alignment、button size adapter 和 input/textarea control adapter 拆入 package-internal modules。
8. `UploadQueue` 等 qitu layout composition 可以保留 facade 文件，同时把 public types、dropzone root、
   empty/compact state 和 row/action rendering 拆入 package-internal modules。
9. `Table` 等 registry-pattern primitive 可以保留 facade 文件，同时把 scroll-area contract、table
   sections 和 cell/head/caption wrappers 拆入 package-internal modules。

## 当前来源

| 类别             | Primitives                                                                                                                                                  | 来源                                                            | 状态      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------- |
| Registry-backed  | AlertDialog, Button, Calendar, Checkbox, Command, Dialog, Drawer, DropdownMenu, Input, Popover, RadioGroup, Select, Separator, Sheet, Table, Tabs, Textarea | shadcn/Base UI registry、`react-day-picker`、`cmdk`、`vaul`     | Compliant |
| Registry pattern | Badge, Card, InputGroup                                                                                                                                     | shadcn registry pattern                                         | Compliant |
| qitu composition | ConfirmDialog, DateField, DetailDrawer, Menu, SegmentedControl, StatusBadge, TableScrollArea                                                                | 组合现有 shadcn/qitu primitives                                 | Compliant |
| qitu layout      | BatchActionBar, DataToolbar, FilterBar, ListFrame, ListActionRow, UploadQueue                                                                               | qitu token 和 layout primitive                                  | Compliant |
| qitu-specific    | AnimatedIcon, App shell, Qitu mark, Surface/DataState/Timeline/MetricStrip                                                                                  | business-neutral shell、workbench 和 grouped icon registry 需求 | Compliant |

## 维护规则

1. 刷新或新增 shared primitive 时，同步更新本台账，并保持 `vp run smoke` 通过。
2. 当 app 页面需要通用交互或布局 primitive 时，先补到这里，不要让 page-local lookalike 成为默认路径。
