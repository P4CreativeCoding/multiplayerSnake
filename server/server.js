const io = require("socket.io")();
const { createGameState, gameLoop } = require("./game");
const { FRAMERATE } = require("./constants");

io.on("connection", (client) => {
  const state = createGameState();

  startGameInterval(client, state);
});

function startGameInterval(client, state) {
  const intervalID = setInterval(() => {
    const winner = gameLoop(state);

    console.log("interval");
    if (!winner) {
      client.emit("gameState", JSON.stringify(state));
    } else {
      client.emit("gameOver");
      clearInterval(intervalID);
    }
  }, 1000 / FRAMERATE);
}

io.listen(3000);
