import { User } from "../../models/User.js";

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email, otp });
    console.log("Entered OTP:", otp);
    console.log("DB OTP:", user.otp);
    console.log("User:", user);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { verifyEmail };
