const maxLogLines = 160;

export function createBrowserSmokeDevServerLog() {
  const serverLog = [];

  return {
    dumpServerLog() {
      if (serverLog.length === 0) {
        return;
      }

      console.error("\nRecent dev server output:");
      for (const line of serverLog) {
        console.error(line);
      }
    },
    rememberLog(chunk) {
      for (const line of chunk.toString("utf8").split(/\r?\n/)) {
        if (!line) continue;
        serverLog.push(line);
        if (serverLog.length > maxLogLines) {
          serverLog.shift();
        }
      }
    },
  };
}
