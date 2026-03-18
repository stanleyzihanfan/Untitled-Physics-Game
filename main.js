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

//Handle errors
window.addEventListener('error', function(event) {
    console.log("Uncaught Error: " + event.message + " at " + event.filename + ":" + event.lineno);
});
window.addEventListener('unhandledrejection', function(event) {
    console.log("Unhandled Promise Rejection: " + event.reason);
});


// =======================
// UI logic
// =======================
//UI registration and modification functions
//Dictionary of all register/unregister functions
const uiEvents={};
/**
 * Registers an UI
 * @param {string} name Name of UI element to register
 * @param {Function[][]} param1 2D Array with two list that will run when UI is created and when it is deleted, [[onEnter,onEnter1],[onExit,onExit1]].
 * @param {boolean} [override=false] If the new functions should override all old functions. Default false, will append current functions to original functions.
 */
function registerUI(name,[onEnter,onExit],override=false){
    if (override){
        uiEvents[name]=[onEnter,onExit];
    }else{
        if (Object.hasOwn(uiEvents,name)){
            for (let i=0;i<onEnter.length;i++){
                uiEvents[name][0].push(onEnter[i]);
            }
            for (let i=0;i<onExit.length;i++){
                uiEvents[name][1].push(onExit[i]);
            }
        }else{
            uiEvents[name]=[onEnter,onExit];
        }
    }
}
/**
 * Unregisters UI/UI functions
 * @param {string} name Name of UI element to register
 * @param {Function[][]} param1 2D Array with two lists of functions to delete [[onEnter,onEnter1],[onExit,onExit1]].
 * @param {boolean} override True=delete all functions(ignores param1), False=delete only specified functions
 */
function unregisterUI(name,[onEnter,onExit],override=true){
    if (override){
        uiEvents[name]=[];
    }else{
        for (let i=0;i<onEnter.length;i++){
            let index=uiEvents[name][0].indexOf(onEnter[i]);
            if (index!=-1){
                uiEvents[name][0].splice(index,1);
            }
        }
        for (let i=0;i<onExit.length;i++){
            let index=uiEvents[name][1].indexOf(onExit[i]);
            if (index!=-1){
                uiEvents[name][1].splice(index,1);
            }
        }
    }
}
/**
 * Executes onEnter functions of UI with name
 * @param {string} name Name of UI
 */
function openUI(name){
    for (let i=0;i<uiEvents[name][0].length;i++){
        uiEvents[name][0][i]();
    }
}
/**
 * Executes onExit functions of UI with name
 * @param {string} name Name of UI
 */
function closeUI(name){
    for (let i=0;i<uiEvents[name][1].length;i++){
        uiEvents[name][1][i]();
    }
}

//main menu
/**
 * Main menu worlds button
 */
function mainMenuWorldsBtn(){
    console.log("Worlds menu (not implemented yet)");
}
/**
 * Main menu Options button
 */
function mainMenuOptionsBtn(){
    console.log("Options menu (not implemented yet)");
}
/**
 * Main menu onEnter function
 */
function initMainMenu(){
    document.getElementById("worldsBtn").addEventListener("click",mainMenuWorldsBtn);
    document.getElementById("optionsBtn").addEventListener("click",mainMenuOptionsBtn);
    document.getElementById("menu-root").style.display="inline";
}
/**
 * Main menu onExit function
 */
function stopMainMenu(){
    document.getElementById("worldsBtn").removeEventListener("click",mainMenuWorldsBtn);
    document.getElementById("optionsBtn").removeEventListener("click",mainMenuOptionsBtn);
    document.getElementById("menu-panel").style.display="none";
}

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
    console.log("Generating temporary download URL...");
    const blob = new Blob([logBuffer.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    console.log("URL Generated!");

    const a = document.createElement("a");
    a.href = url;
    a.download = "game_logs.txt";
    a.click();
    console.log("Download started");

    URL.revokeObjectURL(url);
});
registerUI("mainMenu",[[initMainMenu],[stopMainMenu]],false);
openUI("mainMenu");

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
