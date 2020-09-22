const express = require("express");
const router = express.Router();
const GameController = require("../controllers/gameCtrlr");
const GameMiddleWare = require("../middleware/gameMw");

router.get("/start", GameController.StartGame);

//requires gameId on request body
router.post("/play", GameMiddleWare, GameController.PlayGame);

module.exports = router;