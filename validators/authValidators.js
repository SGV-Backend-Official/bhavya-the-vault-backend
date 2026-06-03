import Joi from "joi";
const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),

    preferredCurrency: Joi.string()
      .valid("USD", "EUR", "GBP", "INR")
      .required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm password must match password",
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const verifyEmailValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const resendOtpValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};
const forgotPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const verifyResetOtpValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const resendResetOtpValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const resetPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

export {
  signupValidation,
  loginValidation,
  verifyEmailValidation,
  resendOtpValidation,
  forgotPasswordValidation,
  verifyResetOtpValidation,
  resendResetOtpValidation,
  resetPasswordValidation,
};
