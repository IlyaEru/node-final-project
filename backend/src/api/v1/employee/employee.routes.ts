import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from './employee.controller';

import validationMiddleware from '../../../modules/validation';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from './employee.validation';

const router = express.Router();

router.get('/', getEmployees);

router.get('/:id', validationMiddleware.idParamMiddleware, getEmployee);

router.post(
  '/',
  validationMiddleware.bodyMiddleware(createEmployeeSchema),
  createEmployee,
);

router.put(
  '/:id',
  validationMiddleware.idParamMiddleware,
  validationMiddleware.bodyMiddleware(updateEmployeeSchema),
  updateEmployee,
);

router.delete('/:id', validationMiddleware.idParamMiddleware, deleteEmployee);

export default router;
