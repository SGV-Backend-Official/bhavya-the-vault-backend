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
      .populate("winner", "fullName email profilePic")
      .populate("players.player", "fullName email profilePic");

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    let duration = null;

    if (tournament.startedAt && tournament.endedAt) {
      const durationMs = tournament.endedAt - tournament.startedAt;

      const totalMinutes = Math.floor(durationMs / 60000);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      duration = {
        hours,
        minutes,
        display: `${hours}h ${minutes}m`,
      };
    }

    let winnerPlayer = null;

    if (tournament.winner) {
      winnerPlayer = tournament.players.find(
        (player) =>
          player.player._id.toString() === tournament.winner._id.toString(),
      );
    }

    const winnerRebuys = winnerPlayer ? winnerPlayer.rebuyCount : 0;

    let winnerWinnings = 0;
    if (
      tournament.winner &&
      tournament.payoutStructure === "winner_takes_all"
    ) {
      winnerWinnings = tournament.totalPrizePool || 0;
    }

    if (tournament.winner && tournament.payoutStructure === "top_3") {
      const winnerSettlement = tournament.settlements.find(
        (settlement) =>
          settlement.player.toString() === tournament.winner._id.toString(),
      );

      winnerWinnings = winnerSettlement ? winnerSettlement.amount : 0;
    }

    const tournamentSummary = {
      winnerName: tournament.winner?.fullName || null,
      totalWinnings: winnerWinnings,
      duration,
      reubuys: winnerRebuys,
    };

    return res.status(200).json({
      success: true,
      data: { tournament, tournamentSummary },
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
