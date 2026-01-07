const screens = {
  main: document.getElementById("main-menu"),
  saves: document.getElementById("save-select"),
  options: document.getElementById("options")
};

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

function hideAllScreens() {
  Object.values(screens).forEach(s => s.classList.remove("active"));
}

function goToMainMenu() {
  canvas.style.display = "none";
  hideAllScreens();
  screens.main.classList.add("active");
}

function goToSaveSelect() {
  hideAllScreens();
  screens.saves.classList.add("active");
}

function goToOptions() {
  hideAllScreens();
  screens.options.classList.add("active");
}

function startGame() {
  hideAllScreens();
  canvas.style.display = "block";
  resizeCanvas();
  startRenderLoop();
}

/* ---------- Rendering Placeholder ---------- */

let running = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

function startRenderLoop() {
  running = true;
  requestAnimationFrame(render);
}

function render(time) {
  if (!running) return;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Placeholder visual
  ctx.fillStyle = "#0f0";
  ctx.font = "20px monospace";
  ctx.fillText("Game running...", 40, 60);
  ctx.fillText("Rendering + loop OK", 40, 90);

  requestAnimationFrame(render);
}
