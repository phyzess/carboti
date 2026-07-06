import { useEffect, useState } from "react";
import {
  defaultAuthForm,
  localDemoPassword,
  localDemoProfiles,
  type AuthFormState,
  type AuthMode,
  type LocalSetupRole,
} from "./app-session";

export function useAuthFormController(options: { localSetupAvailable: boolean }) {
  const { localSetupAvailable } = options;
  const [authForm, setAuthForm] = useState<AuthFormState>(defaultAuthForm);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [setupRole, setSetupRole] = useState<LocalSetupRole>("reviewer");

  useEffect(() => {
    if (!localSetupAvailable && authMode === "setup") {
      setAuthMode("login");
    }
  }, [authMode, localSetupAvailable]);

  function updateAuthForm(patch: Partial<AuthFormState>) {
    setAuthForm((current) => ({ ...current, ...patch }));
  }

  function selectSetupRole(role: LocalSetupRole) {
    const profile = localDemoProfiles[role];
    setSetupRole(role);
    setAuthForm((current) => ({
      ...current,
      displayName: profile.displayName,
      email: profile.email,
      password: current.password || localDemoPassword,
    }));
  }

  function selectAuthMode(mode: AuthMode) {
    if (mode === "setup" && !localSetupAvailable) {
      return;
    }

    setAuthMode(mode);
    if (mode === "setup") {
      const profile = localDemoProfiles[setupRole];
      setAuthForm((current) => ({
        ...current,
        displayName: profile.displayName,
        email: profile.email,
        password: current.password || localDemoPassword,
        resetToken: "",
      }));
    }
  }

  return {
    authForm,
    authMode,
    selectAuthMode,
    selectSetupRole,
    setAuthForm,
    setAuthMode,
    setupRole,
    updateAuthForm,
  };
}
