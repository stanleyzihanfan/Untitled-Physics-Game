// =======================
// Console mirroring logic
// =======================
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

// =======================
// UI logic
// =======================
const worldsBtn = document.getElementById("worldsBtn");
const optionsBtn = document.getElementById("optionsBtn");

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

let logsVisible=false;
toggleLogsBtn.addEventListener("click", () => {
  logsVisible=!logsVisible;
  logPanel.style.display = logsVisible ? "flex" : "none";
  console.log("logsVisible: "+logsVisible);
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

// =======================
// Custom resize logic
// =======================
let isResizing = false;
let startX;
let startWidth;

const minWidth = 200;
const maxWidth = 800;

function startResize(e) {
  isResizing = true;
  startX = e.clientX;
  startWidth = logPanel.offsetWidth;
  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
}

function resize(e) {
  if (!isResizing) return;

  const dx = startX - e.clientX;
  let newWidth = startWidth + dx;

  newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
  logPanel.style.width = newWidth + "px";
}

function stopResize() {
  isResizing = false;
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
}

// Attach resize handlers (edges + corners, but horizontal only)
document.querySelectorAll(".resize-handle").forEach(handle => {
  handle.addEventListener("mousedown", startResize);
});
