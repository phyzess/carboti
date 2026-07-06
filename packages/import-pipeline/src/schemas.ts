import * as v from "valibot";

export const ImportJobStatusSchema = v.picklist([
  "queued",
  "processing",
  "needs_review",
  "approved",
  "committed",
  "failed",
  "voided",
]);

export const ImportFailureClassSchema = v.picklist([
  "adapter_missing",
  "commit_conflict",
  "duplicate_source",
  "duplicate_target",
  "infrastructure",
  "parse",
  "processing",
  "queue_dispatch",
  "source_missing",
  "unsupported_source",
  "validation",
]);

export const ReviewIssueSeveritySchema = v.picklist(["info", "warning", "error"]);
export const ReviewRecordDecisionActionSchema = v.picklist(["approve", "reject"]);
export const ReviewDecisionActionSchema = v.picklist(["approve", "reject", "void"]);
export const ConfirmationRecordDecisionActionSchema = v.picklist(["confirm", "exclude"]);
export const StagedRecordStatusSchema = v.picklist([
  "pending",
  "approved",
  "rejected",
  "committed",
]);

export type ImportJobStatus = v.InferOutput<typeof ImportJobStatusSchema>;
export type ImportFailureClass = v.InferOutput<typeof ImportFailureClassSchema>;
export type ReviewIssueSeverity = v.InferOutput<typeof ReviewIssueSeveritySchema>;
export type ReviewRecordDecisionAction = v.InferOutput<typeof ReviewRecordDecisionActionSchema>;
export type ReviewDecisionAction = v.InferOutput<typeof ReviewDecisionActionSchema>;
export type ConfirmationRecordDecisionAction = v.InferOutput<
  typeof ConfirmationRecordDecisionActionSchema
>;
export type StagedRecordStatus = v.InferOutput<typeof StagedRecordStatusSchema>;
export type ConfirmationRecordStatus = "pending" | "confirmed" | "excluded" | "committed";
