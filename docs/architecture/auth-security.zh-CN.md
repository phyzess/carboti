# 鉴权与安全

Status: draft
Date: 2026-06-27

## 1. 鉴权模型

`qitu` 默认采用 app-managed auth，不依赖 Cloudflare Access 作为产品用户登录方式。

当前 scaffold：

1. `@carboti/auth` 负责邮箱规范化、邀请 token hash、PBKDF2 密码 hash、session token hash。
2. `apps/worker` 暴露 bootstrap invite、local demo user bootstraps、authenticated invite、user/invitation management、accept、login、logout、me、password reset 等基线路由。
3. migration 只保存 token/password hash，不保存明文 token 或密码。
4. `@carboti/email` 渲染邀请与密码重置邮件；Worker 在非 local 环境使用 Cloudflare `send_email`。
5. `@carboti/rbac` 提供 starter role/permission 表；写路由在修改数据前做权限检查并审计拒绝事件。

`packages/auth/src/index.ts` 是 package interface facade。Auth schemas、expiry helpers、identity
normalization、token generation/hashing、password hashing/verification，以及
invitation/session/reset factories 放在 package-internal focused modules 中。

`packages/email/src/index.ts` 是 package interface facade。Provider-neutral email schemas、inbound
receipt/attachment schemas、auth email locale dictionaries，以及 invitation/password-reset
rendering 放在 package-internal focused modules 中。

MVP 默认：

1. 邮箱和密码登录。
2. 邀请制开户。
3. 邮件自助重置密码。
4. HttpOnly Secure SameSite session cookie。
5. 服务端 session 记录。
6. token 只存 hash。

## 2. 邀请流程

```text
admin 创建邀请
-> 系统生成 token
-> D1 保存 token hash
-> 邮件发送邀请链接
-> 用户打开链接
-> 用户设置密码
-> 账号变为 active
-> 创建 session
```

默认邀请有效期：

```text
1 day
```

## 2.1 Local Demo Users

本地开发提供 local-only user bootstrap，让全新 checkout 不需要手改数据库也有可用登录和成员/邀请管理路径：

```text
email: reviewer@example.com
email: admin@example.com
password: correct horse battery staple
```

这些 bootstrap route 只在 `APP_ENV=local` 时创建或重置用户，并立即创建 session。reviewer 账号用于体验 review workflow；admin 账号用于体验 user/invitation management。部署环境必须继续使用 invitation-only onboarding。

## 2.2 成员与邀请管理

登录后的 app shell 包含账号控制与 admin-only 成员与邀请设置路由。

基线路由：

```text
GET /api/users
GET /api/invitations
POST /api/invitations
POST /api/invitations/:invitationId/revoke
```

这些路由要求当前 session，并要求 `invitation:create` 权限。starter RBAC 中 `owner` 与 `admin` 可以列出用户、列出邀请、创建邀请并撤销待接受邀请；`reviewer` 与 `viewer` 可以继续使用登录后的工作区，但成员与邀请设置保持 admin-only。

本地开发环境中，authenticated invitation creation 可以返回生成的 invite URL；非本地环境应依赖邮件投递，不应在 API response 中暴露明文 invite token。

## 3. Session 默认值

```text
rolling expiry: 7 days
absolute expiry: 30 days
multi-device login: allowed
```

以下事件应 revoke session：

1. 修改密码。
2. 用户被禁用。
3. 角色变更。
4. 管理员发起安全重置。

## 4. 密码重置

默认：

```text
reset token expiry: 30 minutes
token storage: hash only
```

规则：

1. 不暴露邮箱是否存在。
2. reset token 只存 hash。
3. reset 成功后 revoke 现有 session。
4. 写 security events。
5. production 前补 rate limit。

## 5. RBAC

默认角色：

```text
owner
admin
reviewer
viewer
```

starter 权限：

1. `owner/admin`：邀请、上传、处理导入、retry、review decision、commit、AI advisory write。
2. `reviewer`：上传、处理导入、retry、review decision、commit、AI advisory write。
3. `viewer`：只读。

核心 API 保持小：

```ts
can(principal, permission);
permissionsForRole(role);
```

变更邀请、源文件、导入作业、review decision、commit、AI advisory 的路由必须调用 `requirePermission`。拒绝时返回 `403` 并写 `rbac.denied` audit event。

## 6. 审计与安全事件

必须审计：

1. 邀请创建、撤销、接受。
2. 登录成功/失败。
3. 登出。
4. 密码重置请求/成功。
5. 角色变化。
6. 用户禁用/恢复。
7. 文件上传。
8. 导入审批、拒绝、作废。
9. AI advisory 生成或确认。
10. 权限拒绝。

如果后续 app-owned feature 增加 source download，下载访问也必须在 app layer 做权限校验并写审计。

禁止记录：

1. 明文密码。
2. 明文 token。
3. session token。
4. 原始文件内容。
5. 完整邮件正文。

## 7. 未来 SSO

未来可加：

```text
oidc
feishu
dingtalk
wecom
saml
```

SSO 应作为 `user_identities` 下的身份来源扩展，而不是推翻整个 user/session 模型。
