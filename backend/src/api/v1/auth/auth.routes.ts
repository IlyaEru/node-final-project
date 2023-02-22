import express from 'express';

import { register, login, logout, refreshTokens } from './auth.controller';
import validationMiddleware from '../../../modules/validation';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validationMiddleware.bodyMiddleware(registerSchema),
  register,
);

router.post('/login', validationMiddleware.bodyMiddleware(loginSchema), login);

router.post(
  '/logout',
  validationMiddleware.bodyMiddleware(refreshTokenSchema),
  logout,
);

router.post(
  '/refresh',
  validationMiddleware.bodyMiddleware(refreshTokenSchema),
  refreshTokens,
);

export default router;
