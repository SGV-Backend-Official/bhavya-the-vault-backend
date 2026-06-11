import { Tournament } from "../../models/tournament.js";
import { Settlement } from "../../models/settlement.js";
import { RESPONSE_MESSAGES } from "../../constants/responseMessages.js";
import { STATUS_CODES } from "../../constants/statusCodes.js";

const createSettlementController = async (req, res) => {
  try {
    const { tournamentId, settlements } = req.body;

    if (!tournamentId) {
      return errorResponse(
        res,
        "Tournament ID is required",
        null,
        STATUS_CODES.BAD_REQUEST,
      );
    }

    if (!Array.isArray(settlements) || settlements.length === 0) {
      return errorResponse(
        res,
        "Settlement data is required",
        null,
        STATUS_CODES.BAD_REQUEST,
      );
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return errorResponse(
        res,
        RESPONSE_MESSAGES.TOURNAMENT.NOT_FOUND,
        null,
        STATUS_CODES.NOT_FOUND,
      );
    }

    if (tournament.createdBy.toString() !== req.user.id) {
      return errorResponse(
        res,
        "Only host can create settlements",
        null,
        STATUS_CODES.UNAUTHORIZED,
      );
    }

    if (tournament.status !== "completed") {
      return errorResponse(
        res,
        "Tournament must be completed first",
        null,
        STATUS_CODES.BAD_REQUEST,
      );
    }
    if (!tournament.winner) {
      return errorResponse(
        res,
        "Winner must be declared before creating settlements",
        null,
        STATUS_CODES.BAD_REQUEST,
      );
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
    const tournamentPlayerIds = tournament.players
      .filter((player) => player.isActive)
      .map((player) => player.player.toString());

    const settlementDocuments = [];

    for (const item of settlements) {
      const { userId, type, amount } = item;

      if (!userId || !type || amount == null) {
        return errorResponse(
          res,
          "Invalid settlement data",
          null,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      if (!tournamentPlayerIds.includes(userId)) {
        return errorResponse(
          res,
          `Player ${userId} is not part of this tournament`,
          null,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const settlementDoc = {
        tournamentId,
        userId,
        payableAmount: type === "loss" ? amount : 0,
        receivableAmount: type === "profit" ? amount : 0,
        netAmount: type === "profit" ? amount : -amount,
      };

      settlementDocuments.push(settlementDoc);
    }
    const totalProfit = settlements
      .filter((s) => s.type === "profit")
      .reduce((sum, s) => sum + s.amount, 0);

    const totalLoss = settlements
      .filter((s) => s.type === "loss")
      .reduce((sum, s) => sum + s.amount, 0);

    if (totalProfit !== totalLoss) {
      return errorResponse(
        res,
        "Total profit and total loss must be equal",
        null,
        STATUS_CODES.BAD_REQUEST,
      );
    }

    const createdSettlements = await Settlement.insertMany(settlementDocuments);

    return successResponse(
      res,
      RESPONSE_MESSAGES.SETTLEMENT.CREATED,
      createdSettlements,
      STATUS_CODES.SUCCESS,
    );
  } catch (error) {
    console.error("Error creating settlements:", error);
    return errorResponse(
      res,
      "An error occurred while creating settlements",
      error.message,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
    );
  }
};

export { createSettlementController };
