import { Tournament } from "../../models/tournament.js";

const endTournamentController = async (req, res) => {
  try {
    const { tournamentId } = req.body;

    if (!tournamentId) {
      return res.status(400).json({
        success: false,
        message: "Tournament ID is required",
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
        message: "Only host can end tournament",
      });
    }

    if (tournament.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Tournament already completed",
      });
    }

    if (tournament.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Tournament is not active",
      });
    }

    tournament.status = "completed";
    tournament.endedAt = new Date();
    tournament.isTimerPaused = false;

    await tournament.save();

    return res.status(200).json({
      success: true,
      message: "Tournament ended successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error ending tournament:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while ending tournament",
    });
  }
};

export { endTournamentController };
