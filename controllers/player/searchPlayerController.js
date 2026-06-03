import { User } from "../../models/User.js";

const searchPlayer = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const players = await User.find({
      email: {
        $regex: email,
        $options: "i", // no need to write full email, just part of it, case-insensitive
      },
    })
      .select("fullName email preferredCurrency")
      .limit(20); // Limit results to 20

    return res.status(200).json({
      success: true,
      count: players.length,
      data: players,
    });
  } catch (error) {
    console.error("Error searching for players:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { searchPlayer };
