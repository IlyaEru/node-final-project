import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { IUser } from '../../api/v1/user/user.type';
import { ApiError } from '../error';
import { addAction, getUserLeftActions } from './actions.dal';

export const actionsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
  }

  const user = req.user as IUser;
  const userActionsLeft = await getUserLeftActions(user._id.toString());
  res.set('X-User-Actions-Left', userActionsLeft.toString());

  if (userActionsLeft <= 0) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Max actions reached'));
  }

  addAction(user._id.toString());

  next();
};
