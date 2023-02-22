import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from '../../../modules/error';
import User from './user.model';
import { IUserDocument } from './user.type';
import validateCreateUser from './user.validation';

const createUser = async (
  username: string,
  email: string,
  fullName: string,
  ...args: any[]
) => {
  const userValidation = validateCreateUser({
    username,
    email,
    fullName,
    ...args,
  });
  if (userValidation.error) {
    throw new ApiError(httpStatus.BAD_REQUEST, userValidation.error.message);
  }
  const [isEmailTaken, isUsernameTaken] = await Promise.all([
    User.isEmailTaken(email),
    User.isUsernameTaken(username),
  ]);
  if (isEmailTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'email is already taken');
  }
  if (isUsernameTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'username is already taken');
  }
  const user = await User.create({ username, email, fullName, ...args });
  return user;
};

const getUserById = async (
  id: mongoose.Types.ObjectId,
): Promise<IUserDocument | null> => {
  return User.findById(id);
};

const getUserByUsername = async (
  username: string,
): Promise<IUserDocument | null> => {
  return User.findOne({ username });
};

export { createUser, getUserById, getUserByUsername };
