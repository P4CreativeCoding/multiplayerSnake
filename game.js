// Game Variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const tileCount = canvas.width / gridSize;
const speed = 7;
let moveCounter1 = 0;
let moveCounter2 = 0;

// First Snake
let snake1 = [{ x: 10, y: 10 }];
let dx1 = 0;
let dy1 = 0;

// Second Snake
let snake2 = [{ x: 15, y: 15 }];
let dx2 = 0;
let dy2 = 0;

// Food
let food = { x: 5, y: 5 }; // Initial position of the food

// Game Loop
// Game Loop
function gameLoop() {
  if (moveCounter1 >= speed) {
    moveCounter1 = 0;
    clearCanvas();
    drawFood();
    moveSnake(snake1, dx1, dy1);
    drawSnake(snake1, "green");
  }

  if (moveCounter2 >= speed) {
    moveCounter2 = 0;
    moveSnake(snake2, dx2, dy2);
    drawSnake(snake2, "blue");
  }

  moveCounter1++;
  moveCounter2++;
  checkCollision();
  requestAnimationFrame(gameLoop);
}

// Clear Canvas
function clearCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Move Snake
function moveSnake(snake, dx, dy) {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Check collision with walls
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    // Snake collided with the wall, stop moving
    console.log("Snake collided with the wall!");
    return;
  }

  // Check self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      // Snake collided with itself, stop moving
      console.log("Snake collided with itself!");
      return;
    }
  }

  // Check collision with the other snake
  const otherSnake = snake === snake1 ? snake2 : snake1;
  for (let i = 0; i < otherSnake.length; i++) {
    if (head.x === otherSnake[i].x && head.y === otherSnake[i].y) {
      // Snake collided with the other snake, stop moving
      console.log("Snake collided with the other snake!");
      return;
    }
  }

  snake.unshift(head);
  snake.pop();
}

// Draw Snake
function drawSnake(snake, color) {
  snake.forEach((segment) => {
    ctx.fillStyle = color;
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

// Draw Food
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Check Collision
function checkCollision() {
  const head1 = snake1[0];
  const head2 = snake2[0];

  // Check collision with walls (Snake 1)
  if (
    head1.x < 0 ||
    head1.x >= tileCount ||
    head1.y < 0 ||
    head1.y >= tileCount
  ) {
    console.log("Snake 1 collided with the wall!");
    return;
  }

  // Check collision with walls (Snake 2)
  if (
    head2.x < 0 ||
    head2.x >= tileCount ||
    head2.y < 0 ||
    head2.y >= tileCount
  ) {
    console.log("Snake 2 collided with the wall!");
    return;
  }

  // Check self-collision (Snake 1)
  for (let i = 1; i < snake1.length; i++) {
    if (head1.x === snake1[i].x && head1.y === snake1[i].y) {
      console.log("Snake 1 collided with itself!");
      return;
    }
  }

  // Check self-collision (Snake 2)
  for (let i = 1; i < snake2.length; i++) {
    if (head2.x === snake2[i].x && head2.y === snake2[i].y) {
      console.log("Snake 2 collided with itself!");
      return;
    }
  }

  // Check collision between snakes
  for (let i = 0; i < snake2.length; i++) {
    if (head1.x === snake2[i].x && head1.y === snake2[i].y) {
      console.log("Snake 1 collided with Snake 2!");
      return;
    }
  }

  for (let i = 0; i < snake1.length; i++) {
    if (head2.x === snake1[i].x && head2.y === snake1[i].y) {
      console.log("Snake 2 collided with Snake 1!");
      return;
    }
  }

  // Check collision with food (Snake 1)
  if (head1.x === food.x && head1.y === food.y) {
    console.log("Snake 1 collected the food!");
    // Increase the length of Snake 1
    const tail1 = { x: head1.x, y: head1.y };
    snake1.unshift(tail1);
    // Generate new food
    generateFood();
  }

  // Check collision with food (Snake 2)
  if (head2.x === food.x && head2.y === food.y) {
    console.log("Snake 2 collected the food!");
    // Increase the length of Snake 2
    const tail2 = { x: head2.x, y: head2.y };
    snake2.unshift(tail2);
    // Generate new food
    generateFood();
  }
}

// Generate Food
function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

// Arrow Key Event Listener (Snake 1)
document.addEventListener("keydown", changeDirectionSnake1);

// Change Direction (Snake 1)
function changeDirectionSnake1(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;

  if (keyPressed === LEFT_KEY && dx1 !== 1) {
    dx1 = -1;
    dy1 = 0;
  }

  if (keyPressed === UP_KEY && dy1 !== 1) {
    dx1 = 0;
    dy1 = -1;
  }

  if (keyPressed === RIGHT_KEY && dx1 !== -1) {
    dx1 = 1;
    dy1 = 0;
  }

  if (keyPressed === DOWN_KEY && dy1 !== -1) {
    dx1 = 0;
    dy1 = 1;
  }
}

// WASD Key Event Listener (Snake 2)
document.addEventListener("keydown", changeDirectionSnake2);

// Change Direction (Snake 2)
function changeDirectionSnake2(event) {
  const A_KEY = 65;
  const D_KEY = 68;
  const W_KEY = 87;
  const S_KEY = 83;

  const keyPressed = event.keyCode;

  if (keyPressed === A_KEY && dx2 !== 1) {
    dx2 = -1;
    dy2 = 0;
  }

  if (keyPressed === W_KEY && dy2 !== 1) {
    dx2 = 0;
    dy2 = -1;
  }

  if (keyPressed === D_KEY && dx2 !== -1) {
    dx2 = 1;
    dy2 = 0;
  }

  if (keyPressed === S_KEY && dy2 !== -1) {
    dx2 = 0;
    dy2 = 1;
  }
}

// Start the Game Loop
gameLoop();
