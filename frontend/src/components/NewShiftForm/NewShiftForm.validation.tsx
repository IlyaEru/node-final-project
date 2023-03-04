import Joi from 'joi';

const NewShiftFormValidationSchema = Joi.object({
  date: Joi.date().iso().required(),
  startTime: Joi.date()
    .iso()
    .min(Joi.ref('date'))
    .messages({
      'date.min': 'Start time must be after date',
    })
    .required(),
  endTime: Joi.date()
    .iso()
    .min(Joi.ref('startTime'))
    .messages({
      'date.min': 'End time must be after start time',
    })
    .required(),
  employees: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message('Invalid employee id'),
  ),
});

const validateNewShift = (data: any) => {
  const validationErrors = NewShiftFormValidationSchema.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: '',
      },
    },
  });
  return validationErrors.error?.details.map((error) => error.message) || [];
};

export { validateNewShift };
