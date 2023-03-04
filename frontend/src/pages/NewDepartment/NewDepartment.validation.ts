import Joi from 'joi';

const NewDepartmentValidationSchema = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  manager: Joi.string().required(),
});

const validateNewDepartment = (data: any): string[] => {
  const validationErrors = NewDepartmentValidationSchema.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: '',
      },
    },
  });
  return validationErrors.error?.details.map((error) => error.message) || [];
};

export { validateNewDepartment };
