import { Tournament } from "../../models/tournament.js";
import { Settlement } from "../../models/settlement.js";

const createSettlementController = async (req, res) => {
  try {
    const { tournamentId, settlements } = req.body;

    if (!tournament) {
      return res.status(400).json({
        success: false,
        message: "Tournament ID is required",
      });
    }

    if (!Array.isArray(settlements) || settlements.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Settlement data is required",
      });
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        succeess: false,
        message: "Tournament not found",
      });
    }

    if (tournament.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only host can create settlements",
      });
    }

    if (tournament.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Tournament must be completed first",
      });
    }
    if (!tournament.winner) {
      return res.status(400).json({
        success: false,
        message: "Winner must be declared before creating settlements",
      });
    }

    const existingSettlememt = await Settlement.findOne({
      tournamentId,
    });

    if (existingSettlememt) {
      return res.status(400).json({
        success: false,
        message: "Settlements already created for this tournament",
      });
    }
    const tournamentPlayerIds = tournament.players.map((player) =>
      player.player.toString(),
    );

    const settlementDocuments = [];

    for (const item of settlements) {
      const { playerId, type, amount } = item;

      if (!playerId || !type || amount == null) {
        return res.status(400).json({
          success: false,
          message: "Invalid settlement data",
        });
      }

      if (!tournamentPlayerIds.includes(playerId)) {
        return res.status(400).json({
          success: false,
          message: `Player ${playerId} is not part of this tournament`,
        });
      }

      const settlementDoc = {
        tournamntId,
        userId: playerId,
        payableAmount: type === "loss" ? amount : 0,
        receivableAmount: type === "profit" ? amount : 0,
        netAmount: type === "profit" ? amount : -amount,
      };

      settlementDocuments.push(settlementDoc);
    }

    const createdSettlements = await Settlement.insertMany(settlementDocuments);

    return res.status(201).json({
      success: true,
      message: "Settlements created successfully!",
      data: createdSettlements,
    });
  } catch (eroror) {
    console.error("Error creating settlements:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while creating settlements",
    });
  }
};

export { createSettlementController };
