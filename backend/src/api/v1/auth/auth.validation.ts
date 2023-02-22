import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  fullName: Joi.string().min(3).max(50).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export { registerSchema, loginSchema, refreshTokenSchema };
