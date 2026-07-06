import { useEffect, useState } from "react";
import type { AppRoute } from "./app-routes";
import type { ApiUser } from "./types";

export type ShellOverlayState = {
  closeShellOverlays: () => void;
  openSearch: () => void;
  searchOpen: boolean;
  searchQuery: string;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setUserPanelOpen: (open: boolean) => void;
  toggleUserPanel: () => void;
  userPanelOpen: boolean;
};

export function useShellOverlayState(options: { route: AppRoute; user: ApiUser | null }) {
  const { route, user } = options;
  const [searchOpen, setSearchOpenState] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPanelOpen, setUserPanelOpenState] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k" || !user) return;

      event.preventDefault();
      openSearch();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [user]);

  useEffect(() => {
    setSearchOpenState(false);
    setUserPanelOpenState(false);
  }, [route]);

  function openSearch() {
    setSearchOpenState(true);
    setUserPanelOpenState(false);
  }

  function setSearchOpen(open: boolean) {
    setSearchOpenState(open);
    if (open) setUserPanelOpenState(false);
  }

  function setUserPanelOpen(open: boolean) {
    setUserPanelOpenState(open);
    if (open) setSearchOpenState(false);
  }

  function toggleUserPanel() {
    setUserPanelOpen(!userPanelOpen);
  }

  function closeShellOverlays() {
    setSearchOpenState(false);
    setSearchQuery("");
    setUserPanelOpenState(false);
  }

  return {
    closeShellOverlays,
    openSearch,
    searchOpen,
    searchQuery,
    setSearchOpen,
    setSearchQuery,
    setUserPanelOpen,
    toggleUserPanel,
    userPanelOpen,
  } satisfies ShellOverlayState;
}
