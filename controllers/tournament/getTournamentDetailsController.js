import { Tournament } from "../../models/tournament.js";

const getTournamentDetailsController = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    if (!tournamentId) {
      return res.status(400).json({
        success: false,
        message: "Tournament ID is required",
      });
    }

    const tournament = await Tournament.findById(tournamentId)
      .populate("createdBy", "fullName email")
      .populate("winner", "fullName email")
      .populate("players.player", "fullName email");

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    console.error("Error fetching tournament details:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching tournament details",
    });
  }
};

export { getTournamentDetailsController };
