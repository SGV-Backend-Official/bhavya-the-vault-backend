import { generateAccessToken } from "../../utils/generateAccessToken.js";
import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import { generateRefreshToken } from "../../utils/generateRefreshToken.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    //compare pswd
    const isPswdMatch = await bcrypt.compare(password, user.password);
    if (!isPswdMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    //generate token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        preferredCurrency: user.preferredCurrency,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { login };
