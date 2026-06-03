import { Game } from "../../models/Game.js";

const getClosedGames = async (req, res) => {
  try {
    const games = await Game.find({
      createdBy: req.user.id,
      status: "closed",
    })
      .sort({ createdAt: -1 })
      .populate("players", "fullName email profilePic");

    return res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the closed games",
    });
  }
};

export { getClosedGames };
