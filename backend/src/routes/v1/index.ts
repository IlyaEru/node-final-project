import express from 'express';
import { jwtStrategy, authMiddleware } from '../../api/v1/auth';
import authRoutes from '../../api/v1/auth';
import shiftRoutes from '../../api/v1/shift';
import userRoutes from '../../api/v1/user';
import departmentRoutes from '../../api/v1/department';
import employeeRoutes from '../../api/v1/employee';
import actionsMiddleware from '../../modules/actions';
import applyCommonMiddleware from '../../modules/commonMiddleware';
import actionsRoutes from '../../api/v1/actions';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/actions', actionsRoutes);

applyCommonMiddleware(router, shiftRoutes, '/shifts');

applyCommonMiddleware(router, userRoutes, '/users');

applyCommonMiddleware(router, departmentRoutes, '/departments');

applyCommonMiddleware(router, employeeRoutes, '/employees');

export default router;
