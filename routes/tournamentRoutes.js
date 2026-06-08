import { Router } from "express";
const router = Router();

import { authMiddleware } from "../middleware/authMiddleware.js";
import { subscriptionMiddleware } from "../middleware/subscriptionMiddleware.js";

import { createTournamentController } from "../controllers/tournament/createTournamentController.js";

import { joinTournamentController } from "../controllers/tournament/joinTournamentController.js";

import { verifyPlayerController } from "../controllers/tournament/verifyPlayerController.js";

import { startTournamentController } from "../controllers/tournament/startTournamentController.js";

import { eliminatePlayerController } from "../controllers/tournament/eliminatePlayerController.js";

import { endTournamentController } from "../controllers/tournament/endTournamentController.js";

import { declareWinnerController } from "../controllers/tournament/declareWinnerController.js";

import { getTournamentDetailsController } from "../controllers/tournament/getTournamentDetailsController.js";

import { pauseTournamentController } from "../controllers/tournament/pauseTournamentController.js";
import { resumeTournamentController } from "../controllers/tournament/resumeTournamentController.js";

// Create a new tournament
router.post(
  "/create",
  authMiddleware,
  subscriptionMiddleware,
  createTournamentController,
);

//join a tournament
router.post("/join", authMiddleware, joinTournamentController);

// verify a player in the tournament
router.patch("/verify-player", authMiddleware, verifyPlayerController);

// start a tournament
router.patch("/start", authMiddleware, startTournamentController);

// eliminate a player from the tournament

router.patch("/eliminate-player", authMiddleware, eliminatePlayerController);

// end tournament

router.patch("/end", authMiddleware, endTournamentController);

// declare winner
router.patch("/declare-winner", authMiddleware, declareWinnerController);

// details for a tournament

router.get(
  "/details/:tournamentId",
  authMiddleware,
  getTournamentDetailsController,
);

// pause blind timer

router.patch(
  "/pause",
  authMiddleware,
  subscriptionMiddleware,
  pauseTournamentController,
);
router.patch(
  "/resume",
  authMiddleware,
  subscriptionMiddleware,
  resumeTournamentController,
);

export { router as tournamentRoutes };
