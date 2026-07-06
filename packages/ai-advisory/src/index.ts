import * as v from "valibot";

export const AdvisoryStatusSchema = v.picklist(["suggested", "confirmed", "dismissed"]);
export const AdvisoryKindSchema = v.picklist(["import_review"]);

export const AdvisoryArtifactSchema = v.object({
  id: v.string(),
  kind: AdvisoryKindSchema,
  status: AdvisoryStatusSchema,
  importJobId: v.string(),
  provider: v.string(),
  model: v.string(),
  promptVersion: v.string(),
  summary: v.string(),
  output: v.unknown(),
  createdAt: v.string(),
  createdBy: v.string(),
  confirmedBy: v.optional(v.string()),
  confirmedAt: v.optional(v.string()),
  dismissedBy: v.optional(v.string()),
  dismissedAt: v.optional(v.string()),
});

export const GenerateImportReviewAdvisoryInputSchema = v.object({
  importJobId: v.string(),
  createdBy: v.string(),
  recordCount: v.number(),
  issueCount: v.number(),
  pendingCount: v.number(),
  approvedCount: v.number(),
  rejectedCount: v.number(),
  committedCount: v.number(),
});

export type AdvisoryStatus = v.InferOutput<typeof AdvisoryStatusSchema>;
export type AdvisoryKind = v.InferOutput<typeof AdvisoryKindSchema>;
export type AdvisoryArtifact = v.InferOutput<typeof AdvisoryArtifactSchema>;
export type GenerateImportReviewAdvisoryInput = v.InferOutput<
  typeof GenerateImportReviewAdvisoryInputSchema
>;

export type AdvisoryProvider = {
  generateImportReview(input: GenerateImportReviewAdvisoryInput): Promise<AdvisoryArtifact>;
};

export function requiresHumanConfirmation(artifact: AdvisoryArtifact): boolean {
  return artifact.status === "suggested";
}

export async function generateLocalImportReviewAdvisory(
  input: GenerateImportReviewAdvisoryInput,
): Promise<AdvisoryArtifact> {
  const now = new Date().toISOString();
  const summary = [
    `${input.recordCount} staged record(s) are available for confirmation.`,
    `${input.issueCount} issue(s) are open.`,
    `${input.pendingCount} pending, ${input.approvedCount} approved, ${input.rejectedCount} rejected, ${input.committedCount} committed.`,
    "This advisory is informational and cannot commit data.",
  ].join(" ");

  return {
    id: crypto.randomUUID(),
    kind: "import_review",
    status: "suggested",
    importJobId: input.importJobId,
    provider: "local",
    model: "deterministic-confirmation-summary",
    promptVersion: "local.import-confirmation.v1",
    summary,
    output: {
      recordCount: input.recordCount,
      issueCount: input.issueCount,
      statusCounts: {
        pending: input.pendingCount,
        approved: input.approvedCount,
        rejected: input.rejectedCount,
        committed: input.committedCount,
      },
      humanGate: "Human confirmation is still required before commit.",
    },
    createdAt: now,
    createdBy: input.createdBy,
  };
}
