import { Game } from "../../models/Game.js";

const getMyGames = async (req, res) => {
  try {
    const games = await Game.find({
      status: "active",
      $or: [{ createdBy: req.user.id }, { players: req.user.id }],
    })
      .sort({ createdAt: -1 })
      .populate("players", "fullName email profilePic");

    return res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the games",
    });
  }
};

export { getMyGames };
