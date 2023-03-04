import express from 'express';
import validationMiddleware from '../../../modules/validation';

import {
  getAllUsersLeftActions,
  getUsersLeftActions,
} from './actions.controller';

const router = express.Router();

router.get('/', getAllUsersLeftActions);

router.get('/:id', validationMiddleware.idParamMiddleware, getUsersLeftActions);

export default router;
