import Joi from 'joi';

const LoginValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  username: Joi.string().min(2).max(20).required(),
});

const validateLogin = (data: any): string[] => {
  const validationErrors = LoginValidation.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: '',
      },
    },
  });
  return validationErrors.error?.details.map((error) => error.message) || [];
};

export default validateLogin;
