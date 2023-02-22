import coreJoi, { date } from 'joi';
import joiDate from '@joi/date';
const Joi = coreJoi.extend(joiDate) as typeof coreJoi;

const createShiftSchema = Joi.object({
  date: Joi.date().iso().required(),
  startTime: Joi.date().iso().min(Joi.ref('date')).required(),
  endTime: Joi.date().iso().min(Joi.ref('startTime')).required(),
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
        .message('endTime must be greater than startTime'),
      otherwise: Joi.date().iso(),
    }),
});

export { createShiftSchema, updateShiftSchema };
