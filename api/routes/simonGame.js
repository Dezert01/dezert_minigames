const express = require("express");
const router = express.Router();

const firstRoundMoves = 2;
const roundMovesIncrement = 1;

let boardSize = undefined;
let numberOfTiles = undefined;
let roundsNumber = undefined;
let currentRound = undefined;
let roundMoves = [];

function generateRound() {
  if (currentRound >= roundsNumber) {
    return {
      isOver: true,
      roundMoves: [],
    };
  }

  roundMoves = [];
  for (
    let i = 0;
    i < currentRound * roundMovesIncrement + firstRoundMoves;
    i++
  ) {
    const move = Math.floor(numberOfTiles * Math.random());
    roundMoves.push(move);
  }
  console.log(roundMoves);
  currentRound++;
  return {
    isOver: false,
    roundMoves: roundMoves,
  };
}

router.post("/start", (req, res) => {
  const _boardSize = Number(req.body.boardSize);
  const _roundsNumber = Number(req.body.rounds);

  try {
    if (_boardSize <= 1 || typeof _boardSize !== "number") {
      throw new Error("Board size has to be greater than 1.");
    }
    boardSize = _boardSize;
    roundsNumber = _roundsNumber;
    numberOfTiles = boardSize * boardSize;
    currentRound = 0;
    const newRound = generateRound();

    res
      .status(200)
      .json({ boardSize: boardSize, roundMoves: newRound.roundMoves });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
