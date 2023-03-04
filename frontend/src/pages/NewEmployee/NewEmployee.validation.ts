import Joi from 'joi';

const NewEmployeeValidation = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  startingWorkYear: Joi.number()
    .messages({
      'number.base': 'Starting work year must be a number',
    })
    .min(1900)
    .max(2100)
    .required(),
});

const validateNewEmployee = (data: any): string[] => {
  const validationErrors = NewEmployeeValidation.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: '',
      },
    },
  });
  return validationErrors.error?.details.map((error) => error.message) || [];
};

export default validateNewEmployee;
