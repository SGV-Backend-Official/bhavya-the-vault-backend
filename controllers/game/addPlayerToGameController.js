import { Game } from "../../models/Game.js";
import { User } from "../../models/User.js";

const addPlayerToGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        message: "Player ID is required.",
      });
    }
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found.",
      });
    }

    if (game.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add players to this game.",
      });
    }

    if (game.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Cannot join a closed game.",
      });
    }

    const player = await User.findById(playerId);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found.",
      });
    }

    const alreadyExists = game.players.some((id) => id.toString() === playerId);

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Player already exists in the game.",
      });
    }

    game.players.push(playerId);

    await game.save();

    const updatedGame = await Game.findById(gameId).populate(
      "players",
      "fullName email profilePic",
    );

    return res.status(200).json({
      success: true,
      message: "Player added to the game successfully.",
      data: updatedGame,
    });
  } catch (error) {
    console.error("Error adding player to game:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the player to the game.",
    });
  }
};

export { addPlayerToGame };
