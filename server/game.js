const { GRIDSIZE } = require("./constants");

module.exports = {
  createGameState,
  gameLoop,
};

function createGameState() {
  // game informations
  return {
    player: {
      pos: {
        // head position
        posX: 3,
        posY: 10,
      },
      speed: {
        speedX: 1,
        speedY: 0,
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
    gridSize: GRIDSIZE, // number of pixels in game
  };
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  //console.log("loop");
  const playerOne = state.player;

  playerOne.pos.posX += playerOne.speed.speedX;
  playerOne.pos.posY += playerOne.speed.speedY;

  // check for walls
  if (
    playerOne.pos.posX < 0 ||
    playerOne.pos.posX > GRIDSIZE ||
    playerOne.pos.posY < 0 ||
    playerOne.pos.posY > GRIDSIZE
  ) {
    return 2; // player 2 wins
  }

  // check for food
  if (
    state.food.posX === playerOne.pos.posX &&
    state.food.posY === playerOne.pos.posY
  ) {
    playerOne.snakeParts.push({ ...playerOne.pos });

    playerOne.pos.posX += playerOne.speed.speedX;
    playerOne.pos.posY += playerOne.speed.speedY;

    generateNewFood();
  }

  if (playerOne.speed.speedX || playerOne.speed.speedY) {
    for (let cell of playerOne.snakeParts) {
      if (cell.x === playerOne.pos.posX && cell.y === playerOne.pos.posY) {
        return 2; // player 2 wins
      }
    }
    // move player
    playerOne.snakeParts.push({ ...playerOne.pos });
    playerOne.snakeParts.shift();
  }

  return false;
}

function generateNewFood() {
  food = {
    posX: Math.floor(Math.random() * GRIDSIZE),
    posY: Math.floor(Math.random() * GRIDSIZE),
  };

  for (let cell of state.player.snakeParts) {
    if (cell.x === foox.posX && cell.y === food.y) {
      return generateNewFood(state);
    }
  }
  state.food = food;
}
