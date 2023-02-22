import Joi from 'joi';

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(20).required(),
  fullName: Joi.string().min(3).max(50).required(),
  maxActions: Joi.number().default(10),
});

const options = {
  errors: {
    wrap: {
      label: '',
    },
  },
};

const validateCreateUser = (user: any) => {
  return createUserSchema.validate(user, options);
};

export default validateCreateUser;
