const BACKGROUND = "#f0e8e0";

const gameScreen = document.getElementById("gameScreen");

let canvas, ctx;

function init() {
  // initialisation
  canvas = document.getElementById("canvas");
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
