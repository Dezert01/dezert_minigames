const express = require("express");
const router = express.Router();

const minLength = 5;
const alphabet = "QWEASD";
let gameString = "";

function generateGame(length) {
  let _gameString = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(alphabet.length * Math.random());
    _gameString = _gameString + alphabet[index];
  }
  return _gameString;
}

function checkMatch(char) {
  if (gameString.length === 0) {
    throw new Error("Something went wrong");
  }
  if (gameString[0].toLowerCase() !== char.toLowerCase()) {
    throw new Error(`Character doesn't match`);
  }
  gameString = gameString.slice(1);
  return true;
}

router.post("/start", (req, res) => {
  const _stringLength = Number(req.body.stringLength);

  try {
    if (_stringLength <= minLength || typeof _stringLength !== "number") {
      throw new Error(`Board size has to be greater than ${minLength}.`);
    }
    gameString = generateGame(_stringLength);

    res.status(200).json({ gameString: gameString });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/checkPress", (req, res) => {
  const buttonPressed = String(req.body.buttonPressed);

  try {
    checkMatch(buttonPressed);
    if (gameString.length === 0) {
      res.status(200).json({ status: 1 }); // Game ends
    } else {
      res.status(200).json({ status: 0 }); // Continue
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
