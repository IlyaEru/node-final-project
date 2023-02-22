import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../error';
import httpStatus from 'http-status';
import Joi from 'joi';
import mongoose from 'mongoose';

const bodyMiddleware = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const options = {
      abortEarly: false,
      errors: {
        wrap: {
          label: '',
        },
      },
    };
    const { error } = schema.validate(req.body, options);

    if (error) {
      next(new ApiError(httpStatus.BAD_REQUEST, error.message));
    }

    next();
  };
};

const paramsMiddleware = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const options = {
      // abortEarly: false,
      errors: {
        wrap: {
          label: '',
        },
      },
    };
    const { error } = schema.validate(req.params, options);

    if (error) {
      next(new ApiError(httpStatus.BAD_REQUEST, error.message));
    }

    next();
  };
};

const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const idParamMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (objectIdSchema.validate(id).error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Invalid id'));
  }

  next();
};

export default { bodyMiddleware, paramsMiddleware, idParamMiddleware };
