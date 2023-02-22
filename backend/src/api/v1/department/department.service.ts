import httpStatus from 'http-status';
import { ApiError } from '../../../modules/error';
import Department from './department.model';
import Employee from '../employee/employee.model';

const moveEmployeesToNewDepartment = async (
  employees: string[],
  departmentId: string,
) => {
  employees.forEach(async (employeeId: string) => {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
    }
    if (employee.department === departmentId) {
      return;
    }
    if (!employee.department || employee.department !== departmentId) {
      try {
        await Employee.findByIdAndUpdate(employeeId, {
          department: departmentId,
        });
      } catch (error: any) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Department not found');
      }
    }
  });
};

export default {
  moveEmployeesToNewDepartment,
};
