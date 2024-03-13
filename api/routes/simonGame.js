const express = require("express");
const router = express.Router();

const firstRoundMoves = 2;
const roundMovesIncrement = 1;

let boardSize = undefined;
let numberOfTiles = undefined;
let roundsNumber = undefined;
let currentRound = undefined;
let roundMoves = [];
let currentRoundMoves = [];

function endGame() {
  boardSize = undefined;
  numberOfTiles = undefined;
  roundsNumber = undefined;
  currentRound = undefined;
  roundMoves = [];
  currentRoundMoves = [];
}

function generateRound() {
  currentRoundMoves = [];
  if (currentRound === 1) {
    for (let i = 0; i < firstRoundMoves; i++) {
      const move = Math.floor(numberOfTiles * Math.random());
      roundMoves.push(move);
    }
  } else {
    for (let i = 0; i < roundMovesIncrement; i++) {
      const move = Math.floor(numberOfTiles * Math.random());
      roundMoves.push(move);
    }
  }
  console.log(roundMoves);
  currentRoundMoves = [...roundMoves];
  return {
    roundMoves: roundMoves,
  };
}

router.post("/start", (req, res) => {
  const _boardSize = Number(req.body.boardSize);
  const _roundsNumber = Number(req.body.roundsNumber);

  try {
    if (_boardSize <= 1 || typeof _boardSize !== "number") {
      throw new Error("Board size has to be greater than 1.");
    }
    boardSize = _boardSize;
    roundsNumber = _roundsNumber;
    numberOfTiles = boardSize * boardSize;
    currentRound = 1;
    const newRound = generateRound();

    res
      .status(200)
      .json({ boardSize: boardSize, roundMoves: newRound.roundMoves });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/checkMatch", (req, res) => {
  const tile = Number(req.body.index);
  console.log(tile, currentRound, roundsNumber);
  try {
    if (currentRoundMoves[0] !== tile) {
      throw new Error("Wrong tile");
    }
    currentRoundMoves.shift();
    if (currentRoundMoves.length === 0) {
      if (currentRound >= roundsNumber) {
        endGame();
        res.status(200).json({ status: 2 }); // you won
        return;
      }

      currentRound++;
      const newRound = generateRound();
      res.status(200).json({
        status: 1,
        boardSize: boardSize,
        roundMoves: newRound.roundMoves,
      }); // next round
      return;
    }
    res.status(200).json({ status: 0 }); // continue round
  } catch (err) {
    endGame();
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
