const resetMatrix = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
]
const dict = [0, "Red Coin Player", "Yellow Coin Player"]
const StartGame = (req, res) => {
  const db = req.app.get("db");
  db.insert({ ...req.body, gameMatrix: resetMatrix, lastPlayed: 0 }, (err, doc) => {
    if (err) {
      return res.status(400).json({ message: "Some error occured :(" });
    }
    return res.status(200).json({ ...doc, status: "Ready" });
  });
};

//let 1 be red and 2 be yellow
//requires column on request body.
const PlayGame = async (req, res) => {

  if (req.game.winCheck) {
    return res.status(200).json({ message: `Won by ${dict[req.game.lastPlayed]}`, status: "Game Over" });
  }

  let { gameMatrix, lastPlayed } = req.game;
  let currentMove = 2, winCheck = false;
  let { column } = req.body;

  if (lastPlayed === 0 || lastPlayed === 2)
    currentMove = 1;

  //making move
  for (let row = 0; row < 6; row++) {
    if (gameMatrix[row][+column] === 0) {
      gameMatrix[row][+column] = currentMove;
      winCheck = await checkMatrix(gameMatrix, currentMove, row, +column);
      break;
    }
  }

  const db = req.app.get("db");
  db.update({ _id: req.game._id }, { $set: { lastPlayed: currentMove, gameMatrix, winCheck } }, { multi: true }, (err) => {
    if (err) {
      return res.status(400).json({ message: "Some error occured :(" });
    }
    if (winCheck)
      return res.status(200).json({ message: `Won by ${dict[currentMove]}`, status: "Game Over" });
    return res.status(200).json({ message: "Move Made", status: "Playing" });
  });
};

const checkMatrix = (gameMatrix, currentMove, row, col) => {
  let i, j, temp;

  //check row
  for (i = 0, temp = 0; i < 6; i++) {
    if (gameMatrix[i][col] === currentMove) temp++;
  }
  if (temp === 4)
    return true;

  //check column
  for (j = 0, temp = 0; j < 7; j++) {
    if (gameMatrix[col][j] === currentMove) temp++;
  }
  if (temp === 4)
    return true;

  //check left diagonal
  for (i = 0, temp = 0; i < 6; i++) {
    if (gameMatrix[i][i] === currentMove) temp++;
  }
  if (temp === 4)
    return true;

  //check right diagonal
  for (i = 0, temp = 0; i < 6; i++) {
    if (gameMatrix[i][5 - i] === currentMove) temp++;
  }
  if (temp === 4)
    return true;

  return false;
}

module.exports = {
  StartGame, PlayGame
};
