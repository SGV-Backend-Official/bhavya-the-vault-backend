import { request } from "express";
import { Tournament } from "../../models/tournament.js";

const eliminatePlayerController = async (req, res) => {
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

    if (tournament.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Tournament isn't active",
      });
    }

    const playerToEliminate = tournament.players.find(
      (player) => player.player.toString() === playerId,
    );

    if (!playerToEliminate) {
      return res.status(404).json({
        success: false,
        message: "Player not found in tournament",
      });
    }
    if (!playerToEliminate.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Only verified players can be eliminated",
      });
    }

    // console.log("Tournament Host:", tournament.createdBy.toString());
    // console.log("Logged In User:", req.user.id);

    if (tournament.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only host can eliminate players",
      });
    }
    //Prevent host from eliminating himself

    if (tournament.createdBy.toString() === playerId) {
      return res.status(400).json({
        success: false,
        message: "Host can't eliminate themselves",
      });
    }

    tournament.players = tournament.players.filter(
      (player) => player.player.toString() !== playerId,
    );

    await tournament.save();

    return res.status(200).json({
      success: true,
      message: "Player eliminated successfully!",
      data: tournament,
    });
  } catch (error) {
    console.error("Error eliminating player from the tournament", error);

    return res.status(500).json({
      success: false,
      message: "An error occured while eliminating the player",
    });
  }
};

export { eliminatePlayerController };
