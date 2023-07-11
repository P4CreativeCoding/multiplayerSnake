describe("handleGameOver_function", () => {
  const io = require("socket.io")();

  // Tests that function returns if game is not active
  it("test_game_not_active", () => {
    gameActive = false;
    const spy = jest.spyOn(window, "alert");
    handleGameOver({ winner: 1 });
    expect(spy).not.toHaveBeenCalled();
    expect(gameActive).toBe(false);
  });

  // Tests that alert message is displayed for player win
  it("test_player_wins", () => {
    gameActive = true;
    playerNumber = 1;
    const spy = jest.spyOn(window, "alert");
    handleGameOver({ winner: 1 });
    expect(spy).toHaveBeenCalledWith("You won! :D");
    expect(gameActive).toBe(false);
  });

  // Tests that alert message is displayed for player loss
  it("test_player_loses", () => {
    gameActive = true;
    playerNumber = 2;
    const spy = jest.spyOn(window, "alert");
    handleGameOver({ winner: 1 });
    expect(spy).toHaveBeenCalledWith("You lost :(");
    expect(gameActive).toBe(false);
  });

  // Tests that reset function is called after game is over
  it("test_reset_called", () => {
    gameActive = true;
    playerNumber = 1;
    const spy = jest.spyOn(window, "reset");
    handleGameOver({ winner: 1 });
    expect(spy).toHaveBeenCalled();
  });

  // Tests that player number is compared to winner
  it("test_player_number_compared", () => {
    gameActive = true;
    playerNumber = 1;
    const spy = jest.spyOn(window, "alert");
    handleGameOver({ winner: 2 });
    expect(spy).toHaveBeenCalledWith("You lost :(");
    expect(gameActive).toBe(false);
  });

  // Tests that game is not active after game is over
  it("test_game_not_active_after_game_over", () => {
    gameActive = true;
    playerNumber = 1;
    handleGameOver({ winner: 1 });
    expect(gameActive).toBe(false);
  });
});
