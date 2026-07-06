# AI Advisory

Status: draft
Date: 2026-06-27

## 1. 原则

AI 只提供建议，不静默提交业务事实。

```text
AI suggests.
Humans confirm.
Deterministic code commits.
```

## 2. 适合 AI 的场景

1. 解释校验错误。
2. 建议字段映射。
3. 汇总导入问题。
4. 草拟 review notes。
5. 草拟报告。
6. 从杂乱文本中提取候选数据。

## 3. 禁止 AI 做的事

1. 最终计算业务指标。
2. 静默覆盖业务数据。
3. 绕过人工 review。
4. 创建不可追溯的业务数据。
5. 未脱敏保存敏感 prompt。

## 4. 当前基线

已实现：

1. `packages/ai-advisory` 定义 advisory schema、provider contract 和 deterministic local import-review summary generator。
2. `apps/worker/migrations/0005_ai_advisories.sql` 在 D1 中保存 advisory artifacts。
3. Worker 支持 list、generate、confirm、dismiss。
4. React console 在 review guardrails 附近展示 advisory。
5. 生成和人工处理都会写 audit event。

当前 generator 不是模型调用，而是本地 deterministic provider。它用于先验证存储、review、audit 和 UI 边界，再接入 Workers AI、DeepSeek 或其他 provider。

## 5. Artifact 内容

AI 输出保存为 `ai_advisory_artifacts`，应包含：

1. provider。
2. model。
3. prompt template version。
4. redacted input summary。
5. output。
6. created time。
7. actor user id。
8. related import job id。
9. human decision status。

## 6. 人工确认

任何会影响业务数据的 AI 建议都必须在 review UI 中展示，并由人确认。

审计事件：

```text
ai_advisory.generated
ai_advisory.confirmed
ai_advisory.dismissed
```

确认 advisory 不等于批准 staging record，也不等于 commit。review approval 和 commit 仍然走确定性路由。

## 7. Provider 边界

Provider 应抽象成小接口：

```ts
type AdvisoryProvider = {
  generateImportReview(input: GenerateImportReviewAdvisoryInput): Promise<AdvisoryArtifact>;
};
```

可选 provider：

1. Cloudflare Workers AI。
2. OpenAI。
3. DeepSeek。
4. OpenAI-compatible APIs。
