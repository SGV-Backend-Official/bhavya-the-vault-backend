import { Router } from "express";
const router = Router();

import { authMiddleware } from "../middleware/authMiddleware.js";

import { createGame } from "../controllers/game/createGameController.js";

import { createGameValidation } from "../validators/gameValidators.js";
import { getMyGames } from "../controllers/game/getMyGamesController.js";
import { endGame } from "../controllers/game/endGameController.js";
import { getClosedGames } from "../controllers/game/getClosedGamesController.js";
import { addPlayerToGame } from "../controllers/game/addPlayerToGameController.js";
import { getGameDetails } from "../controllers/game/getGameDetailsController.js";

router.post("/create", authMiddleware, createGameValidation, createGame);
router.get("/my-games", authMiddleware, getMyGames);
router.patch("/:gameId/end", authMiddleware, endGame);
router.get("/closed-games", authMiddleware, getClosedGames);
router.patch("/:gameId/add-player", authMiddleware, addPlayerToGame);
router.get("/:gameId", authMiddleware, getGameDetails);

export { router as gameRoutes };
