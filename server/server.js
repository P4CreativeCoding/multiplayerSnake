const io = require("socket.io")();
const { initGame, gameLoop, getUpdatedVelocity } = require("./game.js");
const { FRAME_RATE } = require("./constants.js");

const state = {};
const clientRooms = {};

io.on("connection", (client) => {
  client.emit("init", { data: "test" });

  client.on("keydown", handleKeydown);
  client.on("newGame", handleNewGame);

  function handleKeydown(keyCode) {
    try {
      keyCode = parseInt(keyCode);
    } catch (e) {
      console.error(e);
      return;
    }

    let velocity = getUpdatedVelocity(keyCode);

    if (velocity) {
      state.player.velocity = velocity;
    }
  }

  function handleNewGame() {
    let roomName = makeid(5); // room id

    clientRooms[client.id] = roomName;
    client.emit("gameCode", roomName);

    state[roomName] = initGame(); // add room to global state + game initialisation

    client.join(roomName);
    client.number = 1;
    client.emit("init", 1);
  }

  startGameInterval(client, state);
});

function startGameInterval(client, state) {
  const intervalID = setInterval(() => {
    const winner = gameLoop(client, state);

    if (!winner) {
      client.emit("gameState", JSON.stringify(state));
    } else {
      client.emit("gameOver");
      clearInterval(intervalID);
    }
  }, 2000 / FRAME_RATE);
}

io.listen(8080);
