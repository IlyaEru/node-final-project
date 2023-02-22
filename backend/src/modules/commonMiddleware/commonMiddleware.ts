import { Router, RequestHandler } from 'express';
import { authMiddleware } from '../../api/v1/auth';
import actionsMiddleware from '../actions';

const applyCommonMiddleware = (
  router: Router,
  requestHandler: RequestHandler,
  path = '/',
): void => {
  const environment = process.env.NODE_ENV || 'development';

  if (environment === 'development' || environment === 'test') {
    router.use(path, authMiddleware, requestHandler);
    return;
  }
  router.use(path, authMiddleware, actionsMiddleware, requestHandler);
};

export default applyCommonMiddleware;
