# AI Advisory

Status: draft
Date: 2026-06-27

## 1. Principle

AI is advisory. It may assist humans, but it must not silently commit business truth.

```text
AI suggests.
Humans confirm.
Deterministic code commits.
```

## 2. Good Uses

1. Explain validation errors.
2. Suggest field mappings.
3. Summarize import issues.
4. Draft review notes.
5. Draft reports.
6. Extract candidate data from messy text.

## 3. Disallowed Uses

1. Final calculation of business metrics.
2. Silent overwrite decisions.
3. Bypassing review.
4. Creating untraceable business data.
5. Storing sensitive prompts without redaction.

## 4. Current Baseline

Implemented baseline:

1. `packages/ai-advisory` defines advisory schemas, provider contract, and a deterministic local import-review summary generator.
2. `apps/worker/migrations/0005_ai_advisories.sql` stores advisory artifacts in D1.
3. Worker routes support list, generate, confirm, and dismiss for import-job advisories.
4. The React console renders advisory artifacts near the review guardrails.
5. Audit events are written for generation and human decisions.

The current generator is not a model call. It is a local deterministic provider used to prove storage, review, audit, and UI boundaries before adding Workers AI, DeepSeek, or another provider.

## 5. Advisory Artifact

AI outputs are stored as artifacts:

```text
ai_advisory_artifacts
```

The artifact should include:

1. Provider.
2. Model.
3. Prompt template version.
4. Redacted input summary.
5. Output.
6. Created time.
7. Actor user ID.
8. Related import job ID.
9. Human decision status.

## 6. Human Confirmation

Any AI suggestion that affects business-owned data must be shown in review UI and confirmed by a human.

Audit event:

```text
ai_advisory.generated
ai_advisory.confirmed
ai_advisory.dismissed
```

Confirmation means a user acknowledged the advisory. It does not approve or commit staged records. Review approval and commit remain deterministic routes.

## 7. Provider Boundary

The provider should be abstract:

```ts
type AdvisoryProvider = {
  generateImportReview(input: GenerateImportReviewAdvisoryInput): Promise<AdvisoryArtifact>;
};
```

Possible providers:

1. Cloudflare Workers AI.
2. OpenAI.
3. DeepSeek.
4. Other OpenAI-compatible APIs.
