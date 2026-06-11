import { User } from "../../models/User.js";
import { generateOTP } from "../../utils/generateOTP.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { resetPasswordTemplate } from "../../templates/resetPasswordTemplate.js";

import { EMAIL_SUBJECTS } from "../../constants/emailSubjects.js";

const resendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const html = resetPasswordTemplate({
      name: user.fullName,
      otp,
    });

    await sendEmail({
      to: user.email,
      subject: EMAIL_SUBJECTS.RESET_PASSWORD,
      html,
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent to email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { resendResetOtp };
