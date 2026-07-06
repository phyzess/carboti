import type { StatusBadgeTone } from "@carboti/ui";

export function statusTone(status: string): StatusBadgeTone {
  if (status === "active") {
    return "active";
  }

  if (
    status === "accepted" ||
    status === "approved" ||
    status === "committed" ||
    status === "confirmed" ||
    status === "done" ||
    status === "sent" ||
    status.includes("succeeded")
  ) {
    return "success";
  }

  if (
    status === "pending" ||
    status === "needs_review" ||
    status === "queued" ||
    status === "processing" ||
    status === "suggested"
  ) {
    return "warning";
  }

  if (
    status === "expired" ||
    status === "rejected" ||
    status === "revoked" ||
    status === "dismissed" ||
    status === "failed" ||
    status.includes("failed")
  ) {
    return "danger";
  }

  return "neutral";
}
