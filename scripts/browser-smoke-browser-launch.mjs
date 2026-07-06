import process from "node:process";
import { chromium } from "@playwright/test";

export async function launchChromium() {
  try {
    return await chromium.launch({
      headless: process.env.QITU_BROWSER_HEADFUL !== "1",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      [
        "Unable to launch Playwright Chromium.",
        "Run `vp exec playwright install chromium` once on this machine, then retry `vp run smoke:browser`.",
        message,
      ].join("\n"),
    );
  }
}
