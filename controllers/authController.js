import { generateAccessToken } from "../../utils/generateAccessToken.js";
import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import { generateRefreshToken } from "../../utils/generateRefreshToken.js";

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

    const html = verifyEmailTemplate({
      name: fullName,
      otp,
    });
    await sendEmail({
      to: email,
      subject: EMAIL_SUBJECTS.VERIFY_EMAIL,
      html,
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

const forgotPassword = async (req, res) => {
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
    return res
      .status(200)
      .json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { signup, login, forgotPassword };
