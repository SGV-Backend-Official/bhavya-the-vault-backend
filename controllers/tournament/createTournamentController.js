import { Tournament } from "../../models/tournament.js";
import { subscriptionMiddleware } from "../../middleware/subscriptionMiddleware.js";

import { generateTournamentCode } from "../../utils/generateTournamentCode.js";

const createTournamentController = async (req, res) => {
  try {
    const {
      gameType,
      startingStack,
      blindInterval,
      buyInAmount,
      tournamentFee,
      numberOfLevels,
      blindLevels,
      rebuyAllowed,
      payoutStructure,
    } = req.body;

    if (
      !gameType ||
      !startingStack ||
      !blindInterval ||
      !buyInAmount ||
      !tournamentFee ||
      !numberOfLevels ||
      !blindLevels ||
      !payoutStructure
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!Array.isArray(blindLevels) || blindLevels.length !== numberOfLevels) {
      return res.status(400).json({
        success: false,
        message: "Levels count does not match the specified number of levels",
      });
    }

    const tournamentCode = generateTournamentCode();
    console.log("Levels received:", blindLevels);

    const tournament = await Tournament.create({
      gameType,
      tournamentCode,
      startingStack,
      blindInterval,
      buyInAmount,
      tournamentFee,

      numberOfLevels,
      blindLevels,

      rebuyAllowed: rebuyAllowed === undefined ? false : rebuyAllowed,

      payoutStructure,
      createdBy: req.user.id,

      players: [
        {
          player: req.user.id,
          isVerified: true,
          rebuyCount: 0,
          isEliminated: false,
          currentStack: startingStack,
        },
      ],
      status: "lobby",
    });

    return res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error creating tournament:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the tournament",
    });
  }
};

export { createTournamentController };
