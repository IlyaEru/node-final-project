import Joi from 'joi';
import mongoose from 'mongoose';

const createDepartmentSchema = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  manager: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message('Invalid manager id')
    .required(),
});

const updateDepartmentSchema = Joi.object({
  name: Joi.string().min(3).max(40),
  manager: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message('Invalid manager id'),
  employees: Joi.array()
    .items(
      Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message('Invalid employee id'),
    )
    .min(0)
    .unique(),
});

export { createDepartmentSchema, updateDepartmentSchema };
