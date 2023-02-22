import { Request, Response, NextFunction } from 'express';
import ApiError from './ApiError';
// eslint-disable-next-line no-unused-vars
export default function ApiErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.code).json({
      error: {
        message: err.message,
      },
    });
  }
  return res.status(500).json({
    error: {
      message: 'Something went wrong',
    },
  });
}
