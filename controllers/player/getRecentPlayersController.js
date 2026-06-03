import { Game } from "../../models/Game.js";
import { User } from "../../models/User.js";

const getRecentPlayers = async (req, res) => {
  try {
    const hostId = req.user.id;

    // Find games created by the logged-in host

    //Testing
    console.log("REQ USER:", req.user);
    console.log("USER ID:", req.user.id);

    const games = await Game.find({
      createdBy: hostId,
    })
      .sort({ createdAt: -1 })
      .select("players");
    console.log("GAMES:", games);

    // Extract player IDs from all the games

    const playerIds = games.flatMap((game) =>
      game.players.map((playerId) => playerId.toString()),
    );
    console.log("PLAYER IDS:", playerIds);

    // Remove duplicate player IDs

    const uniquePlayerIds = [...new Set(playerIds)];
    console.log("UNIQUE IDS:", uniquePlayerIds);

    // Fetch player details

    const players = await User.find({
      _id: { $in: uniquePlayerIds },
      //   isVerified: true,
    }).select("fullName email preferredCurrency");
    console.log("PLAYERS:", players);

    // Preserve original order from uniquePlayerIds

    const orderedPlayers = uniquePlayerIds
      .map((id) => players.find((player) => player._id.toString() === id))
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      count: orderedPlayers.length,
      data: orderedPlayers,
    });
  } catch (error) {
    console.error("Error fetching recent players:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { getRecentPlayers };
