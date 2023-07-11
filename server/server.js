const io = require("socket.io")();
const { initGame, gameLoop, getUpdatedVelocity } = require("./game.js");
const { FRAME_RATE } = require("./constants.js");
const { makeid } = require("./utils.js");

const state = {};
const clientRooms = {};

io.on("connection", (client) => {
  client.emit("init", { data: "test" });

  client.on("keydown", handleKeydown);
  client.on("newGame", handleNewGame);
  client.on("joinGame", handleJoinGame);

  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id];

    if (!roomName) {
      return;
    }

    try {
      keyCode = parseInt(keyCode);
    } catch (e) {
      console.error(e);
      return;
    }

    let velocity = getUpdatedVelocity(keyCode);

    if (velocity) {
      state[roomName].players[client.number - 1].velocity = velocity;
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

  function handleJoinGame(gameCode) {
    const room = io.sockets.adapter.rooms[gameCode];

    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }

    if (numClients === 0) {
      // no room with 1 player found
      client.emit("unknownGame");
      return;
    } else if (numClients > 1) {
      // only 2 players per room
      client.emit("fullRoom");
      return;
    }

    clientRooms[client.id] = gameCode;

    client.join(gameCode);
    client.number = 2;
    client.emit("init");

    startGameInterval(gameCode); // start when second player joins
  }
});

function startGameInterval(roomName) {
  const intervalID = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      emitGameState(roomName, state[roomName]);
      // client.emit("gameState", JSON.stringify(state));
    } else {
      emitGameState(roomName, winner);
      state[roomName] = null;
      // client.emit("gameOver");
      clearInterval(intervalID);
    }
  }, 2000 / FRAME_RATE);
}

function emitGameState(roomName, state) {
  io.sockets.in(roomName).emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomName, winner) {
  io.sockets.in(room).emit("gameOver", { winner });
}

io.listen(8080);
