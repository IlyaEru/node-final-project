import Joi from 'joi';

const EditEmployeeFormValidation = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  startingWorkYear: Joi.number()
    .messages({
      'number.base': 'Starting work year must be a number',
    })
    .min(1900)
    .messages({
      'number.min': 'Starting work year must be greater than 1900',
    })
    .max(2100)
    .messages({
      'number.max': 'Starting work year must be less than 2100',
    })
    .required(),
  department: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(''),
});

const validateEditEmployee = (data: any): string[] => {
  const validationErrors = EditEmployeeFormValidation.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: '',
      },
    },
  });
  return validationErrors.error?.details.map((error) => error.message) || [];
};

export { validateEditEmployee };
