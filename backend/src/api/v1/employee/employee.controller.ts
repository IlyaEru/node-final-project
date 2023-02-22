import Employee from './employee.model';
import { NextFunction, Request, Response } from 'express';
import { IEmployee } from './employee.type';
import { ApiError } from '../../../modules/error';
import httpStatus from 'http-status';
import employeeService from './employee.service';
import mongoose from 'mongoose';

const getEmployees = async (req: Request, res: Response) => {
  const employees = await Employee.find({});
  res.json({ employees });
};

const getEmployee = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const employee = await Employee.findById(id);
  if (!employee) {
    next(new ApiError(httpStatus.NOT_FOUND, 'Employee not found'));
    return;
  }
  res.json({ employee });
};

const createEmployee = async (req: Request, res: Response) => {
  const { firstName, lastName, startingWorkYear, department } = req.body;
  const employeeData: IEmployee = { firstName, lastName, startingWorkYear };
  if (department) {
    employeeData.department = department;
  }
  const employee = await Employee.create(employeeData);
  res.status(201).json({ employee });
};

const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { firstName, lastName, startingWorkYear, department } = req.body;

  const updateFields = {} as any;
  if (firstName) {
    updateFields.firstName = firstName;
  }
  if (!(await Employee.exists({ _id: id }))) {
    next(new ApiError(httpStatus.NOT_FOUND, 'Employee not found'));
    return;
  }
  if (lastName) {
    updateFields.lastName = lastName;
  }
  if (startingWorkYear) {
    updateFields.startingWorkYear = startingWorkYear;
  }
  if (department) {
    updateFields.department = department;
    employeeService.moveEmployeeToNewDepartment(id, department);
  }
  const updatedEmployee = await Employee.findByIdAndUpdate(id, updateFields, {
    new: true,
  });
  res.json({ updatedEmployee });
};

const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const employee = await Employee.findById(id);
  if (!employee) {
    next(new ApiError(httpStatus.NOT_FOUND, 'Employee not found'));
    return;
  }
  await Employee.deleteOne({ _id: id });
  res.sendStatus(httpStatus.NO_CONTENT);
};

export {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
