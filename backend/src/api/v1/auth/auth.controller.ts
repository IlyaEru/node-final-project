import { NextFunction, Request, Response } from 'express';
import { tokenService } from '../../../modules/token';
import * as authService from './auth.service';
import { userServices } from '../user';
import { getUserLeftActions } from '../../../modules/actions/actions.dal';
import { ApiError } from '../../../modules/error';
import httpStatus from 'http-status';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, fullName } = req.body;

    const user = await userServices.createUser(username, email, fullName);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.body;
    const user = await authService.loginWithUsernameAndEmail(username, email);
    const tokens = await tokenService.generateAuthTokens(user.id);
    const userActionsLeft = await getUserLeftActions(user.id);

    if (userActionsLeft <= 0) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Max actions reached'));
    }
    res.json({ user, tokens, userActionsLeft });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const refreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;

    const { user, tokens } = await authService.refreshAuth(refreshToken);

    res.json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, refreshTokens };
