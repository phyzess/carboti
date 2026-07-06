import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { I18nProvider } from "./i18n";
import { router } from "./router";
import { applyInitialTheme, ThemeProvider } from "./theme";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

applyInitialTheme();

createRoot(root).render(
  <StrictMode>
    <I18nProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </I18nProvider>
  </StrictMode>,
);
