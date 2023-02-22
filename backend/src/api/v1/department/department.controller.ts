import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from '../../../modules/error';
import employeeService from '../employee/employee.service';

import Department from './department.model';
import departmentService from './department.service';

const getDepartments = async (req: Request, res: Response) => {
  const departments = await Department.find({});
  res.json({ departments });
};

const getDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const department = await Department.findById(id);
  if (!department) {
    next(new ApiError(httpStatus.NOT_FOUND, 'Department not found'));
    return;
  }
  res.json({ department });
};

const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, manager } = req.body;
  const isDepartmentNameTaken = await Department.isNameTaken(name);
  if (isDepartmentNameTaken) {
    next(
      new ApiError(httpStatus.BAD_REQUEST, 'Department name is already taken'),
    );
    return;
  }
  const department = await Department.create({ name, manager });
  res.status(201).json({ department });
};

const updateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { name, manager, employees } = req.body;

  const updateFields = {} as any;
  if (name) {
    updateFields.name = name;
    const isDepartmentNameTaken = await Department.isNameTaken(name, id);
    if (isDepartmentNameTaken) {
      next(
        new ApiError(
          httpStatus.BAD_REQUEST,
          'Department name is already taken',
        ),
      );
      return;
    }
  }
  if (manager) {
    updateFields.manager = manager;
  }
  if (employees) {
    updateFields.employees = employees;
    departmentService.moveEmployeesToNewDepartment(employees, id);
  }

  if (!(await Department.exists({ _id: id }))) {
    next(new ApiError(httpStatus.NOT_FOUND, 'Department not found'));
    return;
  }
  const department = await Department.findByIdAndUpdate(id, updateFields, {
    new: true,
  });
  res.json({ department });
};

const deleteDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const department = await Department.findById(id);
  if (!department) {
    next(new ApiError(httpStatus.NOT_FOUND, 'Department not found'));
    return;
  }
  await Department.deleteOne({ _id: id });
  res.sendStatus(httpStatus.NO_CONTENT);
};

export {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
