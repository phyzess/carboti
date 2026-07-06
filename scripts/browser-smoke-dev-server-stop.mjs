import process from "node:process";

export function createBrowserSmokeDevServerStopper(server) {
  let stopping = false;

  return {
    isStopping() {
      return stopping;
    },
    async stopServer() {
      if (server.exitCode !== null || server.signalCode !== null) {
        return;
      }

      stopping = true;
      await signalAndWait(server, "SIGINT", 3_000);
      await signalAndWait(server, "SIGTERM", 2_000);
      await signalAndWait(server, "SIGKILL", 1_000);
    },
  };
}

async function signalAndWait(server, signal, timeoutMs) {
  if (server.exitCode !== null || server.signalCode !== null || !server.pid) {
    return;
  }

  try {
    process.kill(server.pid, signal);
  } catch {
    return;
  }

  const exited = new Promise((resolve) => {
    server.once("exit", resolve);
  });
  await Promise.race([exited, delay(timeoutMs)]);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
