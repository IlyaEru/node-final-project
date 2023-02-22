import express from 'express';

import {
  getShifts,
  getShift,
  createShift,
  updateShift,
} from './shift.controller';

import validationMiddleware from '../../../modules/validation';

import { createShiftSchema, updateShiftSchema } from './shift.validation';

const router = express.Router();

router.get('/', getShifts);

router.get('/:id', validationMiddleware.idParamMiddleware, getShift);

router.post(
  '/',
  validationMiddleware.bodyMiddleware(createShiftSchema),
  createShift,
);

router.put(
  '/:id',
  validationMiddleware.idParamMiddleware,
  validationMiddleware.bodyMiddleware(updateShiftSchema),
  updateShift,
);

export default router;
