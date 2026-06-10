import { Tournament } from "../../models/tournament.js";

const startTournamentController = async (req, res) => {
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
        message: "Only host can start tournament",
      });
    }

    if (tournament.status !== "lobby") {
      return res.status(400).json({
        success: false,
        message: "Tournament already started or completed",
      });
    }

    const verifiedPlayers = tournament.players.filter(
      (player) => player.isVerified,
    );

    if (verifiedPlayers.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 verified players are required to start tournament",
      });
    }
    tournament.players.forEach((player) => {
      if (player.isVerified) {
        player.isActive = true;
      }
    });

    tournament.status = "active";
    tournament.startedAt = new Date();
    tournament.currentLevel = 1;
    tournament.isTimerPaused = false;

    await tournament.save();

    return res.status(200).json({
      success: true,
      message: "Tournament started successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error starting tournament:", error);

    return res.status(500).json({
      success: false,
      message: "An error occured while starting tournament",
    });
  }
};

export { startTournamentController };
