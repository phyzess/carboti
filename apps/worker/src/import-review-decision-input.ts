import * as v from "valibot";

export const ReviewDecisionInputSchema = v.object({
  note: v.optional(v.string()),
});
