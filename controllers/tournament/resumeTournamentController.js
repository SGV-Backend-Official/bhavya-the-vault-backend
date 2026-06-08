import { Tournament } from "../../models/tournament.js";

const resumeTournamentController = async (req, res) => {
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
        message: "Only host can resume timer",
      });
    }

    if (tournament.status !== "active") {
      return res.status(400).json({
        succrss: false,
        message: "Tournament is not active",
      });
    }

    if (!tournament.isTimerPaused) {
      return res.status(400).json({
        success: false,
        message: "Timer is already running",
      });
    }

    tournament.isTimerPaused = false;

    await tournament.save();

    return res.status(200).json({
      success: true,
      message: "Blind timer resumed successfully!",
      data: tournament,
    });
  } catch (error) {
    console.error("Resume Tournament Error", error);

    return res.status(500).json({
      success: false,
      message: "An error occured while resuming timer",
    });
  }
};

export { resumeTournamentController };
