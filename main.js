const screens = {
  main: document.getElementById("menu-main"),
  saves: document.getElementById("menu-saves"),
  options: document.getElementById("menu-options")
};

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

function showScreen(screenName) {
  for (const key in screens) {
    screens[key].classList.remove("active");
  }
  screens[screenName].classList.add("active");
}

function openSaveSelect() {
  showScreen("saves");
}

function openOptions() {
  showScreen("options");
}

function backToMain() {
  showScreen("main");
}

function createWorld() {
  // Hide menus
  for (const key in screens) {
    screens[key].classList.remove("active");
  }

  // Show canvas
  canvas.style.display = "block";
  resizeCanvas();

  // Placeholder render loop
  startGame();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

function startGame() {
  let t = 0;

  function loop() {
    t += 0.01;

    // Simple placeholder rendering
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Game Running", 20, 40);
    ctx.fillText("Replace this with your renderer", 20, 70);

    // Animated dot, just to prove life
    const x = canvas.width / 2 + Math.cos(t) * 100;
    const y = canvas.height / 2 + Math.sin(t) * 100;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(loop);
  }

  loop();
}
