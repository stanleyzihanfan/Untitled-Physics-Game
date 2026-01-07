const screens = {
  main: document.getElementById("main-menu"),
  save: document.getElementById("save-menu"),
  options: document.getElementById("options-menu")
};

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

function showScreen(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  canvas.style.display = "none";

  if (screen) {
    screen.classList.add("active");
  }
}

function startGame() {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  canvas.style.display = "block";

  resizeCanvas();
  initGame();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

// Button wiring
document.getElementById("play-btn").onclick = () => showScreen(screens.save);
document.getElementById("options-btn").onclick = () => showScreen(screens.options);

document.getElementById("create-world-btn").onclick = () => {
  startGame();
};

document.querySelectorAll(".back-btn").forEach(btn => {
  btn.onclick = () => showScreen(screens.main);
});

// Placeholder game loop
function initGame() {
  let lastTime = 0;

  function gameLoop(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

function update(dt) {
  // Simulation queue will live here later
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Placeholder render
  ctx.fillStyle = "white";
  ctx.fillText("Game Running", 20, 30);
}
