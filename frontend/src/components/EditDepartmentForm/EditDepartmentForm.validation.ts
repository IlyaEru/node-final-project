import Joi from 'joi';

const EditDepartmentFormValidation = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  manager: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  employees: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message('Invalid employee id'),
  ),
});

const validateEditDepartment = (data: any): string[] => {
  const validationErrors = EditDepartmentFormValidation.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: '',
      },
    },
  });
  return validationErrors.error?.details.map((error) => error.message) || [];
};

export { validateEditDepartment };
