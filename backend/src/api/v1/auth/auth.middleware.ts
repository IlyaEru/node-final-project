import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ApiError } from '../../../modules/error';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    req.user = user;
    return next();
  })(req, res, next);
};

export default authMiddleware;
