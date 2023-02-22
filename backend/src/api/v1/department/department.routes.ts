import express from 'express';

import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from './department.controller';

import validationMiddleware from '../../../modules/validation';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from './department.validation';

const router = express.Router();

router.get('/', getDepartments);

router.get('/:id', validationMiddleware.idParamMiddleware, getDepartment);

router.post(
  '/',
  validationMiddleware.bodyMiddleware(createDepartmentSchema),
  createDepartment,
);

router.put(
  '/:id',
  validationMiddleware.bodyMiddleware(updateDepartmentSchema),
  validationMiddleware.idParamMiddleware,
  updateDepartment,
);

router.delete('/:id', validationMiddleware.idParamMiddleware, deleteDepartment);

export default router;
