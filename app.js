const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/helloDuck", (req, res) => {
  const oneMinuteAgo = Date.now() - 60 * 1000;

  res.status(200).send("Hello! I'm a duck. 🦆 Qwack!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
