import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getRecentPlayers } from "../controllers/player/getRecentPlayersController.js";
import { searchPlayer } from "../controllers/player/searchPlayerController.js";

const router = Router();

router.get("/recent-players", authMiddleware, getRecentPlayers);
router.get("/search", authMiddleware, searchPlayer);

export { router as playerRoutes };
