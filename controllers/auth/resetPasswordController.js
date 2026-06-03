import { User } from "../../models/User.js";
import bcrypt from "bcryptjs";

const resetPassword = async (req, res) => {
  try {
    const { mail, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (!user.isResetOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP verification required before resetting password",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    // Clear OTP and expiry after successful password reset
    user.otp = null;
    user.otpExpiry = null;
    user.isResetOtpVerified = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { resetPassword };
