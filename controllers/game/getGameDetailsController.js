import { Game } from "../../models/Game.js";

const getGameDetails = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId).populate(
      "players",
      "fullName email profilePic",
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found.",
      });
    }

    const isHost = game.createdBy.toString() === req.user.id;

    const isParticipant = game.players.some(
      (player) => player._id.toString() === req.user.id,
    );

    if (!isHost && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this game.",
      });
    }

    return res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error("Error fetching game details:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the game details.",
    });
  }
};

export { getGameDetails };
