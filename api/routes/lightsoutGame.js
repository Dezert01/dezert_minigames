const express = require('express')
const router = express.Router()

let gameBoard = []
function generateBoard(boardSize) {
  
  if (!(boardSize === 5 || boardSize === 9)) {
    throw new Error('Board size has to be 5 or 9');
  }
  const tileNum = boardSize * boardSize
  const puzzle = new Array(tileNum).fill(false);

  for (let i = 0; i < tileNum; i++) {
    if (Math.random() < 0.5) {
      puzzle[i] = !puzzle[i];
      if (i >= boardSize) {puzzle[i-boardSize] = !puzzle[i-boardSize]};
      if (i % boardSize !== 0) {puzzle[i-1] = !puzzle[i-1]};
      if (i % boardSize !== boardSize-1) {puzzle[i+1] = !puzzle[i+1]};
      if (i < tileNum - boardSize) {puzzle[i+boardSize] = !puzzle[i+boardSize]};
    }
  }
  return puzzle;
}

function isSolvable(initialState) {
  let state = initialState;
  let parity = 0;
  let gridWidth = Math.sqrt(state.length);
  let row = 0; 
  let blankRow = 0; 

  for (let i = 0; i < state.length; i++) {
    if (i % gridWidth === 0) {
      row++;
    }
    if (state[i] === false) { 
      blankRow = row; 
      continue;
    }
    for (let j = i + 1; j < state.length; j++) {
      if (state[i] > state[j] && state[j] !== false) {
        parity++;
      }
    }
  }

  if (gridWidth % 2 === 0) { 
    if (blankRow % 2 === 0) { 
      return parity % 2 === 0;
    } else { 
      return parity % 2 !== 0;
    }
  } else {
    return parity % 2 === 0;
  }
}

function swapTile(index) {
  gameBoard[index] = !gameBoard[index]
}

function checkTile(index, boardSize) {
  swapTile(index);
  switch (true) {
    case index == 0:
      swapTile(index + 1);
      swapTile(index + boardSize);
      break;
    case index == boardSize - 1:
      swapTile(index - 1);
      swapTile(index + boardSize);
      break;
    case index == gameBoard.length - boardSize:
      swapTile(index + 1);
      swapTile(index - boardSize);
      break;
    case index == gameBoard.length - 1:
      swapTile(index - 1);
      swapTile(index - boardSize);
      break;
    case index < boardSize: 
      swapTile(index + 1);
      swapTile(index - 1);
      swapTile(index + boardSize);
      break;
    case index > gameBoard.length - 1 - boardSize:
      swapTile(index + 1);
      swapTile(index - 1);
      swapTile(index - boardSize);
      break;
    case index % boardSize == 0:
      swapTile(index + boardSize);
      swapTile(index - boardSize);
      swapTile(index + 1);
      break;
    case index % boardSize == boardSize - 1:
      swapTile(index + boardSize);
      swapTile(index - boardSize);
      swapTile(index - 1);
      break;
    default:
      swapTile(index + boardSize);
      swapTile(index - boardSize);
      swapTile(index - 1);
      swapTile(index + 1);
      break;
  }
}

function checkGameOver() {
  return gameBoard.findIndex(el => el === false)
}

// start game
router.post('/start', (req, res) => {

  const boardSize = req.body.boardSize;

  try {
    gameBoard = generateBoard(boardSize)
    while (!isSolvable(gameBoard)) {
      gameBoard = generateBoard(boardSize)
    }
    res.status(200).json({ gameBoard })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

})

// check tile
router.post('/checkTile', (req, res) => {
  const index = req.body.index;
  const boardSize = req.body.boardSize;

  try {
    checkTile(index, boardSize);
    if (checkGameOver() === -1) {
      res.status(200).json({ status: 1 }); // Game over - Win
    } else {
      res.status(200).json({ gameBoard: gameBoard }); // Game still running
    }

  } catch(err) {
    res.status(400).json({ message: err.message })
  }
})



module.exports = router