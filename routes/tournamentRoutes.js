import { Router } from "express";
const router = Router();

import { authMiddleware } from "../middleware/authMiddleware.js";
import { subscriptionMiddleware } from "../middleware/subscriptionMiddleware.js";

import { createTournamentController } from "../controllers/tournament/createTournamentController.js";

import { joinTournamentController } from "../controllers/tournament/joinTournamentController.js";

// Create a new tournament
router.post(
  "/create",
  authMiddleware,
  subscriptionMiddleware,
  createTournamentController,
);

//join a tournament
router.post("/join", authMiddleware, joinTournamentController);

export { router as tournamentRoutes };
