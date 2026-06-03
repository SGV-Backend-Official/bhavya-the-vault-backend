import { Game } from "../../models/Game.js";

const createGame = async (req, res) => {
  try {
    const { gameName, gameType, amount, rake, gameDate, gameTime, players } =
      req.body;

    // console.log("REQ USER:", req.user);
    // console.log("BODY:", req.body);
    // console.log("CREATED BY:", req.user.id);

    const game = await Game.create({
      gameName,
      gameType,
      amount,
      rake,
      gameDate,
      gameTime,
      players,
      createdBy: req.user.id,
    });

    console.log(req.user);
    return res.status(201).json({
      success: true,
      message: "Game created successfully",
      data: game,
    });
  } catch (error) {
    console.error("Error creating game:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the game",
    });
  }
};

export { createGame };
