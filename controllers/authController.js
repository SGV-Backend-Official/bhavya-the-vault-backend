import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { verifyEmailTemplate } from "../templates/verifyEmailTemplate.js";
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate.js";
import { EMAIL_SUBJECTS } from "../constants/emailSubjects.js";
import { generateOTP } from "../utils/generateOTP.js";

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, preferredCurrency, password } = req.body;

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    fullName,
    email,
    preferredCurrency,
    password: hashedPassword,
    otp,
    otpExpiry,
  });

  // Send verification email
  const html = verifyEmailTemplate({
    name: fullName,
    otp,
  });

  await sendEmail({
    to: email,
    subject: EMAIL_SUBJECTS.VERIFY_EMAIL,
    html,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        preferredCurrency: user.preferredCurrency,
      },
      "Signup successful. OTP sent to email.",
    ),
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  // Check email verification
  if (!user.isVerified) {
    throw new ApiError(400, "Please verify your email first");
  }

  // Compare password
  const isPswdMatch = await bcrypt.compare(password, user.password);

  if (!isPswdMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          preferredCurrency: user.preferredCurrency,
        },
      },
      "Login successful",
    ),
  );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email already verified");
  }

  if (String(user.otp) !== String(otp)) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (!user.isVerified) {
    throw new ApiError(400, "Please verify your email first");
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

  return res.status(200).json(new ApiResponse(200, null, "OTP sent to email"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(decoded.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: newAccessToken,
      },
      "Access token refreshed successfully",
    ),
  );
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email already verified");
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
    .json(new ApiResponse(200, null, "OTP resent to email"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  if (!user.isResetOtpVerified) {
    throw new ApiError(
      400,
      "OTP verification required before resetting password",
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  // Clear OTP data
  user.otp = null;
  user.otpExpiry = null;
  user.isResetOtpVerified = false;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.otp) {
    throw new ApiError(400, "OTP not found");
  }

  if (String(user.otp) !== String(otp)) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.otpExpiry < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  user.isResetOtpVerified = true;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP verified successfully"));
});

const resendResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isVerified) {
    throw new ApiError(400, "Please verify your email first");
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
    .json(new ApiResponse(200, null, "OTP resent to email"));
});

export {
  signup,
  verifyEmail,
  login,
  refreshToken,
  resendOtp,
  forgotPassword,
  resetPassword,
  verifyResetOtp,
  resendResetOtp,
};
