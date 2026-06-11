const resetPasswordTemplate = ({ name, otp }) => {
  return `
    <div>
      <h2>Password Reset Request</h2>

      <p>Hello ${name},</p>

      <p>Your password reset OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP is valid for 10 minutes.</p>

      <p>
        If you did not request this password reset,
        please ignore this email.
      </p>

      <p>The Vault Team</p>
    </div>
  `;
};

export { resetPasswordTemplate };
