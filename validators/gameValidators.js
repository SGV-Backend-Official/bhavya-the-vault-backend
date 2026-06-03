import Joi from "joi";

const createGameValidation = (req, res, next) => {
  const schema = Joi.object({
    gameName: Joi.string().trim().required(),

    gameType: Joi.string().valid("Cash Game", "Tournament").required(),
    amount: Joi.number().min(0).required(),
    rake: Joi.number().min(0).required(),
    gameDate: Joi.date().required(),
    gameTime: Joi.string().trim().required(),
    players: Joi.array().items(Joi.string().hex().length(24)).min(2).required(),
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

export { createGameValidation };
