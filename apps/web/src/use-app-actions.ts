import { useState } from "react";
import { defaultAuditFilters, type AuditFilters } from "./audit-filters";
import type { AppRoute } from "./app-routes";
import type { NoticeDescriptor } from "./app-notice";
import { errorMessage } from "./app-session";
import { selectedJobDataNeededForRoute } from "./workspace-route-data";

export function useAppActionRunner() {
  const [isBusy, setBusy] = useState(false);
  const [notice, setNotice] = useState<NoticeDescriptor>({ key: "notice.connectWorker" });
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return {
    error,
    isBusy,
    notice,
    runAction,
    setBusy,
    setError,
    setNotice,
  };
}

export function useWorkspaceActions(options: {
  auditFilterDraft: AuditFilters;
  auditFilters: AuditFilters;
  loadAuditPageEvents: (filters: AuditFilters) => Promise<void>;
  loadUserManagement: () => Promise<void>;
  loadWorkspace: (
    preferredJobId?: string,
    options?: {
      loadSelectedJobData?: boolean;
      updateReviewNotice?: boolean;
    },
  ) => Promise<void>;
  route: AppRoute;
  runAction: (action: () => Promise<void>) => Promise<void>;
  setAuditFilterDraft: (filters: AuditFilters) => void;
  setAuditFilters: (filters: AuditFilters) => void;
  setNotice: (notice: NoticeDescriptor) => void;
}) {
  async function handleApplyAuditFilters() {
    await options.runAction(async () => {
      options.setAuditFilters(options.auditFilterDraft);
      await options.loadAuditPageEvents(options.auditFilterDraft);
      options.setNotice({ key: "notice.auditFiltersApplied" });
    });
  }

  async function handleClearAuditFilters() {
    await options.runAction(async () => {
      options.setAuditFilters(defaultAuditFilters);
      options.setAuditFilterDraft(defaultAuditFilters);
      await options.loadAuditPageEvents(defaultAuditFilters);
      options.setNotice({ key: "notice.auditFiltersCleared" });
    });
  }

  async function handleRefreshWorkspace() {
    await options.runAction(async () => {
      await options.loadWorkspace(undefined, {
        loadSelectedJobData: selectedJobDataNeededForRoute(options.route),
        updateReviewNotice: options.route === "reviews",
      });
      if (options.route === "users") {
        await options.loadUserManagement();
      }
      if (options.route === "audit") {
        await options.loadAuditPageEvents(options.auditFilters);
      }
      options.setNotice({ key: "notice.workspaceRefreshed" });
    });
  }

  return {
    handleApplyAuditFilters,
    handleClearAuditFilters,
    handleRefreshWorkspace,
  };
}
