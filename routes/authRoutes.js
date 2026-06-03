import { Router } from "express";
const router = Router();

import { signup } from "../controllers/auth/signupController.js";

import { login } from "../controllers/auth/loginController.js";
import { refreshToken } from "../controllers/auth/refreshTokenController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  signupValidation,
  loginValidation,
  verifyEmailValidation,
  resendOtpValidation,
  forgotPasswordValidation,
  verifyResetOtpValidation,
  resendResetOtpValidation,
  resetPasswordValidation,
} from "../validators/authValidators.js";

import { verifyEmail } from "../controllers/auth/verifyEmailController.js";

import { resendOtp } from "../controllers/auth/resendOTPController.js";

import { forgotPassword } from "../controllers/auth/forgotPasswordController.js";

import { verifyResetOtp } from "../controllers/auth/verifyResetOtpController.js";

import { resendResetOtp } from "../controllers/auth/resendResetOtpController.js";

import { resetPassword } from "../controllers/auth/resetPasswordController.js";

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/refresh-token", refreshToken);
router.post("/reset-password", resetPasswordValidation, resetPassword);

// protected test route
router.get("/test", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

router.post("/verify-email", verifyEmailValidation, verifyEmail);
router.post("/resend-otp", resendOtpValidation, resendOtp);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/verify-reset-otp", verifyResetOtpValidation, verifyResetOtp);
router.post("/resend-reset-otp", resendResetOtpValidation, resendResetOtp);
router.post("/reset-password", resetPasswordValidation, resetPassword);

export { router as authRoutes };
