const worldsBtn = document.getElementById("worldsBtn");
const optionsBtn = document.getElementById("optionsBtn");
const logBuffer = [];

function addLog(type, args) {
  const message = `[${type.toUpperCase()}] ${args.map(String).join(" ")}`;
  logBuffer.push(message);

  const output = document.getElementById("log-output");
  if (!output) return;

  const isAtBottom =
    output.scrollTop + output.clientHeight >= output.scrollHeight - 5;

  output.textContent += message + "\n";

  if (isAtBottom) {
    output.scrollTop = output.scrollHeight;
  }
}


// Preserve original console functions
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

console.log = (...args) => {
  originalLog(...args);
  addLog("log", args);
};

console.warn = (...args) => {
  originalWarn(...args);
  addLog("warn", args);
};

console.error = (...args) => {
  originalError(...args);
  addLog("error", args);
};

worldsBtn.addEventListener("click", () => {
  console.log("Worlds menu (not implemented yet)");
  // Later: switch to world selection screen
});

optionsBtn.addEventListener("click", () => {
  console.log("Options menu (not implemented yet)");
  // Later: switch to options screen
});

const toggleLogsBtn = document.getElementById("toggleLogsBtn");
const logPanel = document.getElementById("log-panel");
const downloadLogsBtn = document.getElementById("downloadLogsBtn");

toggleLogsBtn.addEventListener("click", () => {
  logPanel.hidden = !logPanel.hidden;
});

downloadLogsBtn.addEventListener("click", () => {
  const blob = new Blob([logBuffer.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "game_logs.txt";
  a.click();

  URL.revokeObjectURL(url);
});
