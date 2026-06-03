import { Game } from "../../models/Game.js";

const endGame = async (req, res) => {
  try {
    const { gameId } = req.body;
    const { playerResults } = req.body;

    if (
      !playerResults ||
      !Array.isArray(playerResults) ||
      playerResults.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Player results are required and should be a non-empty array.",
      });
    }
    console.log("GAME ID:", req.params.gameId);
    const game = await Game.findById(req.params.gameId);

    console.log("GAME:", game);

    // const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found.",
      });
    }

    if (game.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to end this game.",
      });
    }
    if (game.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Game is already closed.",
      });
    }

    const gamePlayerIds = game.players.map((playerId) => playerId.toString());

    for (const result of playerResults) {
      if (!result.player || typeof result.amount !== "number") {
        return res.status(400).json({
          success: false,
          message:
            "Each player result must include a valid player ID and amount.",
        });
      }

      if (!gamePlayerIds.includes(result.player)) {
        return res.status(400).json({
          success: false,
          message: `Player with ID ${result.player} is not part of this game.`,
        });
      }
    }

    game.playerResults = playerResults;
    game.status = "closed";
    await game.save();

    return res.status(200).json({
      success: true,
      message: "Game ended successfully.",
      data: game,
    });
  } catch (error) {
    console.error("Error ending game:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while ending the game.",
    });
  }
};

export { endGame };
