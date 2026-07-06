# Package Boundaries

Status: draft
Date: 2026-06-27

## 1. Boundary Rule

Core packages must be business-neutral. App-owned feature code may depend on core packages, but core packages must not depend on app-owned feature code.

```text
packages/* -> no business meaning
apps/* -> deployable entrypoints and app-local features
examples/* -> non-production examples that prove boundaries
templates/* -> copyable starting points
```

`qitu` does not require a top-level `domains/*` folder. Concrete apps may organize business code by feature, workflow, bounded context, or vertical slice.

`examples/*` packages are non-production feature examples. They may keep `src/index.ts` as a
package import facade while parser/source reading, staged-record parsing, adapter behavior, and
example types live in focused example-internal modules. Reusable packages must not import optional
examples.

`apps/worker/src/*` may contain app-local modules that adapt reusable package interfaces to Cloudflare bindings and route wiring. Current examples include thin route composition entrypoints, auth route groups, source/import/audit/AI route groups, the app role policy, source-file intake, the import adapter registry, import job runner, import review routes, audit D1 store, email delivery store, inbound email routing, MIME parsing for inbound attachments, HTTP route helpers, and runtime config helpers. These modules are intentionally app-owned: they may know D1/R2/Queue/Email bindings and starter tables, but they must not move business meaning into `packages/*`.

Import review persistence is app-owned Worker wiring. Generic Worker routes depend on
`WorkerReviewStore`, while starter table knowledge stays in
`apps/worker/src/features/starter-review-*` modules. Reusable packages define review semantics and
adapter contracts, not D1 table names for staged or committed records.

Inbound email routing is app-owned Worker wiring. `packages/email` owns generic message, receipt,
and attachment schemas; `apps/worker/src/inbound-email.ts` adapts Cloudflare Email Routing to raw
R2 storage, D1 metadata, and source-file import handoff. MIME extraction lives in
`apps/worker/src/mime-parser.ts`, with parser-local header and transfer-decoding helpers beside it,
because parsing raw RFC822 payloads is Cloudflare Worker intake wiring, not a reusable
email-template concern yet.

## 2. Proposed Packages

### 2.1 `packages/auth`

Owns:

1. Users.
2. Password identity.
3. Invitations.
4. Password reset.
5. Sessions.
6. Login attempts.

Does not own:

1. Business roles.
2. Business resource permissions.
3. Business user profiles.

### 2.2 `packages/rbac`

Owns:

1. Permission registry.
2. Starter role policy helpers.
3. Business-neutral permission checks.
4. UI visibility helper primitives.

Does not own:

1. Business-specific actions.
2. Business-specific resource hierarchies.
3. The canonical role taxonomy of a cloned app.

`packages/rbac/src/index.ts` is the package interface facade. Generic RBAC types, policy
validation and normalization helpers, the starter role policy, and permission checks live in
focused package-internal modules. Worker and Web app-owned policy adapters keep importing from
`@carboti/rbac`.

### 2.3 `packages/files`

Owns:

1. R2 object key conventions.
2. Source file metadata.
3. Content hashing.
4. File validation helpers.

Can support later app-owned download routes, but the reusable package does not own a download API in the current starter baseline.

Does not own:

1. Business parsing.
2. Business file meaning.

### 2.4 `packages/jobs`

Owns:

1. Queue message envelope.
2. Idempotency helpers.
3. Retry classification.
4. Job logging hooks.
5. Failure alert hooks.

Does not own:

1. Business job handler logic.

### 2.5 `packages/import-pipeline`

Owns:

1. Import job creation.
2. Import job state machine.
3. Queue handoff.
4. Timeline events.
5. Review issue lifecycle.
6. Approve/reject/void flow.
7. Import feature adapter contract.
8. Generic review status helpers and staging key conventions.

`packages/import-pipeline/src/index.ts` is the package interface facade. Validation schemas,
generic import/review types, the adapter contract, review issue helpers, staging key conventions,
confirmation-language aliases, and review status derivation live in focused package-internal
modules.

Does not own:

1. Business staging table schema.
2. Business commit logic.
3. Parser internals for a specific file format.

### 2.6 `packages/audit`

Owns:

1. Append-only audit writes.
2. Audit query helpers.
3. Redaction.
4. Actor/session/request metadata.

Does not own:

1. Business-specific audit interpretation.

### 2.7 `packages/i18n`

Owns:

1. Locale metadata types.
2. Typed dictionary helpers.
3. Message interpolation.
4. Locale fallback, matching, and Accept-Language candidate helpers.
5. Locale-aware number, date/time, byte, plural, and relative-time formatting primitives.
6. Generic code-to-label helpers.

`packages/i18n/src/index.ts` is the package interface facade. Locale metadata types, interpolation,
message helpers, code-label helpers, locale-aware formatters, and locale negotiation live in focused
package-internal modules.

Does not own:

1. App route labels.
2. Product copy.
3. Business terminology.
4. Locale persistence policy.
5. React providers or UI controls.
6. App-owned dictionaries.

### 2.8 Security Capability

Security events are implemented through app-owned Worker modules and generic event tables. There is
no standalone `packages/security` package yet. Split one only when reuse pressure is proven.

A future package would own:

1. Security events.
2. Login failures.
3. Permission denial events.
4. Suspicious access patterns.

Does not own:

1. Business risk scoring.

### 2.9 Alerts Capability

Alerts are implemented through app-owned Worker modules and generic event tables. There is no
standalone `packages/alerts` package yet. Split one only when alert lifecycle behavior becomes
reusable.

A future package would own:

1. Alert creation.
2. Acknowledge/resolve.
3. Notification hooks.
4. Admin alert surfaces.

Does not own:

1. Business-specific escalation policy.

### 2.10 `packages/email`

Owns:

1. Transactional email sending.
2. Invitation email.
3. Password reset email.
4. Inbound email receipt and attachment schemas.
5. Provider-neutral email metadata contracts.

`packages/email/src/index.ts` is the package interface facade. Provider-neutral message and inbound
receipt schemas, auth email locale dictionaries, and invitation/password-reset rendering live in
focused package-internal modules.

Does not own:

1. Business-specific attachment parsing.
2. Cloudflare Email Routing configuration.
3. Raw inbound R2 object key policy.
4. Source-file import handoff.

### 2.11 `packages/ai-advisory`

Owns:

1. AI provider abstraction.
2. Advisory artifact storage.
3. Prompt/result redaction.
4. Human-confirmation enforcement.
5. AI usage audit hooks.

Does not own:

1. Business calculations.
2. Business truth.

### 2.12 `packages/ui`

Owns:

1. App shell.
2. Topbar primary navigation and secondary route tabs.
3. Common panels.
4. Forms.
5. Tables.
6. Review workflow components.
7. Timeline components.

Does not own:

1. Business-specific pages.
2. Business terminology.
3. The downstream-owned `/workspace` home content.

### 2.13 `packages/design-system`

Owns:

1. Tokens.
2. Typography.
3. Color.
4. Motion.
5. Spacing.
6. Theme primitives.

Does not own:

1. Business information architecture.

### 2.14 `packages/charts`

Owns:

1. Chart primitives.
2. Chart themes.
3. Tooltip and legend behavior.
4. Internal visx usage.

Does not own:

1. Business chart meaning.
2. Business metric calculation.

## 3. Feature Adapter Contract

Business-owned import features may expose:

```ts
type ImportFeatureModule = {
  id: string;
  name: string;
  routes?: unknown[];
  navigation?: unknown[];
  permissions?: unknown[];
  importAdapters?: ImportFeatureAdapter<unknown, unknown, unknown>[];
};
```

An import adapter should expose a narrow interface:

```ts
type ImportFeatureAdapter<TParsed, TStaged, TCommitted> = {
  id: string;
  canHandle(source: { filename: string; contentType: string }): boolean;
  parse(source: ReadableStream<Uint8Array>): Promise<TParsed[]>;
  stage(parsed: TParsed[]): Promise<TStaged[]>;
  validate(staged: TStaged): ReviewIssue[];
  commitApproved(input: {
    records: TStaged[];
    context: CommitApprovedContext;
  }): Promise<TCommitted[]>;
};
```

`CommitApprovedContext` is provided by the app layer after human confirmation. It carries confirmer identity, import job identity, approved staged record keys, and an idempotency key.

## 4. Anti-Leakage Checks

Before committing code to `packages/*`, ask:

1. Does this package mention a specific business?
2. Does it know a business-owned table name?
3. Does it know a business metric?
4. Does it decide business truth?
5. Would this package be reusable in a different internal tool?

If the answer is no for reuse, move it to app-owned feature code or an example.
