import httpStatus from 'http-status';
import { ApiError } from '../../../modules/error';
import Department from '../department/department.model';
import Employee from './employee.model';

const moveEmployeeToNewDepartment = async (
  employeeId: string,
  newDepartmentId: string,
) => {
  const employee = await Employee.findById(employeeId);

  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }
  const oldEmployeeDepartmentId = employee.department;
  if (oldEmployeeDepartmentId) {
    if (oldEmployeeDepartmentId === newDepartmentId) {
      return;
    }
    try {
      await Department.findByIdAndUpdate(oldEmployeeDepartmentId, {
        $pull: { employees: employeeId },
      });
    } catch (error: any) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Department not found');
    }
  }
  try {
    const resp = await Department.findByIdAndUpdate(newDepartmentId, {
      $push: { employees: employeeId },
    });
  } catch (error: any) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department not found');
  }
};

export default {
  moveEmployeeToNewDepartment,
};
