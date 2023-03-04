import coreJoi, { date } from 'joi';
import joiDate from '@joi/date';
const Joi = coreJoi.extend(joiDate) as typeof coreJoi;

const createShiftSchema = Joi.object({
  date: Joi.date().iso().required(),
  startTime: Joi.date().iso().min(Joi.ref('date')).required(),
  endTime: Joi.date().iso().min(Joi.ref('startTime')).required(),
  employees: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message('Invalid employee id'),
  ),
});

const updateShiftSchema = Joi.object({
  date: Joi.date().iso(),
  startTime: Joi.date().iso(),
  endTime: Joi.date()
    .iso()
    .when('startTime', {
      is: Joi.exist(),
      then: Joi.date()
        .iso()
        .greater(Joi.ref('startTime'))
        .message('End Time must be greater than Start Time'),
      otherwise: Joi.date().iso(),
    }),
  employees: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message('Invalid employee id'),
  ),
});

export { createShiftSchema, updateShiftSchema };
