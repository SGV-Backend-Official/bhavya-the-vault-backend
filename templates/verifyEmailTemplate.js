const verifyEmailTemplate = ({ otp, name }) => {
  return `
    <div>
      <h2>Email Verification</h2>

      <p>Hello ${name},</p>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;
};

export { verifyEmailTemplate };
