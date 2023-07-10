const { GRID_SIZE } = require("./constants");

module.exports = {
  createGameState,
  gameLoop,
  getUpdatedVelocity,
};

function createGameState() {
  return {
    player: {
      pos: {
        // head position
        posX: 3,
        posY: 10,
      },
      velocity: {
        velX: 1,
        velY: 0,
      },
      snakeParts: [
        { x: 1, y: 10 },
        { x: 2, y: 10 },
        { x: 3, y: 10 }, // head
      ],
    },
    food: {
      posX: 7,
      posY: 7,
    },
    gridSize: GRID_SIZE, // number of pixels in game
  };
}

function gameLoop(client, state) {
  if (!state) {
    return;
  }

  const playerOne = state.player;

  // Calculate the new position of the snake's head
  const newHeadPosition = {
    x: playerOne.pos.posX + playerOne.velocity.velX,
    y: playerOne.pos.posY + playerOne.velocity.velY,
  };

  // Check if the snake's head is out of bounds
  if (
    newHeadPosition.x < 0 ||
    newHeadPosition.x >= GRID_SIZE ||
    newHeadPosition.y < 0 ||
    newHeadPosition.y >= GRID_SIZE
  ) {
    return 2;
  }

  // Check if the snake's head collides with its body
  for (let i = 0; i < playerOne.snakeParts.length; i++) {
    const part = playerOne.snakeParts[i];
    if (part.x === newHeadPosition.x && part.y === newHeadPosition.y) {
      return 2;
    }
  }

  // Move the snake's head to the new position
  playerOne.snakeParts.push(newHeadPosition);
  playerOne.pos.posX = newHeadPosition.x;
  playerOne.pos.posY = newHeadPosition.y;

  // Check if the snake's head collides with the food
  if (
    state.food.posX === playerOne.pos.posX &&
    state.food.posY === playerOne.pos.posY
  ) {
    // Grow the snake by not removing the tail
    randomFood(state); // new food
  } else {
    // Remove the tail of the snake
    playerOne.snakeParts.shift();
  }

  return false;
}

function randomFood(state) {
  food = {
    posX: Math.floor(Math.random() * GRID_SIZE),
    posY: Math.floor(Math.random() * GRID_SIZE),
  };

  // check if position is on snake
  for (let cell of state.player.snakeParts) {
    if (cell.x === food.posX && cell.y === food.posY) {
      return randomFood(state);
    }
  }
  state.food = food;
}

function getUpdatedVelocity(keyCode) {
  switch (keyCode) {
    case 37: {
      //turn left
      return { velX: -1, velY: 0 };
    }
    case 38: {
      //turn down
      return { velX: 0, velY: -1 };
    }
    case 39: {
      //turn right
      return { velX: 1, velY: 0 };
    }
    case 40: {
      //turn up
      return { velX: 0, velY: 1 };
    }
  }
}
