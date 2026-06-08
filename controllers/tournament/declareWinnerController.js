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
    const winnerPlayer = tournament.players.find(
      (player) => player.player.toString() === winnerId,
    );

    if (!playerExists) {
      return res.status(400).json({
        success: false,
        message: "Winner must be a tournament participant",
      });
    }

    tournament.winner = winnerId;
    // tournament.endedAt = new Date();

    await tournament.save();
    // await tournament.populate("winner", "name profilePic");

    // //calculate duration
    // const durationMs = tournament.endedAt - tournament.startedAt;
    // const durationMinutes = Math.floor(durationMs / 60000);
    // const hours = Math.floor(durationMinutes / 60);
    // const minutes = durationMinutes % 60;

    // Get winner's total rebuys
    // const winnerRebuys = playerExists.rebuyCount;

    return res.status(200).json({
      success: true,
      message: "Winner declared successfully",
      data: {
        tournament,
        // winnerSummary: {
        //   name: tournament.winner.name,
        //   profilePic: tournament.winner.profilePic,
        //   // totalWinnings: tournament.totalPrizePool,
        //   duration: { hours, minutes, display: `${hours}h ${minutes}m` },
        //   rebuys: winnerRebuys,
        // },
      },
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
