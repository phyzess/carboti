# Auth and Security

Status: draft
Date: 2026-06-27

## 1. Auth Model

`qitu` uses app-managed auth by default.

Current scaffold status:

1. `@carboti/auth` owns email normalization, invitation token hashing, PBKDF2 password hashing, and session token hashing.
2. `apps/worker` exposes local baseline routes for bootstrap invite, local demo user bootstraps, authenticated invite, user/invitation management, accept, login, logout, current user lookup, and password reset.
3. `apps/worker/migrations` store token hashes and password hashes, never plaintext tokens or passwords.
4. `@carboti/email` renders invitation and password-reset messages. Worker delivery supports `store` and `send` modes, uses Cloudflare `send_email` in send mode, and always records `email_messages` metadata.
5. `@carboti/rbac` owns the starter role/permission table. Worker write routes check permissions before mutating data and audit denied attempts.

`packages/auth/src/index.ts` is the package interface facade. Auth schemas, expiry helpers, identity
normalization, token generation/hashing, password hashing/verification, and invitation/session/reset
factories live in focused package-internal modules.

`packages/email/src/index.ts` is the package interface facade. Provider-neutral email schemas,
inbound receipt/attachment schemas, auth email locale dictionaries, and invitation/password-reset
rendering live in focused package-internal modules.

MVP defaults:

1. Email/password login.
2. Invitation-only onboarding.
3. Password reset by email.
4. HttpOnly Secure SameSite session cookie.
5. Server-side session records.
6. Token hashes stored in D1, never plaintext tokens.

## 2. Invitation Flow

```text
admin creates invitation
-> system creates token
-> D1 stores token hash
-> email sends invite link
-> user opens link
-> user sets password
-> account becomes active
-> session is created
```

Default:

```text
invite token expires after 1 day
```

## 2.1 Local Demo Users

Development uses local-only user bootstraps so a fresh checkout has usable login and admin-management paths without manual database edits:

```text
email: reviewer@example.com
email: admin@example.com
password: correct horse battery staple
```

The bootstrap routes create or reset these users only when `APP_ENV=local` and immediately create a session. The operator account exercises the confirmation workflow; the admin account exercises user and invitation management. Deployed environments must use invitation-only onboarding.

The web login page follows the same rule. It only shows the local `Setup` tab and demo credential affordances after `/health` reports `APP_ENV=local`. Preview and production login pages must present only normal login and password-reset flows.

## 2.2 Member and Invitation Management

The authenticated app shell includes user-facing account controls and an admin-only member and invitation settings route.

Baseline routes:

```text
GET /api/users
DELETE /api/users/:userId
GET /api/invitations
POST /api/invitations
POST /api/invitations/:invitationId/resend
POST /api/invitations/:invitationId/revoke
DELETE /api/invitations/:invitationId
```

These routes require a current session and the `invitation:create` permission. In the starter RBAC map, that means `owner` and `admin` can list users, list invitations, create invitations, resend pending or expired invitations, revoke pending invitations, delete revoked invitations, and hard-delete members. `reviewer` and `viewer` can still use the authenticated workbench, but member and invitation settings stay admin-only.

Invitation creation returns success when the invitation row is created even if email delivery fails. The response and `email_messages` row must mark `delivery: failed` so an administrator can resend without losing the pending invitation.

Member deletion is hard delete in the starter baseline. The route must:

1. Refuse to delete the current user.
2. Refuse to delete the last remaining `owner` or `admin`.
3. Delete password credentials, sessions, password reset tokens, and the user row.
4. Write audit and security events with only a minimal deleted-user snapshot.

For first-admin creation in a deployed environment, use `vp run ops:create-admin-invite` to seed a one-time admin invitation through an operator-reviewed process. Do not re-enable local bootstrap and do not insert a user/password directly; the first admin should still accept an invitation so password setup, session creation, and audit semantics stay aligned with the normal auth flow.

Local development may return the generated invite URL for authenticated invitation creation and resend. Non-local environments should rely on email delivery and must not expose plaintext invite tokens in API responses.

## 3. Session Defaults

```text
rolling expiry: 7 days
absolute expiry: 30 days
multi-device login: allowed
```

Security events that revoke sessions:

1. Password changed.
2. User disabled.
3. Role changed.
4. Security reset by admin.

## 4. Password Reset

```text
reset token expiry: 30 minutes
token storage: hash only
```

Rules:

1. Do not reveal whether an email exists.
2. Store reset tokens as hashes only.
3. Revoke existing sessions after successful reset.
4. Write security events.
5. Add rate limits before production use.

## 5. RBAC

Core roles can be customized per app, but the default set is:

```text
owner
admin
reviewer
viewer
```

Current starter permissions:

```text
owner/admin: invitation:create, source_file:upload, import_job:process, import_job:retry, review:decide, import_job:commit, ai_advisory:write
reviewer: source_file:upload, import_job:process, import_job:retry, review:decide, import_job:commit, ai_advisory:write
viewer: read-only
```

The package API is deliberately small:

```ts
can(principal, permission);
permissionsForRole(role);
```

Routes that mutate invitations, source files, import jobs, review decisions, commits, and AI advisory decisions must call `requirePermission`. Denied attempts return `403` and write an `rbac.denied` audit event with the permission, route, method, and role.

Future apps can replace or extend this mapping without changing the auth/session model. Tenant-aware resource scopes are intentionally not in the starter baseline yet.

## 6. Audit and Security Events

Always audit:

1. Invitation created/resent/revoked/deleted/accepted.
2. Login success/failure.
3. Logout.
4. Password reset requested/succeeded.
5. Role changes.
6. User deleted.
7. Source file upload.
8. Import approved/rejected/voided.
9. AI advisory triggered.
10. Permission denied.

If an app-owned feature adds source downloads later, download access must be permission checked and audited in the app layer.

Never log:

1. Plaintext password.
2. Plaintext token.
3. Session token.
4. Raw file content.
5. Full email body.

## 7. Future SSO

The app-managed identity model should leave room for:

```text
oidc
feishu
dingtalk
wecom
saml
```

SSO should be added as identities under `user_identities`, not by replacing the entire user model.
