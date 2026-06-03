import { hash } from "bcryptjs";
import { User } from "../../models/User.js";
import { generateOTP } from "../../utils/generateOTP.js";
import { sendEmail } from "../../utils/sendEmail.js";

const signup = async (req, res) => {
  try {
    const { fullName, email, preferredCurrency, password } = req.body;

    //check existing user
    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    // generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    // hash pswd
    const hashedPassword = await hash(password, 10);

    //create user
    const user = await User.create({
      fullName,
      email,
      preferredCurrency,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await sendEmail({
      to: email,
      subject: "Email Verification - The Vault",
      html: `
    <h2>Email Verification</h2>
    <p>Hello ${fullName},</p>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP is valid for 10 minutes.</p>
  `,
    });

    return res.status(201).json({
      message: "Signup successful. OTP sent to email.",
      data: {
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

export { signup };
