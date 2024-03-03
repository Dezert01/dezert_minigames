const express = require('express')
const router = express.Router()


let gameBoard = []
let matchedCounter = 0

function generateBoard(num) {
  if (num < 2) {
    throw new Error('Number of tiles has to be greater than 1.');
  }
  if (num % 2 !== 0) {
    throw new Error('Number of tiles has to be even.');
  }
  const tiles = []
  for (let i = 0; i < num/2; i=i+1) {
    tiles.push(i);
    tiles.push(i);
  }
  return tiles.sort((a, b) => 0.5 - Math.random())
}

function checkMatch(tiles) {
  if (tiles[0] > -1 && tiles[1] > -1 && tiles[0] !== tiles[1]) {
    return gameBoard[tiles[0]] === gameBoard[tiles[1]]
  }
  return false
}

// start game
router.post('/start', (req, res) => {

  const numberOfTiles = req.body.numberOfTiles;

  try {
    gameBoard = generateBoard(numberOfTiles) 
    matchedCounter = 0
    res.status(200).json({
      gameBoard
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

})

// check if tiles match
router.post('/checkMatch', (req, res) => {

  const tiles = req.body.tiles;

  if (tiles.length === 2) {

    const matched = checkMatch(tiles);

    if (matched) {
      matchedCounter++;
    }

    if (matchedCounter === gameBoard.length / 2) {
      res.status(200).json({ status: 2 }); // Game over - Win
    } else if (matched) {
      res.status(200).json({ status: 1 }); // Matched
    } else {
      res.status(200).json({ status: 0 }); // Not matched
    }
  } else {
    res.status(400).json({ message: "Expected two tiles" });
  }

})

module.exports = router