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

const toggleLogBtn=document.getElementById("toggle-log");
const testBtn=document.getElementById("testBtn");
const logPanel=document.getElementById("log-panel");
toggleLogBtn.addEventListener("click",()=>{
  logPanel.classList.toggle("hidden");
  console.log("Clicked");
});
testBtn.addEventListener("click",()=>{
  console.log("test");
});