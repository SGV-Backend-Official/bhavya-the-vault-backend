import { Tournament } from "../../models/tournament.js";

const verifyPlayerController = async (req, res) => {
  try {
    const { tournamentId, playerId } = req.body;

    if (!tournamentId || !playerId) {
      return res.status(400).json({
        success: false,
        message: "Tournament ID and Player ID are required",
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
        message: "Only host can verify players",
      });
    }
    // console.log("TOURNAMENT:", tournament);
    // console.log("PLAYERS:", tournament.players);
    const player = tournament.players.find(
      (p) => p.player.toString() === playerId,
    );

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found in tournament",
      });
    }

    if (player.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Player already verified",
      });
    }
    if (tournament.status !== "lobby") {
      return res.status(400).json({
        success: false,
        message: "Cannot verify players after tournament starts",
      });
    }

    player.isVerified = true;

    await tournament.save();

    return res.status(200).json({
      success: true,
      message: "Player verified successfully!",
      data: tournament,
    });
  } catch (error) {
    console.error("Error verifying player:", error);

    return res.status(500).json({
      success: false,
      message: "An error occured while verifying player.",
    });
  }
};

export { verifyPlayerController };
