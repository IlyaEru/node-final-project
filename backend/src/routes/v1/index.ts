import express from 'express';
import { jwtStrategy, authMiddleware } from '../../api/v1/auth';
import authRoutes from '../../api/v1/auth';
import shiftRoutes from '../../api/v1/shift';
import userRoutes from '../../api/v1/user';
import departmentRoutes from '../../api/v1/department';
import employeeRoutes from '../../api/v1/employee';
import actionsMiddleware from '../../modules/actions';
import applyCommonMiddleware from '../../modules/commonMiddleware';

const router = express.Router();

router.use('/auth', authRoutes);

applyCommonMiddleware(router, shiftRoutes, '/shifts');

applyCommonMiddleware(router, userRoutes, '/users');

applyCommonMiddleware(router, departmentRoutes, '/departments');

applyCommonMiddleware(router, employeeRoutes, '/employees');

// router.use('/shifts', authMiddleware, actionsMiddleware, shiftRoutes);

// router.use('/users', authMiddleware, actionsMiddleware, userRoutes);

// router.use('/departments', authMiddleware, actionsMiddleware, departmentRoutes);

// router.use('/employees', authMiddleware, actionsMiddleware, employeeRoutes);

export default router;
