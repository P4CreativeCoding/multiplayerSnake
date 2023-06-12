const BACKGROUND = " #1c0e22";

const gameScreen = document.getElementById("gameScreen");

let canvas, ctx;

function init() {
  // initialisation
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  canvas.width = canvas.height = 600;
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener("keydown", keydown);
}

function keydown(keyEvent) {
  console.log(keyEvent.keyCode);
}

init();
