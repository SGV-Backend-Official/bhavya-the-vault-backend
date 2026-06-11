import { User } from "../../models/User.js";
import { generateOTP } from "../../utils/generateOTP.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { verifyEmailTemplate } from "../../templates/verifyEmailTemplate.js";

import { EMAIL_SUBJECTS } from "../../constants/emailSubjects.js";

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });
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
    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    const html = verifyEmailTemplate({
      name: user.fullName,
      otp,
    });

    await sendEmail({
      to: user.email,
      subject: EMAIL_SUBJECTS.VERIFY_EMAIL,
      html,
    });

    return res
      .status(200)
      .json({ success: true, message: "OTP resent to email" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { resendOtp };
