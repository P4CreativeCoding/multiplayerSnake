const { GRID_SIZE } = require("./constants");

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
};

function initGame() {
  // for initialisation -> generates random food position
  const state = createGameState();
  randomFood(state);

  return state;
}

function createGameState() {
  return {
    players: [
      {
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
      {
        pos: {
          // head position
          posX: 12,
          posY: 15,
        },
        velocity: {
          velX: 1,
          velY: 0,
        },
        snakeParts: [
          { x: 1, y: 15 },
          { x: 2, y: 15 },
          { x: 3, y: 15 }, // head
        ],
      },
    ],
    food: {},
    gridSize: GRID_SIZE, // number of pixels in game
    active: true,
  };
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  const playerOne = state.players[0];
  const playerTwo = state.players[1];

  // Calculate the new position of the snake's head for P1
  const newHeadPositionP1 = {
    x: playerOne.pos.posX + playerOne.velocity.velX,
    y: playerOne.pos.posY + playerOne.velocity.velY,
  };

  // Calculate the new position of the snake's head for P2
  const newHeadPositionP2 = {
    x: playerTwo.pos.posX + playerTwo.velocity.velX,
    y: playerTwo.pos.posY + playerTwo.velocity.velY,
  };

  // Check if the snake's head is out of bounds P1
  if (
    newHeadPositionP1.x < 0 ||
    newHeadPositionP1.x >= GRID_SIZE ||
    newHeadPositionP1.y < 0 ||
    newHeadPositionP1.y >= GRID_SIZE
  ) {
    return 2;
  }

  // Check if the snake's head is out of bounds P2
  if (
    newHeadPositionP2.x < 0 ||
    newHeadPositionP2.x >= GRID_SIZE ||
    newHeadPositionP2.y < 0 ||
    newHeadPositionP2.y >= GRID_SIZE
  ) {
    return 1;
  }

  // Check if the snake's head collides with its body P1
  for (let i = 0; i < playerOne.snakeParts.length; i++) {
    const part = playerOne.snakeParts[i];
    if (part.x === newHeadPositionP1.x && part.y === newHeadPositionP1.y) {
      return 2;
    }
  }
  // Check if the snake's head collides with its body P2
  for (let i = 0; i < playerTwo.snakeParts.length; i++) {
    const part = playerTwo.snakeParts[i];
    if (part.x === newHeadPositionP2.x && part.y === newHeadPositionP2.y) {
      return 1;
    }
  }

  // Move the snake's head to the new position P1
  playerOne.snakeParts.unshift(newHeadPositionP1);
  playerOne.pos.posX = newHeadPositionP1.x;
  playerOne.pos.posY = newHeadPositionP1.y;
  // Move the snake's head to the new position P2
  playerTwo.snakeParts.unshift(newHeadPositionP2);
  playerTwo.pos.posX = newHeadPositionP2.x;
  playerTwo.pos.posY = newHeadPositionP2.y;

  // Check if the snake's head collides with the food P1
  if (
    state.food.posX === playerOne.pos.posX &&
    state.food.posY === playerOne.pos.posY
  ) {
    // Grow the snake by not removing the tail
    randomFood(state); // new food
  } else {
    // Remove the tail of the snake
    playerOne.snakeParts.pop();
  }

  // Check if the snake's head collides with the food P2
  if (
    state.food.posX === playerTwo.pos.posX &&
    state.food.posY === playerTwo.pos.posY
  ) {
    // Grow the snake by not removing the tail
    randomFood(state); // new food
  } else {
    // Remove the tail of the snake
    playerTwo.snakeParts.pop();
  }

  return false;
}

function randomFood(state) {
  let food = {
    posX: Math.floor(Math.random() * GRID_SIZE),
    posY: Math.floor(Math.random() * GRID_SIZE),
  };

  // check if position is on snake 1
  for (let cell of state.players[0].snakeParts) {
    if (cell.x === food.posX && cell.y === food.posY) {
      food = randomFood(state);
      break;
    }
  }
  // check if position is on snake 1
  for (let cell of state.players[1].snakeParts) {
    if (cell.x === food.posX && cell.y === food.posY) {
      food = randomFood(state);
      break;
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
