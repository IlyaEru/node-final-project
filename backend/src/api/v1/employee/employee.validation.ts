import Joi from 'joi';
import mongoose from 'mongoose';

const createEmployeeSchema = Joi.object({
  firstName: Joi.string().min(3).max(40).required(),
  lastName: Joi.string().min(3).max(40).required(),
  startingWorkYear: Joi.number().min(1900).max(2100).required(),
  department: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message('Invalid department id'),
});

const updateEmployeeSchema = Joi.object({
  firstName: Joi.string().min(3).max(40),
  lastName: Joi.string().min(3).max(40),
  startingWorkYear: Joi.number().min(1900).max(2100),
  department: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message('Invalid department id'),
});

export { createEmployeeSchema, updateEmployeeSchema };
