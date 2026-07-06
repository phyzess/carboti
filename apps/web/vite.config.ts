import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const workerOrigin =
  process.env.QITU_WORKER_ORIGIN ?? `http://127.0.0.1:${process.env.QITU_WORKER_PORT ?? "8787"}`;
const webPort = Number(process.env.QITU_WEB_PORT ?? "5173");
const uiSource = fileURLToPath(new URL("../../packages/ui/src", import.meta.url));

export default defineConfig({
  plugins: [...tailwindcss()],
  resolve: {
    alias: [
      { find: "@/components", replacement: uiSource },
      { find: "@/hooks", replacement: `${uiSource}/hooks` },
      { find: "@/lib/utils", replacement: `${uiSource}/utils.ts` },
      { find: "@/lib", replacement: uiSource },
    ],
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: Number.isInteger(webPort) ? webPort : 5173,
    proxy: {
      "/health": workerOrigin,
      "/api": workerOrigin,
    },
  },
  build: {
    target: "es2024",
  },
});
