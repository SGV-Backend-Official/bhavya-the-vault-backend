import { Tournament } from "../../models/tournament.js";

const declareWinnerController = async (req, res) => {
  try {
    const { tournamentId, winnerId } = req.body;

    if (!tournamentId || !winnerId) {
      return res.status(400).json({
        success: false,
        message: "Tournament ID and Winner ID are required",
      });
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    if (tournament.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only host can declare winner",
      });
    }

    if (tournament.winner) {
      return res.status(400).json({
        success: false,
        message: "Winner already declared",
      });
    }
    if (tournament.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Tournament must be completed before declaring winner",
      });
    }

    // winner must be a participant of the tournament
    const playerExists = tournament.players.some(
      (player) => player.player.toString() === winnerId,
    );

    if (!playerExists) {
      return res.status(400).json({
        success: false,
        message: "Winner must be a tournament participant",
      });
    }

    tournament.winner = winnerId;

    await tournament.save();

    return res.status(200).json({
      success: true,
      message: "Winner declared successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error declaring winner:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while declaring winner",
    });
  }
};

export { declareWinnerController };
