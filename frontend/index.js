const socket = io("http://localhost:8080");

socket.on("init", handleInit);
socket.on("gameState", handleGamestate);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownGame", handleUnknownGame);
socket.on("fullRoom", handleFullRoom);

const BACKGROUND = " #1c0e22";
const FOOD_COLOUR = "#ffffffff";
const SNAKE_COLOUR = "#01cfc2";

const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("startScreen");
const newGameBtn = document.getElementById("newGameBtn");
const joinGameBtn = document.getElementById("joinGameBtn");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");

newGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", joinGame);

let canvas, ctx;
let playerNumber;
let gameActive = false;

function newGame() {
  socket.emit("newGame");
  init();
}

function joinGame() {
  const gameCode = gameCodeInput.value;
  socket.emit("joinGame", gameCode);
  init();
}

function init() {
  // initialisation
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  canvas.width = canvas.height = 600;
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener("keydown", keydown);
  gameActive = true;
}

function keydown(keyEvent) {
  console.log(keyEvent.keyCode);
  socket.emit("keydown", keyEvent.keyCode);
}

function drawGameCanvas(state) {
  // paint bg
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // variables for positioning
  const food = state.food;
  const gridsize = state.gridSize; // game pixel number -> 20
  const size = canvas.width / gridsize; // game pixel size

  // paint food
  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.posX * size, food.posY * size, size, size);

  // paint players
  drawSnake(state.players[0], size, SNAKE_COLOUR);
  drawSnake(state.players[1], size, "red");
}

function drawSnake(playerState, size, colour) {
  const snake = playerState.snakeParts;

  ctx.fillStyle = colour;

  // paint every segment of snake
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

function handleInit(number) {
  console.log(number);
  playerNumber = number;
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}

function handleGamestate(gameStateData) {
  if (!gameActive) {
    return;
  }
  gameStateData = JSON.parse(gameStateData);
  requestAnimationFrame(() => drawGameCanvas(gameStateData));
}

function handleGameOver(data) {
  if (!gameActive) {
    return;
  }
  if (data.winner === playerNumber) {
    alert("You won! :D");
  } else {
    alert("You lost :(");
  }
  gameActive = false;

  reset();
}

function handleUnknownGame() {
  reset();
  alert("Unknown game code");
}

function handleFullRoom() {
  reset();
  alert("Room is already full");
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = "";
  gameCodeDisplay.innerText = "";
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
