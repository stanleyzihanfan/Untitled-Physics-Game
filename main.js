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
// UIs
// =======================
class MainMenuUI{
    constructor(){
        this.div=document.getElementById("menu-root");
        this.worldsBtn = document.getElementById("worldsBtn");
        this.optionsBtn = document.getElementById("optionsBtn");
    }
    addUI(){
        //Add listeners
        this.worldsBtn.addEventListener("click", () => {
            console.log("Worlds menu (not implemented yet)");
            // Later: switch to world selection screen
        });

        this.optionsBtn.addEventListener("click", () => {
            console.log("Options menu (not implemented yet)");
            // Later: switch to options screen
        });
    }
    removeUI(){
        //Clean up & remove listeners
        this.worldsBtn.removeEventListener("click",() => {
            console.log("Worlds menu (not implemented yet)");
            // Later: switch to world selection screen
        });
        this.optionsBtn.removeEventListener("click", () => {
            console.log("Options menu (not implemented yet)");
            // Later: switch to options screen
        });
    }
}

class LogUI{
    constructor(uiHandler){
        this.div=document.getElementById("log-panel");
        this.uiHandler=uiHandler;
        this.toggleLogsBtn = document.getElementById("toggleLogsBtn");
        this.logPanel = document.getElementById("log-panel");
        this.downloadLogsBtn = document.getElementById("downloadLogsBtn");
    }

    addUI(){
        this.toggleLogsBtn.addEventListener("click", () => {
            this.uiHandler.toggleWindow(this.div);
            console.log("log panel toggled");
        });

        this.downloadLogsBtn.addEventListener("click", () => {
            const blob = new Blob([logBuffer.join("\n")], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("logDownloadURL");
            a.href = url;
            a.download = "game_logs.txt";
            a.click();

            URL.revokeObjectURL(url);
        });
    }
    removeUI(){
        this.toggleLogsBtn.removeEventListener("click", () => {
            this.uiHandler.toggleWindow(this.div);
            console.log("log panel toggled");
        });

        this.downloadLogsBtn.removeEventListener("click", () => {
            const blob = new Blob([logBuffer.join("\n")], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("logDownloadURL");
            a.href = url;
            a.download = "game_logs.txt";
            a.click();

            URL.revokeObjectURL(url);
        });
    }
}

// =======================
// UI Handler
// =======================
class UIHandler{
    constructor(){
        this.uiActive = [];
    }

    /**
     * Adds a window to active UI list and makes it visible. Calls addUI() method of window if exists.
     * @param {*} window div object of window
     */
    addWindow(window){
        this.uiActive.push(window.div.id);
        window.style.display = "flex";
        window.addUI?.();
    }

    /**
     * Removes a window from active UI list and hides it. Calls removeUI() method of window if exists.
     * @param {*} window  div object of window
     */
    removeWindow(window){
        const index = this.uiActive.indexOf(window);
        if (index > -1) {
            this.uiActive.splice(index, 1); // Only splice if the item is found
        }
        window.style.display = "none";
        window.removeUI?.();
    }

    /**
     * Toggles display of window
     * @param {*} window UI object of window to be toggled
     * @returns true if toggled on, false if toggled off
     */
    toggleWindow(window){
        if (this.uiActive.includes(window.div.id)){
            this.removeWindow(window.div);
            return false;
        }else{
            this.addWindow(window.div);
            return true;
        }
    }
}

class divResizeHandler{
    /**
     * Constructor
     * @param {*} div HTML div to be resized
     * @param {*} minW minimum width
     * @param {*} maxW maximum width
     * @param {*} minH minimum height
     * @param {*} maxH maximum height
     */
    constructor(div,minW,maxW,minH,maxH){
        this.div=div;
        this.minW=minW;
        this.maxW=maxW;
        this.minH=minH;
        this.maxH=maxH;
        this.isResizing=false;
        this.startx=null;
        this.starty=null;
        this.startHeight=null;
        this.startWidth=null;
        this.div.addEventListener("mousedown",startResize.bind(this))
    }

    startResize(e) {
        if (!e.target.classlist.contains("resize-handle")) return;
        this.isResizing = true;
        this.startx = e.clientX;
        this.startWidth = this.div.offsetWidth;
        this.starty = e.clientY;
        this.startHeight = this.div.offsetHeight;
        document.addEventListener("mousemove", resize.bind(this));
        document.addEventListener("mouseup", stopResize.bind(this));
    }

    resize(e) {
        if (!isResizing) return;

        const dx = this.startx - e.clientX;
        let newWidth = this.startWidth + dx;
        const dy = this.starty - e.clientY;
        let newHeight = this.startHeight + dy;

        newWidth = Math.max(this.minW, Math.min(this.maxW,this.newWidth));
        newHeight = Math.max(this.minH,Math.min(this.maxH,this.newHeight));
        this.div.style.width = newWidth + "px";
        this.div.style.height= newHeight + "px";
    }

    stopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", resize.bind(this));
        document.removeEventListener("mouseup", stopResize.bind(this));
    }

}

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
