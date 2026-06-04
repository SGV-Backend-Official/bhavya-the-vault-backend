import { Tournament } from "../../models/tournament.js";

const joinTournamentController = async (req, res) => {
  try {
    const { tournamentCode } = req.body;

    if (!tournamentCode) {
      return res.status(400).json({
        success: false,
        message: "Tournament code is required",
      });
    }

    const tournament = await Tournament.findOne({
      tournamentCode,
    });

    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    if (tournament.status === "active") {
      return res
        .status(400)
        .json({ success: false, message: "Tournament already started" });
    }
    if (tournament.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Tournament has ended",
      });
    }

    const alreadyJoined = tournament.players.some(
      (player) => player.player.toString() === req.user.id,
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this tournament",
      });
    }

    tournament.players.push({
      player: req.user.id,
      isVerified: false,
      rebuyCount: 0,
      isEliminated: false,
      currentStack: tournament.startingStack,
    });

    await tournament.save();

    return res.status(200).json({
      success: true,
      message: "Tournament joined successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error getting tournament", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while joining tournament",
    });
  }
};

export { joinTournamentController };
