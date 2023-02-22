import Joi from 'joi';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

const generateTokenSchema = Joi.object({
  userId: Joi.custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'valid ObjectId').required(),
  type: Joi.string().valid('access', 'refresh').required(),
  expires: Joi.custom((value, helpers) => {
    if (!dayjs.isDayjs(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'valid Dayjs').required(),
});

const saveTokenSchema = Joi.object({
  userId: Joi.custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'valid ObjectId').required(),
  token: Joi.string().required(),
  type: Joi.string().valid('access', 'refresh').required(),
  expires: Joi.custom((value, helpers) => {
    if (!dayjs.isDayjs(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'valid Dayjs').required(),
  blacklisted: Joi.boolean().default(false),
});

const verifyTokenSchema = Joi.object({
  token: Joi.string().required(),
  type: Joi.string().valid('access', 'refresh').required(),
});

const generateAuthTokensSchema = Joi.object({
  userId: Joi.custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'valid ObjectId').required(),
});

export {
  generateTokenSchema,
  saveTokenSchema,
  verifyTokenSchema,
  generateAuthTokensSchema,
};
