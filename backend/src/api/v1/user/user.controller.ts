import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../../modules/error';
import User from './user.model';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    next(ApiError.internal('Something went wrong'));
  }
};

export default getUsers;
