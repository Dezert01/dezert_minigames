const express = require("express");
const router = express.Router();

let boardSize = undefined;
let numberOfTiles = undefined;
let roundsNumber = undefined;

router.post("/start", (req, res) => {
  const _boardSize = req.body.boardSize;
  const _roundsNumber = req.body.rounds;

  try {
    if (_boardSize <= 1 || typeof _boardSize !== "number") {
      throw new Error("Board size has to be greater than 1.");
    }
    boardSize = _boardSize;
    roundsNumber = _roundsNumber;
    numberOfTiles = boardSize * boardSize;

    res.status(200).json({ boardSize });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
