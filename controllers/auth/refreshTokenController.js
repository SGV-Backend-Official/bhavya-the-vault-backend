import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../utils/generateAccessToken.js";

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (error, decoded) => {
        if (error) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(decoded.id);
        return res.status(200).json({
          success: true,
          message: "Access token refreshed successfully",
          accessToken: newAccessToken,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { refreshToken };
